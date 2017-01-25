# ASP-js-splitter

Tool to split Classic ASP code to extract javascript block into *.js external files
Typically, it should clean the <script> tag of all ASP code insertions, replacing them with 
local logic-equivalent javascript code and create a extract <script> tag containing ASP inserted value

## Example
```
    ... asp blah blah ...
    <script>
    function test()
    {
        for (var i=0; i < <%=nTotal+4%>; i++)
        {
          <%if flag="SINGLE" then%>
          x=x+1;
          <%else%>
          x=x+2;
          <%end if%>
        }
    }
    </script>
    ... asp blah blah ...
```

## Should become
```
    ... asp blah blah ...
    <script>
    var value1 = <%=nTotal+4%>;
    var value2 = <%=toBool(flag="SINGLE")%>;
    </script>
    <script src="file1.js"></script>
    ... asp blah blah ...
```

and file1.js containing

```
    function test()
    {
        for (var i=0; i < value1; i++)
        {
          if (value2) 
          {
            x=x+1;
          } 
          else 
          {
            x=x+2;
          }
        }
    }
```
