'use client'
import { GoogleGenerativeAI, GenerativeModel, GenerativeContentResult } from "@google/generative-ai";
import axios from "axios"; // For making HTTP requests to financial APIs
const baseUrl = 'https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/';

const genAI = new GoogleGenerativeAI("AIzaSyBCBIiMXwnTmiZ44fMeu1XAc8pea3Qbk-M");

// Tool function implementations
async function getCompanyNews(symbol) {
  console.log(`🔍 Running getCompanyNews tool for ${symbol}`);
  // In a real implementation, you would call a news API
  try {
    const newsmodel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      tools: [
        {
          googleSearch: {},
        },
      ],
    });
    const newsQuery = `Get the latest news about ${symbol}, format it as following: \n
    - news 1 (short sentence)\n - news 2 (short sentence)\n - news 3 (short sentence)\n`;
    const newsResult = await newsmodel.generateContent(newsQuery);
    const newsResponse = newsResult.response.text();
    return {type: "ai_agent", data: {label: newsResponse}};
  } catch (error) {
    return `Error fetching news: ${error.message}`;
  }
}

async function getStockPrice(symbol) {
  console.log(`💹 Running getStockPrice tool for ${symbol}`);
  // In a real implementation, you would call a stock API
  try {
    const stockmodel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      tools: [
        {
          googleSearch: {},
        },
      ],
    });
    const stockQuery = `Get the current stock price for ${symbol}`;
    const stockResult = await stockmodel.generateContent(stockQuery);
    const stockResponse = stockResult.response.text();
    return {type: "ai_agent", data: {label: stockResponse}};
  } catch (error) {
    return `Error fetching stock price: ${error.message}`;
  }
}

async function getCompanySummary(name) {
  console.log(`📊 Running getCompanySummary tool for ${name}`);
  // In a real implementation, you would call a company info API
  try {
    try {
      const stockmodel = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        tools: [
          {
            googleSearch: {},
          },
        ],
      });
      const stockQuery = `Find about the company ${name} and summarize what it does in one sentence`;
      const stockResult = await stockmodel.generateContent(stockQuery);
      const stockResponse = stockResult.response.text();
      return {type: "ai_agent", data: {label: stockResponse}};
    } catch (error) {
      return `Error fetching stock price: ${error.message}`;
    }
  } catch (error) {
    return `Error fetching company summary: ${error.message}`;
  }
}

async function getHistoricalPriceData(query, first, last) {
  console.log(`📈 Running getHistoricalPriceData tool for ${query} from ${first} to ${last || 'present'}`);
  // In a real implementation, you would call a financial data API
  try {
    let url = `${baseUrl}ohlcv?query=${encodeURIComponent(query)}&first=${encodeURIComponent(first)}`;
    if (last) {
        url += `&last=${encodeURIComponent(last)}`;
    }
    const response = await axios.post(url);
    let a = JSON.parse(response.data.object)
    let b = JSON.parse(a.data)
    // console.log("bo0", b);
    let stock_prices = JSON.parse(Object.values(b)[0])
    return {type: "historical_data", data: {label: query, prices: stock_prices}};
  } catch (error) {
    return `Error fetching historical price data: ${error.message}`;
  }
}

const get_company_news_schema = {
  name: "getCompanyNews",
  description: "Get the latest news articles about a company",
  parameters: {
    type: "object",
    properties: {
      symbol: {
        type: "string",
        description: "The stock symbol of the company"
      }
    },
    required: ["symbol"]
  }
};

const get_historical_price_data_schema = {
  name: "getHistoricalPriceData",
  description: "Get historical price data for a specific company or stock",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The name of the company or stock"
      },
      first: {
        type: "string", 
        description: "The starting date for the historical data in format (dd.mm.yyyy). If the user doesn't specify the day of the month, the first day of the month will be used. If the user doesn't specify the month, the first month of the year will be used."
      },
      last: {
        type: "string",
        description: "The ending date for the historical data in format (dd.mm.yyyy), or null for current date"
      }
    },
    required: ["query", "first"]
  }
};

const get_stock_price_schema = {
  name: "getStockPrice",
  description: "Get the current stock price for a company",
  parameters: {
    type: "object",
    properties: {
      symbol: {
        type: "string",
        description: "The stock symbol of the company"
      }
    },
    required: ["symbol"]
  }
};

const get_company_summary_schema = {
  name: "getCompanySummary",
  description: "Get a summary of what the company does",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the company"
      }
    },
    required: ["name"]
  }
};

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  tools: [
    // {
    //   googleSearch: {},
    // },
    {
      functionDeclarations: [
        get_company_news_schema,
        get_stock_price_schema,
        get_company_summary_schema,
        get_historical_price_data_schema
      ]
    }
  ],
});

export async function getResult(tool) {
  console.log(`🔧 Running tool: ${tool}`);
  let result = { type: "", data: {} };
  switch (tool.name) {
    case "getCompanyNews":
      result = await getCompanyNews(tool.args.symbol);
      break;
    case "getStockPrice":
      result = await getStockPrice(tool.args.symbol);
      break;
    case "getCompanySummary":
      result = await getCompanySummary(tool.args.name);
      break;
    case "getHistoricalPriceData":
      result = await getHistoricalPriceData(tool.args.query, tool.args.first, tool.args.last);
      break;
    default:
      console.log("Unknown tool");
      result = { type: "unknown", data: { name: "query" } };
  }
  return { type: result.type, data: result.data };
}

export async function level0graph(companyQuery) {
  
  console.log(`🔎 Query: ${companyQuery}`);
  
  // First generate the content and get tool calls
  const result = await model.generateContent(companyQuery);
  let response = result.response;
  
  // console.log("\n📊 Debug - Response structure:");
  // console.log("Response:", response.text());
  
  // Check if there are any tool calls
  const toolCalls = response.functionCalls();
  
  if (toolCalls && toolCalls.length > 0) {
    console.log("\n📋 Tools used:");
    // Display tool results
    let id = 0;
    const nodes = toolCalls.map( (tool, index) => {
      console.log(`\n🔧 Tool: ${JSON.stringify(tool)}`);
      let type = "ai_agent";
      if (tool.name === "getHistoricalPriceData") {
        type = "historical_data";
      }
      let result = {type: type, data: {label: `Retrieving infomation with ${tool.name}`}};
      // let result = await getResult(tool);
      // console.log(`🔍 Result: ${JSON.stringify(result)}`);
      result.id = id.toString();
      result.position = { x: 500 * id, y: 0 }; // Multiply 100 by the id to move nodes
      result.data.tool = tool;
      id++;
      return result;
    });
    console.log("\n📊 Nodes:", nodes);
    return {text: response.text(), nodes: nodes};
  } else {
    return {text: response.text(), nodes: []}
  }
}