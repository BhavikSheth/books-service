"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  console.log(`Getting the book: ${event.pathParameters.bookUuid}...`);
  dynamoDb
    .get({
      TableName: process.env.BOOKS_TABLE,
      Key: {
        uuid: event.pathParameters.bookUuid,
      },
    })
    .promise()
    .then((res) => {
      if (Object.keys(res).length === 0) {
        callback(new Error("Book not found"));
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: `Successfully retrieved book`,
            data: res.Item,
          }),
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return callback(new Error("Couldn't get book"));
    });
};
