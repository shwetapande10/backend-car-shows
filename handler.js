'use strict';

const carService = require('./car-business-service');
const accessControlHeader = {
  "Access-Control-Allow-Origin": "*"
};
const err = {
  statusCode: 500,
  headers: accessControlHeader,
  body: JSON.stringify({ message: "Internal Server Error" })
};

module.exports.getCarShows = async (event, context) => {
  try {
    let data = await carService.getGroupedCarsData();
    return {
      headers: accessControlHeader,
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (ignored) {
    console.error(ignored);
    return err;
  }
};
