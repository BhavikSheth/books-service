"use strict";

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
      new Error("Couldn't update book because of validation errors.")
    );
  }

  console.log(`Updating the book: ${event.pathParameters.bookUuid}...`);
  dynamoDb
    .update({
      TableName: process.env.BOOKS_TABLE,
      Key: {
        uuid: event.pathParameters.bookUuid,
      },
      UpdateExpression: "set #name = :n, releaseDate = :r, authorName = :a",
      ExpressionAttributeValues: {
        ":n": requestBody.name,
        ":r": new Date(requestBody.releaseDate).getTime(),
        ":a": requestBody.authorName,
      },
      ExpressionAttributeNames: {
        "#name": "name",
        "#uuid": "uuid",
      },
      ConditionExpression: "attribute_exists(#uuid)",
      ReturnValues: "ALL_NEW",
    })
    .promise()
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully updated book`,
          data: res.Attributes,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      return callback(new Error("Couldn't update book"));
    });
};
