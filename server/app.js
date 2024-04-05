const express=require('express')
require ('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');


const DB=require('./config/DB');
const userRoutes=require('./routers/user')
const authRoutes=require('./routers/auth');
const cookieParser = require('cookie-parser');

const app= express();
const port=process.env.PORT || 5555

app.use(express.json())

DB();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true  // Allow cookies to be sent with the request
  }));
app.use(cookieParser());
app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next();
})

app.use('/api',userRoutes)

app.listen(port,()=>{
    console.log(`Server Connected  - ${port}`);
})