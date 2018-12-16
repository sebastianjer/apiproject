var http = require('http');
var jwt = require('jsonwebtoken');
var d3 = require('d3-node'); //data driven documents (buat visualisasi)
var url = 'https://data.go.id/';

exports.data = function(req,res){
  var token = req.headers['x-access-token'];
  if (!token){
    return res.status(401).send({
      "auth": "fail",
      "message": "No token"
    })
  }
  jwt.verify(token, config.secret, function(err, decoded){
    if (err) {
      return res.status(500). send({
        "auth": "fail",
        "message": "Token auth fail"
      })
    }else{
      http.get(url, (res) => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        })

        res.on('end', () => {
          //parse ke JSON? atau save ke file?
          console.log(data);

        })
      })
    }
  })
}

exports.visualize = function (data){
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
}
