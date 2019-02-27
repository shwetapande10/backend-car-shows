'use strict';

const _ = require('underscore')
const got = require('got'); 
module.exports.getCarShows = async (event, context) => {
  let arr = await callCarsAPI()
  return {
    statusCode: 200,
    body: JSON.stringify(restructure(arr)),
  };
};

function restructure(arr) {
  if(!arr.map) return ""
  let carsArr = _.chain(arr).map((show)=> {
    return _.map(show.cars, (car) => {car.showname = show.name; return car})
  }).flatten().value();

  let makes = _.groupBy(_.sortBy(carsArr, "make"), "make");
  _.each(makes, (make, makeKey) => {
    let models = _.groupBy(_.sortBy(make,"model"), "model")
    models = _.chain(models).keys().map(key=>models[key]).value()
    //console.log(models);
    makes[makeKey] = {'model':_.groupBy(_.sortBy(make,"model"), "model")};
    _.each(makes[makeKey].model, (model, key) => {
        let shownames = _.chain(model).groupBy("showname").keys().without("","undefined").value().sort()
        makes[makeKey].model[key] = {'shows':shownames};
        if(key == "" || key == "undefined"){
          var shows = makes[makeKey].shows;
          shows = shows && shows.length? shows:[]
          shows.push(shownames)
          makes[makeKey].shows = shows
          delete makes[makeKey].model[key]
        }
    });
  });

  makes = _.chain(makes).keys().map(makeName=> {
    let data = {}
    let models = _.chain(makes[makeName].model).keys().map(modelName=>{
      let model = {}
      model.name = modelName
       model.shows = makes[makeName].model[modelName].shows
      return model
    }).value()
    data.name = makeName
    data.models = models
    if(makes[makeName].shows)
      data.shows = makes[makeName].shows
    return data
  }).value()
  let data = {makes:makes};
  console.log(JSON.stringify(data));

  //console.log(data.make.Hondaka.model.Elisa.shows)
  

  return JSON.parse(JSON.stringify(data));
}
async function callCarsAPI(){
  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try{
    const response = await got("http://eacodingtest.digital.energyaustralia.com.au/api/v1/cars",options)
    console.log(response.body)
    console.log("--------------");
    return JSON.parse(response.body);
  }
  catch(error){
    return "[]"
  }
}
