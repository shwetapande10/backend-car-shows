'use strict';
let response;

module.exports = {
    callCarsAPI : (url) => {
        try {
            return getMockData(url);
        }
        catch (error) {
            console.log(error);
            return error.body
        }
    }
};

function getMockData(mockCategory) {
    switch(mockCategory){
        case "invalid": {
            response = require('./data/invaliddata.json');
            break;
        }
        case "valid" :{
            response = require('./data/testdata.json');
            break;
        }
        case "failed" : {
            response = require('./data/faileddata.json');
            break;
        }
        case "blank" : {
            response = require('./data/nodata.json');
            break;
        }
        default :{
            response = require('./data/testdata.json');
            break;
        }
    }
    return response;
}