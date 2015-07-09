/**
 * Created by USER on 2015/7/9.
 */
var express = require('express');
var router = express.Router();
var fs=require('fs');

function render(filename,res){
    fs.readFile('public/Tpl/Admin/'+filename+'.html','utf-8',function(err,data){
        res.write(data);
        res.end();
    })
}


/* GET home page. */
router.get('/', function(req, res) {
    render('index',res);

});
router.get('/static/:name',function(req,res){
    //console.log('req.params',req.params)
    render(req.params.name,res);

    //render('index',res);
})

module.exports = router;