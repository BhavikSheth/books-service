"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  console.log(`Getting all books...`);
  dynamoDb
    .scan({
      TableName: process.env.BOOKS_TABLE,
    })
    .promise()
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(res.Items),
      });
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully retrieved books`,
          data: res.Items,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      return callback(new Error("Couldn't get all books"));
    });
};
