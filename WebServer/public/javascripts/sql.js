const classDB = require('../../bin/www');

function showTable(items)
{
    document.write("<table>");

    document.write("<tr>");
    for (i = 0; i < items; i ++)
    {
        document.write("<td>" + item +  "</td>");

    }
    document.write("</tr>");

    
    
}


$('#qry1').on("click", 
function()
{
    var stmt1 = "SELECT name, pname, croom, cday1, cday2, startTime, endTime";
    var stmt2 = "FROM 수업 classes"
    var stmt3 = "INNER JOIN 교수 profs ON classes.pid = profs.id"
    var stmt4 = "ORDER BY cday1 ASC, startTime ASC";

    
    classDB.all(sql, [], 
        (err, datas)=>{
            if (err)
                throw err;
            
            datas.forEach(
                (datas)=>{
                    console.log(datas);
                }
            );
        }
    );
}
);
