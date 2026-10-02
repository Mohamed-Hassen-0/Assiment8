import connectDB from "./DB/connection.js"
import { NotesRouter, UserRouter } from "./Modules/index.js"

const bootstrap = async (app,express)=>{
app.use(express.json())
await connectDB()

app.use("/api/v1/users",UserRouter)
app.use("/api/v1/notes",NotesRouter)
app.all("/*dummy",(req,res)=>{
    return res.status(404).json({message:"Not Found Handler !!"})
})
}


export default bootstrap;