import express from "express";
const app = express()

app.get('/', (req, res)=>{
    res.send('Server is ready')
})

app.get('/api/jokes',(req, res)=>{
    const jokes = [
        {
            id: 1,
            title: "a joke",
            content: "This is a joke"
        },
        {
            id: 2,
            title: "another joke",
            content: "This is another joke"
        },
        {
            id: 3,
            title: "a third joke",
            content: "This is third joke"
        },
        {
            id: 4,
            title: "a fourth joke",
            content: "This is fourth joke"
        },
        {
            id: 5,
            title: "a fifth joke",
            content: "This is fifth joke"
        },
    ];
    res.send(jokes);
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server at http://localhost${port}`)
})