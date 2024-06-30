const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeContent = "This is the home page for your daily journal. You can write any journal or blog you want to. You can also compose blogs by various names ehich will be displayed on the home page."
const aboutContent = "This is our about page."
const contactContent = "This is our contact page."

const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/journalDB");
const postSchema = {
    title:String,
    content:String 
};
const Post = mongoose.model("Post",postSchema);

app.get("/",function(req,res){
    Post.find({})
    .then(function(posts){
        res.render("home",{
            homeContent:homeContent,
            posts:posts 
        });
    })
    .catch(function(err){
        console.log(err);
    });
});

app.get("/about",function(req,res){
    res.render("about",{aboutContent:aboutContent});
});
app.get("/contact",function(req,res){
    res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
    res.render("compose");
});
app.post("/compose",function(req,res){

    const post = new Post({
        title:req.body.postTitle,
        content:req.body.postBody 
    });
    post.save();
    res.redirect("/");
});

app.get("/posts/:postId",function(req,res){ 
    const requestedTitle = _.lowerCase(req.params.postName);
    const requestedPostId = req.params.postId;

Post.findOne({_id:requestedPostId})
.then(function(post){
    res.render("post",{
        title:post.title,
        content:post.content 
    });
})
.catch(function(err){
    console.log(err); 
});
});

app.listen(3000,function(){
    console.log("server running on port 3000");
});