const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.hypiv.mongodb.net/DRB?retryWrites=true&w=majority');//'mongodb://localhost:27017/MyLibraryMain'

const schema = mongoose.Schema;

const UserSchema = new schema({
    userid:String,
    name :String,
    date :String,
    gender :String,
    email_id :String,
    phone :Number,
    image :String,
    yourself:String,
    highschools:[{edu_title:String,edu_desc:String,edu_school:String,edu_year:String}],
    higherschools:[{edu_title:String,edu_desc:String,edu_school:String,edu_year:String}],
    graduations:[{edu_title:String,edu_desc:String,edu_stream:String,edu_inst:String,edu_year:String}],
    posts:[{edu_title:String,edu_desc:String,edu_stream:String,edu_inst:String,edu_year:String}],
    projects:[{title:String,
        desc:String}],
    qualifications :[{course_name:String,percentage:Number,edu_type:String}],
    experiences:[{job_title:String,exp_from:Number,exp_to:Number}],
    skills:[{skills:String}],
    languages:[{languages:String}],
    progs:[{progs:String,prog_perc:String}],
    achievements:[{achievements:String}]
});

var user = mongoose.model('users',UserSchema);
module.exports = user;