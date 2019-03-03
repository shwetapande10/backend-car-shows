'use strict';
const _ = require('underscore')
let carDataService = require('./car-data-service');

module.exports = {
  setDataService: (dataService) => {
    carDataService = dataService;
  },
  getGroupedCarsData: async () => {
    let data = await carDataService.callCarsAPI(process.env.CARS_API_URL);
    data = validate(data);
    let response = restructure(data);
    return response;
  }
}

function validate(data) {
  if (!Array.isArray(data)) {
    if (data.length > 0) {
      console.error(data)
      throw new Error("Error Fetching Data!")
    }
    data = [];
  }
  return data;
}

function restructure(data) {
  let response = [];
  let flatData = flattenData(data);
  flatData = filterIncorrectData(flatData);
  response = groupCarsData(flatData);

  return response;
}

//flatten data
function flattenData(data) {
  return _.chain(data).map((show) => {
    return _.map(show.cars, (car) => {
      let carobj = { makes: car.make, models: car.model, shows: show.name }
      return carobj;
    })
  }).flatten().value();
}

//group data
function groupCarsData(data) {
  let groupedData = {}
  groupedData.makes = mapGroups({ value: data }, ["makes", "models", "shows"]);
  return groupedData;
}

function mapGroups(data, keysMap) {
  let key = keysMap.shift();
  return _.map(group(data.value, key), obj => {
    if (keysMap.length > 0) {
      let nextForKey = keysMap[0];
      obj[nextForKey] = mapGroups(obj, keysMap.slice(0));
    }
    delete obj.value;
    return obj;
  })
}

function group(data, key) {
  let outerobj = _.chain(data).groupBy(key).value();
  return _.chain(outerobj).keys().sort().map(key => { return { name: key, value: outerobj[key] } }).value()
}

//filter data
function filterIncorrectData(data) {
  let filterPolicy = process.env.FILTER_DATA;
  if (!filterPolicy || filterPolicy == "" || filterPolicy == "NONE")
    return data;
  return getFilteredData(data, filterPolicy, ["makes", "models", "shows"]);
}

function getFilteredData(data, filterPolicy, forKeys) {
  return _.reduce(data, (modified, object) => {
    let newObject = getObjectAsPerFilter(object, filterPolicy, forKeys);
    if (newObject)
      modified.push(newObject);
    return modified;
  }, []);
}

function getObjectAsPerFilter(object, filterPolicy, forKeys) {
  for (let i = 0; i < forKeys.length; i++) {
    object = getFilteredObject(object, forKeys[i], filterPolicy);
    if (!object)
      break;
  }
  return object
}

function getFilteredObject(object, key, filterPolicy) {
  if (isElementInValid(object[key])) {
    if (filterPolicy == "STRICT_VALID_REPLACE")
      object[key] = "-- no data --";
    else
      object = null;
  }
  return object;
}

function isElementInValid(element) {
  return (!element || element == "" || element == "undefined")
}
