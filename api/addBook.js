"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  if (
    typeof requestBody.name !== "string" ||
    typeof requestBody.releaseDate !== "string" ||
    typeof requestBody.authorName !== "string"
  ) {
    console.error("Validation Error");
    return callback(
      new Error("Couldn't add book because of validation errors.")
    );
  }

  console.log(`Adding the book: ${requestBody.name}...`);
  const params = {
    TableName: process.env.BOOKS_TABLE,
    Item: {
      uuid: uuid.v4(),
      name: requestBody.name,
      releaseDate: new Date(requestBody.releaseDate).getTime(),
      authorName: requestBody.authorName,
    },
  };

  dynamoDb
    .put(params)
    .promise()
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully added book`,
          data: params.Item,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      return callback(new Error("Couldn't add new book"));
    });
};
