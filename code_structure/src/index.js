// require('dotenv').config({path: './env'})


import dotenv from "dotenv"
import connectDB from './db/index.js'

dotenv.config({
    path: './env'  
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
})


























/*   db can be connected in this way as well
;( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", ()=> {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App  is listening on port ${process.env.PORT}`)
        })
    }catch(error){
        console.error("ERROR: ", error)
        throw err
    }
})()

*/