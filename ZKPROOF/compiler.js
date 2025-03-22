import { writeFile, readFileSync } from 'fs';

/**
 * Converts graph data (nodes and edges) into an assertion string
 * @param {Object[]} nodes - Array of node objects with id and type properties
 * @param {Object[]} edges - Array of edge objects with source and target properties
 * @returns {string} - Assertion string
 */
function graphToAssertion(nodes, edges) {
  // Create a map of nodes by ID for easy reference
  const nodesMap = {};
  nodes.forEach(node => {
    nodesMap[node.id] = { ...node, inputs: [], outputs: [] };
  });
  
  // Add input and output connections for each node
  edges.forEach(edge => {
    nodesMap[edge.source].outputs.push(edge.target);
    nodesMap[edge.target].inputs.push(edge.source);
  });
  
  // Find assertion nodes
  const assertionNodes = nodes
    .filter(node => node.type === "assertion")
    .map(node => node.id);
  
  // Generate assertions
  const assertions = [];
  
  for (const assertionId of assertionNodes) {
    const assertionNode = nodesMap[assertionId];
    const inputs = assertionNode.inputs;
    
    if (inputs.length !== 2) {
      console.warn(`Assertion node ${assertionId} doesn't have exactly 2 inputs`);
      continue;
    }
    
    const leftSide = buildExpression(inputs[0], nodesMap);
    const rightSide = buildExpression(inputs[1], nodesMap);
    
    assertions.push(`${leftSide} == ${rightSide}`);
  }
  
  return assertions.join(" && ");
}

/**
 * Recursively builds an expression for a node
 * @param {string} nodeId - ID of the node to build expression for
 * @param {Object} nodesMap - Map of all nodes
 * @returns {string} - Expression string
 */
function buildExpression(nodeId, nodesMap) {
  const node = nodesMap[nodeId];
  
  switch (node.type) {
    case "pub_input":
    case "priv_input":
      return `${node.type}_${node.id}`;
      
    case "sum":
      // Sort inputs to ensure consistent order
      const sumInputs = [...node.inputs].sort();
      return sumInputs.map(input => buildExpression(input, nodesMap)).join(" + ");
      
    case "multiplication":
      // Sort inputs to ensure consistent order
      const multInputs = [...node.inputs].sort();
      return multInputs.map(input => buildExpression(input, nodesMap)).join(" * ");
      
    default:
      // For other node types (like interim results)
      if (node.inputs.length === 1) {
        return buildExpression(node.inputs[0], nodesMap);
      } else if (node.inputs.length > 1) {
        // Handle complex expressions based on the node's operation type
        // Default to treating it as a composition of operations
        return `(${node.inputs.map(input => buildExpression(input, nodesMap)).join(" op ")})`;
      }
      return `unknown_${node.id}`;
  }
}

/**
 * Wrapper function that returns the formatted answer
 * @param {Object[]} nodes - Array of node objects
 * @param {Object[]} edges - Array of edge objects
 * @returns {string} - Formatted answer string
 */
function generateAssertionString(nodes, edges) {
  const assertion = graphToAssertion(nodes, edges);
  return `${assertion}`;
}

// Read the 'graph.json' file synchronously
const data = readFileSync('graph.json', 'utf8');

// Parse the JSON data
const graph = JSON.parse(data);

// Extract 'nodes' and 'edges'
const nodes = graph.nodes;
const edges = graph.edges;

// Output the nodes and edges
console.log('Nodes:', nodes);
console.log('Edges:', edges);


// const nodes = JSON.parse("[{\"id\":\"1\",\"type\":\"pub_input\"},{\"id\":\"2\",\"type\":\"assertion\"},{\"id\":\"3\",\"type\":\"priv_input\"}]")
// const edges = JSON.parse("[{\"source\":\"1\",\"target\":\"2\"},{\"source\":\"3\",\"target\":\"2\"}]")

//const nodes = [{"id":"1","type":"pub_input"},{"id":"2","type":"priv_input"},{"id":"3","type":"sum"},{"id":"4","type":"priv_input"},{"id":"5","type":"assertion"}]
//const edges = [{"source":"2","target":"3"},{"source":"1","target":"3"},{"source":"4","target":"5"},{"source":"3","target":"5"}];
const assertionString = generateAssertionString(nodes, edges)
console.log(assertionString);

function generateRustCode(conditionString) {
  // Extract all variable names from the condition
  const variableRegex = /(priv|pub)_input_\d+/g;
  const matches = conditionString.match(variableRegex) || [];
  
  // Create a Set to get unique variable names
  const uniqueVars = [...new Set(matches)];
  
  // Separate variables into private and public
  const privateVars = uniqueVars.filter(v => v.startsWith('priv_'));
  const publicVars = uniqueVars.filter(v => v.startsWith('pub_'));
  
  // Generate function arguments string
  const args = uniqueVars.map(varName => {
    if (varName.startsWith('pub_')) {
      return `${varName}: pub u8`;
    } else {
      return `${varName}: u8`;
    }
  }).join(', ');
  
  // Generate the Rust function
  return `fn main(
    ${args}
) {
    assert(${conditionString});
}`;
}

const rustCode = generateRustCode(assertionString);
console.log(rustCode);


writeFile('./noir_proj/src/main.nr', rustCode, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('File has been saved!');
  }
});