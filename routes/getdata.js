var http = require('http');
var d3 = require('d3-node'); //data driven documents (buat visualisasi)
var url = 'https://data.go.id/';

exports.data = function(req,res){
  http.get(url, (res) => {
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    })

    res.on('end', () => {
      //parse ke JSON?
      console.log(data);

    })
  })

  return data;
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
