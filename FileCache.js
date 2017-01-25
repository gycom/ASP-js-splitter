var fs;
var fbuf = [];
var cacheflist = "cached/cachelist.js";
function FileCache(){
    return {
        init: init,
        persist: persist,
        fbuf: fbuf,
        getCached: getCached
    };
}

function cacheIndex(){
    return fbuf.map(function(item){
        return {
            fn:item.fn,
            index:item.index | 0
        };
    })
}

function init(outfs){
    var fbuf = [];
    fs = outfs;
    fs.access(cacheflist,fs.F_OK | fs.W_OK,function(err){
        if(err)
        {
            PersistIndex();
        }
        else
        {
            fbuf = JSON.parse(fs.readFileSync(cacheflist,{encoding:"utf8"}));
        }
    });
}

function nextIndex(){
    return 1 + fbuf.reduce(function(max,item){return max<item.index?item.index:max},-1);
}

function PersistIndex(){
    fs.writeFileSync(cacheflist,JSON.stringify(cacheIndex(),null,2));
}

function persist()
{
    fbuf
        .filter(function(item){return item.dirty})
        .forEach(function(item){
            //TODO
            if (!item.index) item.index = nextIndex();
            item.dirty = false;
            fs.writeFileSync("cached/" + item.index + ".txt", JSON.stringify(item,null,2),{ encoding:"utf8" });
        });
    PersistIndex();
}

function getCached(fn,cb)
{
    var cached = fbuf.filter(function(item){return item.fn==fn});
    if (cached.length===0) // not in memory
    {
        console.log("Not in cache");
        // TODO: retrieve previous parse result
        // otherwise fetch original and persist cache
        fs.access(fn,fs.F_OK,function(err){
            if (!err){
                txt = fs.readFileSync(fn,{encoding:"utf8"});
                //console.log(txt);
                cached = {
                    fn: fn,
                    content: txt,
                    index: 0,
                    dirty: true,
                    status: 1 // raw content stage
                };
                fbuf.push(cached);
                persist();
            }
            else
            {
                cached = {
                    fn: fn,
                    content: "",
                    dirty: false,
                    status: 0 // not a file
                }
            }
            cb(cached);
        });
    }
    else
    {
        cb(cached[0]);
    }
}

//exports.FileCache = FileCache;
exports.FileCache = FileCache();