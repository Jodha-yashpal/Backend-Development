import express from "express"

const app = express()

app.get('/', (req, res)=>{
    res.send("<h1>this is a server</h1>")
})

const port = process.env.port || 3000

app.listen(port, ()=> {
    console.log("ready");
})