import { Node, Edge } from '@xyflow/react';
import { WorkflowPlan } from '../lib/automationLLM';

// Add public workflow templates
export const publicWorkflows: WorkflowPlan[] = [
  {
    id: 'pub-age-verifier',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate age input and range',
        zkParams: {
          visibility: 'private',
          dataType: 'uint',
          constraints: ['age > 0', 'age < 150']
        }
      },
      {
        type: 'computation',
        input: 'Compare age with threshold',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'boolean',
          constraints: ['isAdult = age >= ADULT_AGE']
        }
      },
      {
        type: 'proof_generation',
        input: 'Generate age verification proof',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['proof = generateProof(isAdult)']
        }
      }
    ],
    description: 'Simple age verification without revealing actual age',
    circuitName: 'SimpleAgeVerifier',
    framework: 'noir',
    publicInputs: ['is_adult'],
    privateInputs: ['age'],
    initialNodes: [
      {
        id: 'age-input',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Age Input',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'uint'
          }
        }
      },
      {
        id: 'age-check',
        type: 'step',
        position: { x: 300, y: 100 },
        data: {
          label: 'Age Check',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'boolean'
          }
        }
      },
      {
        id: 'age-proof',
        type: 'step',
        position: { x: 200, y: 250 },
        data: {
          label: 'Generate Proof',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'age-input', target: 'age-check', animated: true },
      { id: 'e2-3', source: 'age-check', target: 'age-proof', animated: true }
    ]
  },
  {
    id: 'pub-password-verifier',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate password hash',
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['hash.length == 32']
        }
      },
      {
        type: 'computation',
        input: 'Check password against stored hash',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'boolean',
          constraints: ['matches = verifyHash(password, storedHash)']
        }
      },
      {
        type: 'proof_generation',
        input: 'Generate password verification proof',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['proof = generateProof(matches)']
        }
      }
    ],
    description: 'Password verification without revealing the password',
    circuitName: 'PasswordVerifier',
    framework: 'circom',
    publicInputs: ['stored_hash', 'is_valid'],
    privateInputs: ['password'],
    initialNodes: [
      {
        id: 'pass-input',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Password Input',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'hash-verify',
        type: 'step',
        position: { x: 300, y: 100 },
        data: {
          label: 'Hash Verification',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'boolean'
          }
        }
      },
      {
        id: 'proof-gen',
        type: 'step',
        position: { x: 200, y: 250 },
        data: {
          label: 'Proof Generation',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'pass-input', target: 'hash-verify', animated: true },
      { id: 'e2-3', source: 'hash-verify', target: 'proof-gen', animated: true }
    ]
  }
];

// Keep existing mockWorkflows
export const mockWorkflows: WorkflowPlan[] = [
  {
    id: 'mock-private-tx',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate transaction amount and recipient address',
        zkParams: {
          visibility: 'private',
          dataType: 'uint',
          constraints: ['amount > 0', 'amount <= MAX_UINT']
        }
      },
      {
        type: 'computation',
        input: 'Hash transaction details and generate commitment',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['commitment = hash(amount, recipient, nonce)']
        }
      },
      {
        type: 'proof_generation',
        input: 'Generate proof of valid transaction',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['verifyTransaction(commitment, nullifier)']
        }
      },
      {
        type: 'verification',
        input: 'Verify transaction proof on-chain',
        dependencies: ['2'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['verify(proof, publicInputs)']
        }
      }
    ],
    description: 'Private transaction proof using Aztec Protocol',
    circuitName: 'PrivateTransactionCircuit',
    framework: 'aztec',
    publicInputs: ['commitment', 'nullifier'],
    privateInputs: ['amount', 'recipient', 'nonce'],
    initialNodes: [
      {
        id: 'input-1',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Transaction Inputs',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'uint'
          }
        }
      },
      {
        id: 'hash-1',
        type: 'step',
        position: { x: 100, y: 250 },
        data: {
          label: 'Hash Generation',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'proof-1',
        type: 'step',
        position: { x: 400, y: 175 },
        data: {
          label: 'ZK Proof',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'input-1', target: 'hash-1', animated: true },
      { id: 'e2-3', source: 'hash-1', target: 'proof-1', animated: true }
    ]
  },
  {
    id: 'mock-merkle-proof',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate Merkle proof components',
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['validateMerkleProof(proof, root)']
        }
      },
      {
        type: 'computation',
        input: 'Compute Merkle path verification',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'boolean',
          constraints: ['isValid = verifyMerklePath(leaf, path, root)']
        }
      },
      {
        type: 'proof_generation',
        input: 'Generate ZK proof of Merkle membership',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['proof = generateMerkleProof(leaf, path)']
        }
      },
      {
        type: 'smart_contract_integration',
        input: 'Deploy Merkle verifier contract',
        dependencies: ['2'],
        zkParams: {
          visibility: 'public',
          dataType: 'field',
          constraints: ['deployVerifier(merkleRoot)']
        }
      }
    ],
    description: 'Zero-knowledge Merkle tree membership proof',
    circuitName: 'MerkleProofVerifier',
    framework: 'circom',
    publicInputs: ['merkle_root', 'leaf_hash'],
    privateInputs: ['merkle_path', 'leaf_data'],
    initialNodes: [
      {
        id: 'merkle-input',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Merkle Inputs',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'path-verify',
        type: 'step',
        position: { x: 400, y: 100 },
        data: {
          label: 'Path Verification',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'boolean'
          }
        }
      },
      {
        id: 'merkle-proof',
        type: 'step',
        position: { x: 250, y: 250 },
        data: {
          label: 'Merkle Proof',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'merkle-input', target: 'path-verify', animated: true },
      { id: 'e2-3', source: 'path-verify', target: 'merkle-proof', animated: true }
    ]
  },
  {
    id: 'mock-semaphore',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate identity commitment inputs',
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['validateIdentityInputs(commitment)']
        }
      },
      {
        type: 'computation',
        input: 'Generate Semaphore identity proof',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['identity = generateSemaphoreProof(signal)']
        }
      },
      {
        type: 'proof_generation',
        input: 'Create anonymous group membership proof',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['proof = proveGroupMembership(identity, group)']
        }
      },
      {
        type: 'verification',
        input: 'Verify Semaphore proof',
        dependencies: ['2'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['verify(proof, signal, group)']
        }
      }
    ],
    description: 'Anonymous voting using Semaphore protocol',
    circuitName: 'SemaphoreVoting',
    framework: 'noir',
    publicInputs: ['group_id', 'signal_hash'],
    privateInputs: ['identity_nullifier', 'identity_trapdoor'],
    initialNodes: [
      {
        id: 'identity-input',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Identity Validation',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'semaphore-id',
        type: 'step',
        position: { x: 400, y: 100 },
        data: {
          label: 'Semaphore Identity',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'group-proof',
        type: 'step',
        position: { x: 250, y: 250 },
        data: {
          label: 'Group Membership',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      },
      {
        id: 'verify',
        type: 'step',
        position: { x: 400, y: 400 },
        data: {
          label: 'Proof Verification',
          type: 'verification',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'identity-input', target: 'semaphore-id', animated: true },
      { id: 'e2-3', source: 'semaphore-id', target: 'group-proof', animated: true },
      { id: 'e3-4', source: 'group-proof', target: 'verify', animated: true }
    ]
  }
];

export const initialWorkflows: WorkflowPlan[] = [
  {
    id: 'init-range-proof',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate range proof inputs',
        zkParams: {
          visibility: 'private',
          dataType: 'uint',
          constraints: ['value >= MIN_VALUE', 'value <= MAX_VALUE']
        }
      },
      {
        type: 'computation',
        input: 'Calculate range boundaries',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'uint',
          constraints: ['range = value / RANGE_SIZE']
        }
      },
      {
        type: 'proof_generation',
        input: 'Generate range proof',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['proof = generateRangeProof(value, range)']
        }
      }
    ],
    description: 'Basic range proof example using Aztec',
    circuitName: 'BasicRangeProof',
    framework: 'aztec',
    publicInputs: ['range_id', 'is_in_range'],
    privateInputs: ['value'],
    initialNodes: [
      {
        id: 'range-input',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Range Input',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'uint'
          }
        }
      },
      {
        id: 'range-calc',
        type: 'step',
        position: { x: 300, y: 100 },
        data: {
          label: 'Range Calculation',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'uint'
          }
        }
      },
      {
        id: 'range-proof',
        type: 'step',
        position: { x: 200, y: 250 },
        data: {
          label: 'Range Proof',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'range-input', target: 'range-calc', animated: true },
      { id: 'e2-3', source: 'range-calc', target: 'range-proof', animated: true }
    ]
  },
  {
    id: 'init-nullifier',
    steps: [
      {
        type: 'input_validation',
        input: 'Validate nullifier hash',
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['nullifier.length == 32']
        }
      },
      {
        type: 'computation',
        input: 'Generate commitment',
        dependencies: ['0'],
        zkParams: {
          visibility: 'private',
          dataType: 'field',
          constraints: ['commitment = hash(nullifier, secret)']
        }
      },
      {
        type: 'proof_generation',
        input: 'Generate nullifier proof',
        dependencies: ['1'],
        zkParams: {
          visibility: 'public',
          dataType: 'boolean',
          constraints: ['proof = generateNullifierProof(commitment)']
        }
      }
    ],
    description: 'Simple nullifier example using Noir',
    circuitName: 'NullifierExample',
    framework: 'noir',
    publicInputs: ['commitment_hash'],
    privateInputs: ['nullifier', 'secret'],
    initialNodes: [
      {
        id: 'nullifier-input',
        type: 'step',
        position: { x: 100, y: 100 },
        data: {
          label: 'Nullifier Input',
          type: 'input_validation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'commitment-gen',
        type: 'step',
        position: { x: 300, y: 100 },
        data: {
          label: 'Commitment Generation',
          type: 'computation',
          zkParams: {
            visibility: 'private',
            dataType: 'field'
          }
        }
      },
      {
        id: 'nullifier-proof',
        type: 'step',
        position: { x: 200, y: 250 },
        data: {
          label: 'Nullifier Proof',
          type: 'proof_generation',
          zkParams: {
            visibility: 'public',
            dataType: 'boolean'
          }
        }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'nullifier-input', target: 'commitment-gen', animated: true },
      { id: 'e2-3', source: 'commitment-gen', target: 'nullifier-proof', animated: true }
    ]
  }
]; 
