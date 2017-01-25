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
    