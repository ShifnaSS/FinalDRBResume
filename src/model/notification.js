const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.hypiv.mongodb.net/DRB?retryWrites=true&w=majority');//'mongodb://localhost:27017/MyLibraryMain'

const schema = mongoose.Schema;

const NotSchema = new schema({
    user_id:String,
    username :String,
    activity:String,
    templateid:String,
    weblink:String
});

var not_data = mongoose.model('not_datas',NotSchema);
module.exports = not_data;