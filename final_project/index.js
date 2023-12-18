const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    
    if(!req.session.authorization) return res.status(401).json({message: "Access Denied"});
    const  token = req.session.authorization['accessToken'];
    try{
        const verified = jwt.verify(token, 'access');
        req.body.user = req.session.authorization['username'];
        console.log("user"+req.body.user);
        next(); 

    }catch(err){
        res.status(400).json({message: "Invalid Token"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
