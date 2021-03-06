const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})


const connectDB = async ()=>{
    try
    {
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        })

        console.log(`DB Connection established successfully - ${conn.connection.host}`);
    }
    catch(err)
    {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB