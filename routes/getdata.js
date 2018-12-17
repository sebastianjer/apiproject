var config = require('./config.json');
var connection = require('./db');
var https = require('https');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var d3 = require('d3-node'); //data driven documents (buat visualisasi)
//var url = 'https://data.go.id/'; lagi maintenance sampe sekarang, ganti source
//ambil dri NYC Open Data
var url = 'https://data.cityofnewyork.us/resource/hvnc-iy6e.json'

exports.data = function(req,res){
  var token = req.headers['x-access-token'];
  if (!token){
    return res.status(401).send({
      "auth": "fail",
      "message": "No token"
    })
  }
  connection.query('SELECT * FROM users WHERE token = ?',[token], function (err, results, fields){
    if (err) {
      console.log(err);
      return res.status(500). send({
        "auth": "fail",
        "message": "Token auth fail"
      })
    }else{
      https.get(url, (res) => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        })

        res.on('end', () => {
          //datanya sekarang sudah JSON
          console.log(data);
          //save ke file JSON
          fs.writeFile('./data.json', data, 'utf8', function (err){
            if (err){
              console.log("Error saving to file");
            }else{
              console.log("Saved");
            }
          })
        })
      })
      //transfer ke user
      res.download('C:/Users/Windows 8/Desktop/stsdapi/data.json');
    }
  })
}

exports.visualize = function (req,res){
  var dataset1 = require('./guru.csv');

  var svgWidth = 500;
  var svgHeight = 300;
  var barPadding = 5;
  var barWidth = (svgWidth / dataset1.length);

  var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var barChart = svg.selectAll("rect")
    .data(dataset1)
    .enter()
    .append("rect")
    .attr("y", function (d) {
      return svgHeight - d
    })
    .attr("height", function (d) {
      return d
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d,i) {
      var translate = [barWidth * i, 0];
      return "translate("+ translate +")";
    });

  res.send(svg);

  //var dataset2 = require('./pelajar.csv');
}





/*
var width = ;
var height = ;

var svg = d3.select('svg')
  .attr("width", width)
  .attr("height", height)
  .attr("class", "bar-chart");

var data = ;

var barPadding = 5;
var barWidth = (width / dataset.length);
var barChart = svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("y", function(d) {
      return height - d
  })
  .attr("height", function(d) {
      return d;
  })
  .attr("width", barWidth - barPadding)
  .attr("transform", function (d, i) {
       var translate = [barWidth * i, 0];
       return "translate("+ translate +")";
  });
*/
