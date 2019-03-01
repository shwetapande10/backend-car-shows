'use strict';
const got = require('got')

module.exports.callCarsAPI = async (url) => {
  console.log(url);
  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  try {
    const response = await got(url, options)
    //console.log(response.body);
    return JSON.parse(response.body);
  }
  catch (error) {
    console.log("error");
    return await error.body
  }
};
