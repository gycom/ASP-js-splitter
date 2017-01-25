var fs = require("fs");
var filecache = require("./FileCache").FileCache;
var cur = null;
var flist = [
    //"Orders/Archives/GlobalInfo.asp",
    "Orders/training.asp"
];

function init(cb)
{
    filecache.init(fs);
    
    flist.forEach(function(filename){
        cb(filename);
    });
}

function parse(filename)
{
    console.log("Start parsing " + filename);
    filecache.getCached(filename,function(cur){
        console.log(cur);
    });
}

init(parse);
