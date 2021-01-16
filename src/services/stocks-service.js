const express = require('express');
const router = express.Router();

const stockQuery = require("./../db/queries/stock-query");
const status = require("./../status/status");
const { body, header, query, validationResult } = require('express-validator');
const tokenUtil = require('../utils/token-util');
const dateTimeUtil = require('./../utils/date-util');

/**
 * post method to get the current stock
 */
router.post('/current', [
    header('Authorization').exists(),
    body('company').exists()],
    function (req, res) {
        currentStock(req, res);
    });

/**
 * post method for getting the 
 */
router.get('/history', [
    header('Authorization').exists()],
    function (req, res) {
        userHistory(req, res);
    });

/**
 * get method that checks for the previous stock
 */
router.get('/previous', [
    header('Authorization').exists(),
    query('stockId').exists()], function (req, res) {
        previousStock(req, res);
    });

function currentStock(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send(status.invalidRequestStatus(422, 'Invalid Value'))
    } else {
        tokenUtil.validateToken(req.headers['authorization'], function (validateResponse) {
            if (validateResponse.success) {
                stockQuery.getCurrentStock(req.body, validateResponse.data.id).then(result => {
                    if (result.success) {
                        res.status(result.statusCode).send(status.successStatus(result.message, result.data || {}));
                    } else {
                        res.status(result.statusCode).send(status.invalidRequestStatus(result.statusCode, result.message));
                    }
                }).catch(error => {
                    console.error(`${dateTimeUtil.getCurrentDateTime()} Something went wrong while getting current stock ${error}`);
                    res.status(500).send(status.serverError())
                })
            } else {
                res.status(402).send(status.accessDeniedStatus());
            }
        })

    }
}

function userHistory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send(status.invalidRequestStatus(422, 'Invalid Value'))
    } else {
        tokenUtil.validateToken(req.headers['authorization'], function (validateResponse) {
            if (validateResponse.success) {
                stockQuery.getUserHistory(validateResponse.data.id).then(result => {
                    if (result.success) {
                        res.status(result.statusCode).send(status.successStatus(result.message, result.data || {}));
                    } else {
                        res.status(result.statusCode).send(status.invalidRequestStatus(result.statusCode, result.message));
                    }
                }).catch(error => {
                    console.error(`${dateTimeUtil.getCurrentDateTime()} Something went while fetching user history ${error}`);
                    res.status(500).send(status.serverError())
                })
            } else {
                res.status(402).send(status.accessDeniedStatus());
            }
        })

    }
}

function previousStock(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send(status.invalidRequestStatus(422, 'Invalid Value'))
    } else {
        tokenUtil.validateToken(req.headers['authorization'], function (validateResponse) {
            if (validateResponse.success) {
                stockQuery.getSingleStock(req.query.stockId).then(result => {
                    if (result.success) {
                        res.status(result.statusCode).send(status.successStatus(result.message, result.data || {}));
                    } else {
                        res.status(result.statusCode).send(status.invalidRequestStatus(result.statusCode, result.message));
                    }
                }).catch(error => {
                    console.error(`${dateTimeUtil.getCurrentDateTime()} Something went while fetching user history ${error}`);
                    res.status(500).send(status.serverError())
                })
            } else {
                res.status(402).send(status.accessDeniedStatus());
            }
        });
    }
}


module.exports = router;