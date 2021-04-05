//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var dateFormat = require("dateformat");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static('public'));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({

  title: String,
  content: String,
  author: String,
  picture: String,
  postURLPostFix: String,
  postDate: String,
  date: {
    type: Date,
    Default: new Date(),
  }
  //comment: [String] - optional 
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){

    console.log({
      posts: posts
      })
    
    res.render("home", {
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  var postURLPostFix = req.body.postTitle.replace(" ", "-").toLowerCase();//Replace space with -
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    picture: req.body.picture,
    author: req.body.author,
    postURLPostFix: postURLPostFix,
    postDate: String(dateFormat())
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;
console.log(requestedPostId, "===> requestedPostId")
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      author: post.author,
      picture: post.picture,
      postDate: post.postDate
    });
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/post", function(req, res){
  res.render("post");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
