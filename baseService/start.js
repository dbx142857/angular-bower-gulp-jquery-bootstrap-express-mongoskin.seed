var fs= require('fs');
var CONFIG=require('../config/config.js');
module.exports=function(res){
    fs.readFile(CONFIG.DEBUG_MODE===true?'views/index_debug.html':'views/index.html','utf-8',function(err,data){
        if(err){
            console.log(err);return false;
        }
        //console.log(data);
        //res.send("<script>COGTU_AD_CONFIG="+JSON.stringify(config)+"</script>"+data);
        res.send(data);
    })
    //res.render(CONFIG.DEBUG_MODE===true?'index_debug.html':'index.html');
}