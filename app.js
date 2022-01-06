const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const port = process.env.PORT || 3300;
let jwt =require('jsonwebtoken');
require("dotenv").config();
const bodyparser = require('body-parser');
const user_data = require('./src/model/profile');
const signup_data = require('./src/model/signup');
const not_data = require('./src/model/notification');
const { now } = require('mongoose');
const { timeStamp } = require('console');
var app = new express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(express.static('./dist/frontend'));
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'/src/assets/images')
    },
    filename:(req,file,callback)=>{
        var timestamp = new Date().getTime();
        callback(null,timestamp+file.originalname)
    }
})

var upload= multer({storage:storage})

function verifyToken(req, res, next) {//token
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    // req.userId = payload.subject
    next()
}

app.post("/api/login",function(req,res){
    let session='';
    let username = 'admin';
    let password = 'Admin12345';
    let userData = req.body;
    console.log(userData);
    console.log(userData.user.Username)
    console.log(userData.user.pass)
    const user_name = userData.user.Username;
    const pass_word = userData.user.pass;
    console.log("enterd")
    if(username==userData.user.Username&&password==userData.user.pass){
        console.log("loginAdmin");
        let payload = {subject:username+password}
        let token = jwt.sign(payload,'secretKey')
         session ='adminsession';
        res.status(200).send({token,session});
    }
    else 
    {
        signup_data.findOne({ 'username': userData.user.Username, 'pass1': userData.user.pass })
         .then(function (obj,err) 
         {
            if (obj != null)
             {
                
                let id = obj._id;
                console.log(obj._id);
                let payload = {subject:username+password}
                let token = jwt.sign(payload,'secretKey')
                 session ='usersession';
                res.status(200).send({token,session,id});
                console.log(token)
             }
            else{
                let message = 'No User Found'
                res.status(401).send({ message })
            }
        })
    
        .catch((err) => {
        console.log('Error: ' + err);
        })
    }
})


app.post("/api/addimage",verifyToken,upload.single('file'),function(req,res){
    console.log(req.file.filename)
    const img_file = req.file.filename
    res.status(200).send({img_file});
})
app.delete("/api/deleteprofile:id",verifyToken,(req,res)=>{
    console.log("entered for deleting")
    id = req.params.id;
    user_data.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        let a ="User deleted the profile"
    var newelement = {
        user_id : id,
        activity: a
    }
    var newactivity = new not_data(newelement);
    newactivity.save();
        res.send();
    })
    
})
app.put("/api/update",verifyToken,(req,res)=>{
    console.log(req.body)
        id=req.body.oid,
        console.log(id)
        uname = req.body.data.name,
        date = req.body.data.date,
        gender = req.body.data.gender,
        email_id =req.body.data.email_id,
        phone =req.body.data.phone,
        image =req.body.img,
        yourself = req.body.data.yourself,
        highschools = req.body.data.highschools,
        higherschools = req.body.data.higherschools,
        graduations = req.body.data.graduations,
        posts = req.body.data.posts,
        projects = req.body.data.projects ,
        qualifications =req.body.data.qualifications,
        experiences = req.body.data.experiences,
        skills = req.body.data.skills,
        languages = req.body.data.languages,
        progs  =req.body.data.progs,
        achievements = req.body.data.achievements
        user_data.findByIdAndUpdate({"_id":id},
                                {$set:{"name":uname,
                                "date":date,
                                "gender":gender,
                                "email_id":email_id,
                                "phone":phone,
                                "image":image,
                                "yourself":yourself,
                                "highschools":highschools,
                                "higherschools":higherschools,
                                "graduations":graduations,
                                "posts":posts,
                                "projects":projects,
                                "qualifications":qualifications,
                                "experiences":experiences,
                                "skills":skills,
                                "languages":languages,
                                "progs":progs,
                                "achievements":achievements,}})
   .then(function(){
       console.log("success")
    let a ="User updated the profile"
    var newelement = {
        user_id : req.body.oid,
        username: req.body.data.name,
        activity: a
    }
    var newactivity = new not_data(newelement);
    newactivity.save();
       res.send();
       
   })
   .catch((err)=>{
    console.log(err)
    res.send(false)
})
 })
app.post("/api/adduser",verifyToken,function(req,res){
    res.header("Access-Controll-Allow-origin","*");
    res.header("Access control methods: GET,POST,PATCH,PUT,DELETE");
    console.log("enterdeadduserURL")
    var newuser = {
        userid:req.body.id,
        name :req.body.user.name,
        date :req.body.user.date,
        gender :req.body.user.gender,
        email_id :req.body.user.email_id,
        phone :req.body.user.phone,
        image:req.body.data_img,
        yourself:req.body.user.yourself,
        highschools:req.body.user.highschools,
        higherschools:req.body.user.higherschools,
        graduations:req.body.user.graduations,
        posts:req.body.user.posts,
        projects: req.body.user.projects ,
        qualifications :req.body.user.qualifications,
        experiences:req.body.user.experiences,
        skills:req.body.user.skills,
        languages:req.body.user.languages,
        progs:req.body.user.progs,
        achievements:req.body.user.achievements
    }
    var userdata = new user_data(newuser);
    console.log(userdata,"adduserURL")
    userdata.save();
    let a ="User Created a profile"
    var newelement = {
        user_id : req.body.id,
        username: req.body.user.name,
        activity: a
    }
    var newactivity = new not_data(newelement);
    newactivity.save();
})

app.get('/api/getuser:id',verifyToken, (req, res) => {
  
    const id = req.params.id;
    console.log(id)
    user_data.findOne({"userid":id})
      .then((user_data)=>{
          res.send(user_data);
      });
  })
  app.get('/api/getsignup:id',verifyToken, (req, res) => {
  
    const id = req.params.id;
    console.log(id)
    signup_data.findOne({"_id":id})
      .then((signup_data)=>{
          res.send(signup_data);
      });
  })

  app.get('/api/userslist',verifyToken,(req,res)=>
  {
    signup_data.find()
    .then((users)=>
    {
        res.send(users);
    });
  });
  app.get('/api/checkpro:userid',verifyToken, (req, res) => {
  
    const id = req.params.userid;
    console.log(id)
    user_data.findOne({"userid":id})
      .then((user_data)=>{
          res.send(user_data);
      });
  })

  app.get('/api/getnot',verifyToken, (req, res) => {
  
    not_data.find()
    .then((notifications)=>
    {
        res.send(notifications);
    });
  })

  app.post("/api/signup",function(req,res){
    res.header("Access-Controll-Allow-origin","*");
    res.header("Access control methods: GET,POST,PATCH,PUT,DELETE");
    console.log("entered");
    console.log(req.body.user);
    var newsignup = {
        username :req.body.user.username,
        email_id :req.body.user.email_id,
        phone :req.body.user.phone,
        pass1 :req.body.user.pass1,
        pass2 :req.body.user.pass2,
    }
    var signupData = new signup_data(newsignup);
    signupData.save();
    let a = "New user Signup"
    var newelement = {
        user_id : req.body.user.username,
        activity: a
    }
    console.log(a);
    var newactivity = new not_data(newelement);
    newactivity.save();
})
app.post('/api/download',verifyToken,(req,res)=>
  {
   var id =req.body.id;
   var template = req.body.templateid;
    let a = "New download"
    var newelement = {
        user_id : id,
        activity: a,
        templateid:template
    }
    var newactivity = new not_data(newelement);
    newactivity.save();
  });
  app.post('/api/weblink',verifyToken,(req,res)=>
  {
   var id =req.body.webuserid;
   var web = req.body.weblinkid;
    let a = "User shared a weblink"
    var newelement = {
        user_id : id,
        activity: a,
        weblink:web
    }
    var newactivity = new not_data(newelement);
    newactivity.save();
  });

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
   });
  app.listen(port,()=>{console.log("Server Ready at" +port)});