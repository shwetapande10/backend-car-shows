'use strict';

const carService = require('./car-business-service')
module.exports.getCarShows = async (event, context) => {
  let data = await carService.getGroupedCarsData();
  console.log(data);
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
