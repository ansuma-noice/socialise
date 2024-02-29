import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import dontenv from "dotenv";
import {fileURLToPath} from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {createPost} from "./controllers/posts.js";
import {register} from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users,posts} from "./data/index.js";

// CONFIGURATIONS

// Retrieving the current file's path and directory name
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

// Configuring environment variables from a .env file
dontenv.config();

// Creating an Express application
const app=express();

// Parsing incoming JSON requests
app.use(express.json());

// Applying Helmet middleware for enhanced security
app.use(helmet());

// Setting cross-origin resource policy using Helmet
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));

// Logging HTTP requests with Morgan middleware
app.use(morgan("common"));

// Parsing URL-encoded requests with body-parser (limiting sizes)
app.use(bodyParser.json({limit:"30mb",extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended: true}));

// Handling Cross-Origin Resource Sharing (CORS) with CORS middleware
app.use(cors());

// Serving static files from the '/public/assets' directory
app.use("/assets", express.static(path.join(__dirname,'public/assets')));


//FILE STORAGE
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
});
const upload=multer({storage});

// ROUTES WITH FILES
 app.post("/auth/register",upload.single("picture"),register);
 app.post("/posts",verifyToken,upload.single("picture"),createPost);


//  ROUTES
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

// MONGOOSE SETUP
const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(
    ()=>{
        app.listen(PORT,()=> console.log(`Server PORT:${PORT}`))
        
        // Add data one time
        // User.insertMany(users);
        // Post.insertMany(posts);
    }
    
)
.catch((error)=>console.log(`${error} did not connect`));



 









