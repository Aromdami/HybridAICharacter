const express = require('express')
const app = express()
const port = 3000
const http = require('http').Server(app);



app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'))


app.get('/Path1', function (req, res) {
        res.send("Got Path1");
    })
app.get('/Path2', function(req,res) {
        res.send("Got Path2 : " + Date());
    })
app.put('/Path1', function (req, res) {
        res.send("Put Path1");
    })


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))