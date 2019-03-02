'use strict';
const got = require('got')

module.exports.callCarsAPI = async (url) => {
  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  try {
    const response = await got(url, options);
    return JSON.parse(response.body);
  }
  catch (error) {
    console.error("Error from service - " + url 
    + "\n Error code - " + error.statusCode
    + "\n Error message - " + error.statusMessage);
    throw new Error("Internal Server Error");
  }
};
