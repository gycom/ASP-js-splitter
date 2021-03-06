var fs = require("fs");
var filecache = require("./FileCache").FileCache;
var cur = null;
var flist = require("./filelist/filelist.json");

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
        console.log("Before Process\r\n\r\n" + toJSON(cur));
        cur.content = Process(cur.content,splitmode.script,"SCRIPT");
        PrependValueList(cur.content);
        console.log("After Process and Replacement\r\n\r\n" + toJSON(cur));
        console.log("Result as HTML\r\n\r\n" + asText(cur));
    });
}



var varseq = 0;
var varlist = "";
function Process(content,mode,next)
{
    var output = content;
    output = Split(output,mode);
    switch(next)
    {
        case "SCRIPT":
            output = output.map(function(block){
                console.log("Script Step\r\n\r\n" + toJSON(block));
                if (block.type != next) return block;
                        block.content = Process(block.text,splitmode.asp,"ASP");
                        delete block.text;
                        return block;
                    });
                break;
        case "ASP":
        output = output.map(function(block,index,all){
            console.log("ASP Step"+toJSON(block));
                        if (block.type != next) return block;
                        if(true)if (block.text.indexOf("<%=")==0 
                                    //|| block.text.indexOf("<%response.write")==0
                                    ) // or <%response.write...
                        {
                            // TODO: check case of screen labels  -> <%=getOneJobtrackLabel("SAVE")%>  -> LBL.SAVE
                            
                            // simple value
                            block.text = NextVar(block.text);
                            block.type = "JS";
                        }
                        // TODO 
                        if(true)if (block.text.indexOf("<%if")==0)
                        {
                            // grab if then else case
                            if (all[index+2].text.indexOf("<%else")==0 
                                && all[index+4].text.indexOf("<%end if")==0)
                            {
                                var expr = NextVar("<%=toBool(" + block.text.replace("<%if ","").replace(" then%>","")+")%>");
                                block.type="JS";
                                block.text="if ("+expr+"){";
                                all[index+2].text="}else{";
                                all[index+2].type="JS";
                                all[index+4].text="}";
                                all[index+4].type="JS";
                            }
                            if (all[index+2].text.indexOf("<%end if")==0)
                            {
                                var expr = NextVar("<%=toBool(" + block.text.replace("<%if ","").replace(" then%>","")+")%>");
                                block.type="JS";
                                block.text="if ("+expr+"){";
                                all[index+2].text="}";
                                all[index+2].type="JS";
                            }
                        }
                        return block;
                });
            break;
        default:
            break;
    }
    return output;
    function NextVar(value)
    {
        varseq++;
        varlist += "var Value" + varseq + " = " + value + ";\r\n";
        return "Value" + varseq;
    }
}

function PrependValueList(content)
{
    content[1].content[0].text = "<script>\r\n" + varlist + "</script>\r\n" + content[1].content[0].text;
    varlist = "";
}

var splitmode = {
    script: [
        {current:"HTM",next:"SCRIPT",token:"<script",onprev:false},
        {current:"SCRIPT",next:"HTM",token:"</script>",onprev:true}
        ],
    asp: [
        {current:"JS",next:"ASP",token:"<%",onprev:false},
        {current:"ASP",next:"JS",token:"%>",onprev:true}
    ]
};
function Split(txt,mode)
{
    var block = [];
    var state = mode[0].current;
    var pos = 0;
    var lastpos = 0;
    var len = txt.length;
    var content = "";
    var token;

    while (pos<len)
    {
        for (var i=0; i < mode.length; i++)
        {
            if (state == mode[i].current)
            {
                token = mode[i].token;
                if (isToken())
                {
                    pushToBlock();
                    state = mode[i].next;
                    lastpos = pos;

                    if (mode[i].onprev)
                    {
                        block[block.length-1].text += token;
                        lastpos += token.length;
                    }
                }
            }
        }
        pos++;
    }
    pushToBlock();
    
    return block;    

    function isToken() {return txt.substr(pos,token.length) == token;}
    function pushToBlock() 
    { 
        content = txt.substring(lastpos,pos);
        block.push( {type: state, text: content} );
    }
}

function onlyJS(x) { return x.type== "JS"; }
function onlyHTM(x) { return x.type == "HTM"; }
function onlyASP(x) { return x.type == "ASP"; }

function toJSON(x) { return JSON.stringify(x,null,2); }

function asText(x) { 
    if (x.content) 
    {
        return x.content.reduce(function(total,item){return total+asText(item);},"");
    }  
    else 
    { 
        return x.text ||"";
    }
}


init(parse);
