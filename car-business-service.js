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
    return response;
  }
}

function restructure(data) {
  if (!Array.isArray(data))
    return data;
  let response = [];
  let flatData = flattenData(data);
  response = groupCarsData(flatData);
  if (process.env.IS_DATA_SANITY_ENABLED === "true")
      response = filterIncorrectData(response);
  return response;
}

//flatten data
function flattenData(data) {
  return _.chain(data).map((show) => {
    return _.map(show.cars, (car) => { 
      let carobj = {makes:car.make, models:car.model, shows: show.name}
      return carobj;
    })
  }).flatten().value();
}

//group data
function groupCarsData(data) {
  let groupedData = {}
  groupedData.makes = mapGroups({value:data},["makes","models","shows"]);
  return groupedData;
}

function mapGroups(data, keysMap){
  let key = keysMap.shift();
  return _.map(group(data.value, key), obj => {
    if(keysMap.length>0){
      let nextForKey = keysMap[0];
      obj[nextForKey] = mapGroups(obj,keysMap.slice(0));
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
  if (!data || !data.makes || !Array.isArray(data.makes))
    return data;
  data.makes = getFilteredData(data.makes);
  return data;
}

function getFilteredData(data)
{
  return _.reduce(data, (modified, obj) => {
    if (obj.name && obj.name !== "" && obj.name != "undefined") {
      let key = getNextKey(obj);
      if(key)
        obj[key] = getFilteredData(obj[key])
      modified.push(obj);
    }
    return modified;
  }, []);
}

function getNextKey(object){
  let key;
  let clonedObj = _.clone(object);
  if(clonedObj.name)
    delete clonedObj.name;
  return _.keys(clonedObj)[0];
}