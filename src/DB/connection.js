import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("MongoDB Connecting Successfully");
        })
        await mongoose.connect(process.env.DB_URI,{serverSelectionTimeoutMS:50000})
    } catch (error) {
            console.log("MongoDB Connecting Error",error);
    }
}
export default connectDB;