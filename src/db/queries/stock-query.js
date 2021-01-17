require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const StockSchema = require('./../schemas/stocks-schema');
const dateTimeUtil = require('../../utils/date-util');

/**
 * function that fetches the current stock
 * @param {*} data the req body that contains the company
 * @param {*} userId the user id of the user that comes after validating the token
 * @returns the stock data and saves the data for a user in the backend
 */
async function getCurrentStock(data, userId) {
    let success = false;
    try {
        const response = await axios.get(`
    https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${data.company}&apikey=${process.env.STOCK_API_KEY}`);
        if (response && response.data && response.data['Time Series (Daily)']) {
            const stockSchema = new StockSchema({
                _id: new mongoose.Types.ObjectId(),
                stockFunction: 'TIME_SERIES_DAILY',
                companyName: data.company,
                userId: userId,
                stocksInformation: JSON.stringify(response.data['Time Series (Daily)'])
            });
            await stockSchema.save();
            success = true;
            return { success, message: 'Data Found', statusCode: 200, data: response.data['Time Series (Daily)'] }
        } else {
            return { success, message: 'No Data Found', statusCode: 404 }
        }
    } catch (error) {
        console.error(`${dateTimeUtil.getCurrentDateTime()} Something went wrong while getting user stock company: ${data.company} ${error}`);
        return { success, message: 'Something went wrong', statusCode: 500 }
    }
}

/**
 * function that fetches the user history of the current user that is 
 * logged in
 * @param {*} userId the user of the current user that is fetched after validating token
 * @returns the user history as an array 
 */
async function getUserHistory(userId) {
    let success = false;
    try {
        const response = await StockSchema.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $project: {
                    stockId: '$_id',
                    stockFunction: 1,
                    companyName: 1,
                    createdAt: 1,
                    _id: 0
                }
            }
        ]);
        if (response.length) {
            success = true;
            return { success, message: 'Records Found', statusCode: 200, data: response };
        } else {
            return { success, message: 'No User History Found', statusCode: 404 };
        }
    } catch (error) {
        console.error(`${dateTimeUtil.getCurrentDateTime()} Something went wrong while fetching user history for user: ${userId} err: ${error}`);
        return { success, message: 'Something went wrong', statusCode: 500 }
    }
}
/**
 * function that returns single history of the snap shot of the stock that was viewed by the user
 * @param {*} stockId the stockId
 * @returns the stock object
 */
async function getSingleStock(stockId) {
    let success = false;
    try {
        const response = await StockSchema.findOne({ _id: new mongoose.Types.ObjectId(stockId) });
        if (response && response.stocksInformation) {
            success = true;
            return { success, message: 'Stock Record Found', statusCode: 200, data: JSON.parse(response.stocksInformation) };
        } else {
            return { success, message: 'Stock Record Not Found', statusCode: 404 };
        }
    } catch (error) {
        console.error(`${dateTimeUtil.getCurrentDateTime()} Something went wrong while fetching user ${error}`);
        return { success, message: 'Something went wrong', statusCode: 500 }
    }
}


module.exports = {
    getCurrentStock: getCurrentStock,
    getUserHistory: getUserHistory,
    getSingleStock: getSingleStock
}
