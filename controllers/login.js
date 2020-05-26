const express = require('express')
const router = express.Router()
var connection = require('./connection.js')

router.post('/login', function(req,res,next){
    var user= req.body.user_name
    var password = req.body.password
    connection.query('SELECT * FROM users WHERE user_name = ?',[user], function (error, results, fields) {
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
          res.send({
            "code":200,
            "success":"login sucessfull"
              })
        }
        else{
          res.send({
            "code":204,
            "success":"Email and password does not match"
              })
        }
      }
      else{
        res.send({
          "code":204,
          "success":"Email does not exits"
            })
      }
    }
    })
  })
  module.exports = router