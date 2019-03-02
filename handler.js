'use strict';

const carService = require('./car-business-service')

module.exports.getCarShows = async (event, context) => {
  try {
    let data = await carService.getGroupedCarsData();
    return {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
