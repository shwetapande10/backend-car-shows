const carDataService = require('./mockDataService')
const carService = require('../car-business-service');
const actualCarDataService = require('../car-data-service');

describe("car-business-service", function () {

  it("should test invalid data", async function () {
    let expectedResponse = { "makes": [{ "name": "George Motors", "models": [{ "name": "George 15", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }, { "name": "New York Car Show" }] }] }, { "name": "Hondaka", "models": [{ "name": "Elisa", "shows": [{ "name": "Carographic" }, { "name": "Melbourne Motor Show" }, { "name": "New York Car Show" }] }, { "name": "Ellen", "shows": [{ "name": "Cartopia" }] }] }, { "name": "Julio Mechannica", "models": [{ "name": "Mark 1", "shows": [{ "name": "New York Car Show" }] }, { "name": "Mark 2", "shows": [{ "name": "Carographic" }, { "name": "Cartopia" }] }, { "name": "Mark 4", "shows": [{ "name": "Carographic" }] }, { "name": "Mark 4S", "shows": [{ "name": "Melbourne Motor Show" }] }] }, { "name": "Moto Tourismo", "models": [{ "name": "Cyclissimo", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }, { "name": "New York Car Show" }] }, { "name": "Delta 16", "shows": [{ "name": "Cartopia" }] }, { "name": "Delta 4", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }] }] }] };
    process.env.CARS_API_URL = 'invalid';
    process.env.FILTER_DATA = "STRICT_VALID";
    carService.setDataService(carDataService);
    let actualResponse = await carService.getGroupedCarsData();
    expect(JSON.stringify(actualResponse)).toEqual(JSON.stringify(expectedResponse));
  });

  it("should test valid data", async function () {
    let expectedResponse = { "makes": [{ "name": "George Motors", "models": [{ "name": "George 15", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }] }] }, { "name": "Hondaka", "models": [{ "name": "Elisa", "shows": [{ "name": "Melbourne Motor Show" }] }, { "name": "Ellen", "shows": [{ "name": "Cartopia" }] }] }, { "name": "Julio Mechannica", "models": [{ "name": "Mark 2", "shows": [{ "name": "Cartopia" }] }, { "name": "Mark 4S", "shows": [{ "name": "Melbourne Motor Show" }] }] }, { "name": "Moto Tourismo", "models": [{ "name": "Cyclissimo", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }] }, { "name": "Delta 16", "shows": [{ "name": "Cartopia" }] }, { "name": "Delta 4", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }] }] }] };
    process.env.CARS_API_URL = 'valid';
    process.env.FILTER_DATA = "STRICT_VALID";
    carService.setDataService(carDataService);
    let actualResponse = await carService.getGroupedCarsData();
    expect(JSON.stringify(actualResponse)).toEqual(JSON.stringify(expectedResponse));
  });

  it("should test failed data response", async function () {
    process.env.CARS_API_URL = 'failed';
    process.env.FILTER_DATA = "STRICT_VALID";
    carService.setDataService(carDataService);
    try {
      await carService.getGroupedCarsData()
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error("Error Fetching Data!"));
  });

  it("should test no data response", async function () {
    process.env.CARS_API_URL = 'blank';
    process.env.FILTER_DATA = "STRICT_VALID";
    carService.setDataService(carDataService);
    let actualResponse = await carService.getGroupedCarsData();
    expect([]).toEqual(actualResponse.makes)
  });

  it("should test error response", async function () {
    let expectedResponse = "";
    process.env.CARS_API_URL = 'http://4b1478d0-3d50-4523-998c-6a42091d966d.s3-website-ap-southeast-2.amazonaws.com';
    process.env.FILTER_DATA = "STRICT_VALID";
    carService.setDataService(actualCarDataService);
    let error;
    try {
      await carService.getGroupedCarsData()
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error("Internal Server Error"));
  });

  it("should test invalid data with STRICT_VALID_REPLACE", async function () {
    let expectedResponse = { "makes": [{ "name": "Edison Motors", "models": [{ "name": "-- no data --", "shows": [{ "name": "New York Car Show" }] }] }, { "name": "George Motors", "models": [{ "name": "George 15", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }, { "name": "New York Car Show" }] }] }, { "name": "Hondaka", "models": [{ "name": "Elisa", "shows": [{ "name": "Carographic" }, { "name": "Melbourne Motor Show" }, { "name": "New York Car Show" }] }, { "name": "Ellen", "shows": [{ "name": "Cartopia" }] }] }, { "name": "Julio Mechannica", "models": [{ "name": "Mark 1", "shows": [{ "name": "New York Car Show" }] }, { "name": "Mark 2", "shows": [{ "name": "Carographic" }, { "name": "Cartopia" }] }, { "name": "Mark 4", "shows": [{ "name": "Carographic" }] }, { "name": "Mark 4S", "shows": [{ "name": "Melbourne Motor Show" }] }] }, { "name": "Moto Tourismo", "models": [{ "name": "-- no data --", "shows": [{ "name": "Carographic" }] }, { "name": "Cyclissimo", "shows": [{ "name": "Cartopia" }, { "name": "Melbourne Motor Show" }, { "name": "New York Car Show" }] }, { "name": "Delta 16", "shows": [{ "name": "Cartopia" }] }, { "name": "Delta 4", "shows": [{ "name": "-- no data --" }, { "name": "Cartopia" }, { "name": "Melbourne Motor Show" }] }] }] };
    process.env.CARS_API_URL = 'invalid';
    process.env.FILTER_DATA = "STRICT_VALID_REPLACE";
    carService.setDataService(carDataService);
    let actualResponse = await carService.getGroupedCarsData();
    expect(JSON.stringify(actualResponse)).toEqual(JSON.stringify(expectedResponse));
  });

});
