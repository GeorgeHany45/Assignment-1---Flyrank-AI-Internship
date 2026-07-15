const express = require ('express')

const app = express()


app.get('/', (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    });
});

app.get('/health', (req, res) => {
    res.json({
        status : 'ok'
    });
});


app.listen ( 3000 , ()=>{
    console.log('listening on port 3000')
})