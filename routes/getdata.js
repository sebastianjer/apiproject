var config = require('./config.json');
var connection = require('./db');
var https = require('https');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var d3 = require('d3-node'); //data driven documents (buat visualisasi)
//var url = 'https://data.go.id/'; lagi maintenance sampe sekarang, ganti source
//ambil dri NYC Open Data
var url = 'https://data.cityofnewyork.us/resource/hvnc-iy6e.json';

var plotly = require('plotly')("ixora", "8hqo4E3D8oD4fs5wn4qv");

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
      res.download('./data.json', function (err) {
        if (err){
          console.log("Gagal download");
        }else{
          console.log("Download berhasil");
        }
      });
    }
  })
}

exports.visualize = function (req,res){
  //dataset masih dari data yang disimpan ke dalam file, bukan dari requests
  var dataset1 = require('./pelajar.json');
  var a = [];
  var b = [];

  dataset1.forEach(function(element){
    //console.log(element.district)
    a.push(element.district);
    b.push(element.ytd_attendance_avg_);
  });

  var dataset2 = require('./guru.json');
  var c = [];
  var d = [];

  dataset2.forEach(function(element){
    //console.log(element.district)
    c.push(element.district);
    d.push(element.ytd_attendance_avg_);
  });

  var trace1 = {
    x: a,
    y: b,
    name: "data pelajar",
    type: "bar"
  };

  var trace2 = {
    x: c,
    y: d,
    name: "data guru",
    type: "bar"
  };

  var data = [trace1, trace2];
  var layout = {
    title: "Data Pelajar Guru",
    yaxis: {title: "attendance pelajar"},
    yaxis2: {
      title: "attendance guru",
      titlefont: {color: "rgb(148, 103, 189)"},
      tickfont: {color: "rgb(148, 103, 189)"},
      overlaying: "y",
      side: "right"
    }
  };

  var graphOptions = {layout: layout, filename: "visualisasi-data", fileopt: "overwrite"};

  plotly.plot(data, graphOptions, function (err, msg) {
	   if (err) return console.log(err);
	   //console.log(msg);
     res.send(msg);
  });

  //var dataset2 = require('./pelajar.csv');
}
