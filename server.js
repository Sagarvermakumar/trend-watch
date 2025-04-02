import app from "./app.js"
import connectDB from "./Config/connectDB.js";


const PORT = process.env.PORT || 3001;

// Database  connect 
connectDB();

// listening to server
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})