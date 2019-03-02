'use strict';
const _ = require('underscore')
let carDataService = require('./car-data-service');

module.exports = {
  setDataService: (dataService) => {
    carDataService = dataService;
  },
  getGroupedCarsData: async () => {
    let data = await carDataService.callCarsAPI(process.env.CARS_API_URL);
    let response = restructure(data);
    if (process.env.IS_DATA_SANITY_ENABLED)
      response = filterIncorrectData(response);
    return response;
  }
}

function restructure(data) {
  if (!Array.isArray(data))
    return data;
  let response = [];
  let flatData = flattenData(data);
  response = groupCarsData(flatData);
  return response;
}

function flattenData(data) {
  return _.chain(data).map((show) => {
    return _.map(show.cars, (car) => { car.showname = show.name; return car })
  }).flatten().value();
}

function groupCarsData(data) {
  let groupedData = {}
  groupedData.makes = _.map(group(data, "make"), make => {
    make.models = _.map(group(make.value, "model"), model => {
      model.shows = _.map(group(model.value, "showname"), show => {
        delete show.value; return show;
      })
      delete model.value; return model;
    })
    delete make.value; return make;
  })
  return groupedData;
}

function group(data, key) {
  let outerobj = _.chain(data).groupBy(key).value();
  return _.chain(outerobj).keys().sort().map(key => { return { name: key, value: outerobj[key] } }).value()
}

function filterIncorrectData(data) {
  if (!data || !data.makes || !Array.isArray(data.makes))
    return data;
  data.makes = getFilteredData(data.makes);
  return data;
}

function getFilteredData(data)
{
  return _.reduce(data, (modified, obj) => {
    if (obj.name && obj.name != "" && obj.name != "undefined") {
      let key = obj.models ? "models" : obj.shows? "shows" : null;
      if(key)
        obj[key] = getFilteredData(obj[key])
      modified.push(obj);
    }
    return modified;
  }, []);
}