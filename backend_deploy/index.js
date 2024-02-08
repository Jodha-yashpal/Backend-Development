require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.listen(process.env.PORT, ()=>{
    console.log(`listening on port no. ${process.env.PORT}`)
})

app.get('/work', (req, res)=>{
    res.send('working on backend development')
})

app.get('/string', (req, res)=>{
    res.send('<h1>Please do something</h1>')
})
