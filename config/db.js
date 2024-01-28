import mongoose from "mongoose"

const connectDB = async () => {
    try {
        // const conn = await mongoose.connect(process.env.MONGODB_URL, {
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true,
        //     useCreateIndex: true
        // })

        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Mongo Db connected ${conn.connection.host}`);
        
    } catch (error) {
        console.log(`Mongo Db Error ${error}`);
    }
}

export default connectDB;