
"I can use several tools to retrieve information related to companies, indexes, commodities, and exchange rates. Here are the main tools available:\n\n1. **Search_With_Criteria**: To search for companies based on specific criteria.\n2. **Historical_Price_Data**: To obtain historical price data for a specific company.\n3. **Winners_Losers**: To get information about the best and worst performing companies in a specific market over a defined time frame.\n4. **Company_Data_Search**: To retrieve detailed information about one or more companies, such as employee numbers, financial data, and ratios.\n5. **Show_Summary**: To provide a summary of information about specific companies.\n6. **Listing_List_Price**: To get the prices of indexes, commodities, exchange rates, or economic data.\n7. **Listing_List_Info**: To obtain detailed information about indexes, commodities, exchange rates, or economic data.\n8. **Field_Query**: To check if a specific field of data is available in the database.\n\nIf you have any specific questions or need information, feel free to ask!"

// I can use several tools to retrieve information related to companies, indexes, commodities, and exchange rates. Here’s a brief overview of the tools and the arguments you can specify:\n\n1. **Search_With_Criteria**: \n   - **Arguments**: A dictionary where keys are concepts (like 'currency', 'employees', 'ebitda', 'bourse code') and values are the criteria to apply.\n\n2. **Historical_Price_Data**: \n   - **Arguments**: \n     - `query`: The name of the company.\n     - `first`: The start date in the format (dd.mm.yyyy).\n     - `last`: The end date in the format (dd.mm.yyyy) or null for the default period.\n\n3. **Winners_Losers**: \n   - **Arguments**: \n     - `market`: The market name.\n     - `list_type`: Type of list (e.g., \"Winner By Market\", \"Loser By Market\").\n     - `time_frame`: Time frame for the data (e.g., \"1 Day\", \"1 Month\").\n     - `additional_metrics`: Any additional metrics you want to retrieve.\n\n4. **Company_Data_Search**: \n   - **Arguments**: A dictionary where keys are company names and values are the information to retrieve, with optional date specification.\n\n5. **Show_Summary**: \n   - **Arguments**: The name of the company or companies (separated by semicolons).\n\n6. **Listing_List_Price**: \n   - **Arguments**: \n     - `query`: The name of the index, commodity, or exchange rate.\n     - `category`: The category (Indexes, Commodities, Exchange Rates, Economic Data).\n     - `first`: The start date in the format (dd.mm.yyyy).\n     - `last`: The end date in the format (dd.mm.yyyy) or null.\n\n7. **Listing_List_Info**: \n   - **Arguments**: \n     - `query`: The name of the index, commodity, or exchange rate.\n     - `category`: The category (Indexes, Commodities, Exchange Rates, Economic Data).\n     - `information`: The specific information you want to retrieve.\n\n8. **Field_Query**: \n   - **Arguments**: \n     - `query`: The field name to check.\n     - `search`: Boolean to restrict search to fields available for filtering (default is false).\n\nIf you have a specific request, please let me know, and I can assist you further!",
//       "additional_kwargs": {
//         "refusal": null

const axios = require('axios');

const baseUrl = 'https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/';

async function getResponse(query) {
    try {
        const response = await axios.post(`${baseUrl}query?query=${encodeURIComponent(query)}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getResponse:', error.message);
        throw error;
    }
}

async function searchWithCriteria(query) {
    try {
        const response = await axios.post(`${baseUrl}searchwithcriteria?query=${encodeURIComponent(query)}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error in searchWithCriteria:', error.message);
        throw error;
    }
}

async function ohlcv(query, first = '01.01.2024', last = null) {
    try {
        let url = `${baseUrl}ohlcv?query=${encodeURIComponent(query)}&first=${encodeURIComponent(first)}`;
        if (last) {
            url += `&last=${encodeURIComponent(last)}`;
        }
        const response = await axios.post(url);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error in ohlcv:', error.message);
        throw error;
    }
}

async function companyDataSearch(query) {
    try {
        const response = await axios.post(`${baseUrl}companydatasearch?query=${encodeURIComponent(query)}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error in companyDataSearch:', error.message);
        throw error;
    }
}

async function summary(query) {
    try {
        const response = await axios.post(`${baseUrl}summary?query=${encodeURIComponent(query)}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error in summary:', error.message);
        throw error;
    }
}

async function query(query) {
    try {
        const response = await axios.post(`${baseUrl}query?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error in summary:', error.message);
        throw error;
    }
}


module.exports = {
    getResponse,
    searchWithCriteria,
    ohlcv,
    companyDataSearch,
    summary
};

// Main function to demonstrate the API
async function main() {
    try {
        console.log('Fetching summary for Nvidia...');
        const nvidiaData = await query('get me the prices of banco santander since 2025 march');
        let a = JSON.parse(nvidiaData.messages[2].item)
        let b = JSON.parse(a.data)
        let c = JSON.parse(b["Banco Santander Rg"])

        
        console.log(c);
    } catch (error) {
        console.error('Error running main function:', error.message);
    }
}

// Execute the main function if this file is run directly
if (require.main === module) {
    main();
}