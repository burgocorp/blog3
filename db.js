const mongoose = require('mongoose');

const mongoDBurl = "mongodb+srv://myounghwan:qnfmrh0228@cluster0-1dywn.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoDBurl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
    .then(() => console.log("MongoDB connected.."))
    .catch(err => console.log(err.message));