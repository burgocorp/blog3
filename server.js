const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();





const userRoute = require('./routes/user');
const profileRoute = require('./routes/profile');


require('./db');



app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(passport.initialize());
require('./config/passport')(passport);





app.use('/user', userRoute);
app.use('/profile', profileRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('server started..'));
