var express = require('express');
var router = express.Router();
var fs=require('fs');

/* GET home page. */
router.get('/', function(req, res) {

  //res.write("sdfsdf");
  //res.end();

  //res.render('index');
  fs.readFile('views/index.html','utf-8',function(err,data){
    res.write(data);
    res.end();
  })
});

module.exports = router;
