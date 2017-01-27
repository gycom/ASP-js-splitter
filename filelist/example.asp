... asp blah blah ...
    <script>
    function test()
    {
        for (var i=<%=nStart %>; i < <%=nTotal+4%>; i++)
        {
          <%if flag="SINGLE" then%>
          x=x+1;
          <%else%>
          x=x+<%=nIncrement %>;
          <%end if%>
        }
    }
    </script>
... asp blah blah ...
    