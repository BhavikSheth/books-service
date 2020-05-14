"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  console.log(`Deleting the book: ${event.pathParameters.bookUuid}...`);
  dynamoDb
    .delete({
      TableName: process.env.BOOKS_TABLE,
      Key: {
        uuid: event.pathParameters.bookUuid,
      },
      ExpressionAttributeNames: {
        "#uuid": "uuid",
      },
      ConditionExpression: "attribute_exists(#uuid)",
    })
    .promise()
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully deleted book`,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      return callback(new Error("Couldn't delete book"));
    });
};
