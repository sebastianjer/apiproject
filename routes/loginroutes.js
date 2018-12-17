var config = require("./config.json");
var jwt = require('jsonwebtoken');

//Menghubungkan ke database MySQL
var connection = require('./db');

/* --------------------------------------------------------- */

//Register client baru
exports.register = function(req,res){
  // console.log("req",req.body);
  //var today = new Date();
  var users={
    "name":req.body.name,
    "email":req.body.email,
    "password":req.body.password,
  }
  connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
  }
  });
}

/* --------------------------------------------------------- */

//Login
exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].password == password){
        //buat token
        var token = jwt.sign({id: results[0].id}, config.secret,{expiresIn: 86400});
        var params = [token, email];
        connection.query('UPDATE users SET token = ? WHERE email = ?', params, function (err, results, fields){
          if (err){
            console.log(err);
          }else{
            res.send({
              "code":200,
              "success":"login successful",
              "token":token
            })
          }
        })
      }
      else{
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
}

/* --------------------------------------------------------- */
