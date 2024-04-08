const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.use("/auth",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        token = req.session.authorization['access_token'];
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                res.status(403).send("User not authenticated");
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(403).send("User not logged in");
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.use("/auth", customer_routes);

app.listen(PORT,()=>console.log("Server is running"));

