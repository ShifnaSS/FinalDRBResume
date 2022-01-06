const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.hypiv.mongodb.net/DRB?retryWrites=true&w=majority');//'mongodb://localhost:27017/MyLibraryMain'

const schema = mongoose.Schema;

const SignupSchema = new schema({
    username:String,
    email_id:String,
    phone:Number,
    pass1:String,
    pass2:String
});

var sign_data = mongoose.model('signup_datas',SignupSchema);
module.exports = sign_data;