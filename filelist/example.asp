... asp beginning blah blah ...
    <script>
    function test()
    {
        // as inserted value
        for (var i=<%=nStart %>; i < <%=nTotal+4%>; i++)
        {
          // as if then else structure
          <%if flag="SINGLE" then%>
            x=x+1;
          <%else%>
            x=x+2;
          <%end if%>
        }
        // as if then structure
        <%if mode<>"FULL" then%>
          alert("Eureka Not Full!");
        <%end if%>
    }
    </script>
... asp final blah blah ...
    