//Things that we have used in this whole backend application
//=====
//Language: Javascript
//Node Js: Runtime environment for Javascript - Serves on server side - Used for backend
//ExpressJs: NPM Package - Used for routing
//NPM - Node Package Module
//Mongoose: NPM package that uses mongoDB and it is a modular approach of using mongodb - everything is organized
//EJS: NPM package - Embedded Javascript - View engine - It is a simple templating language/engine that lets its user generate HTML with plain javascript.
//Package JSON: When npm start command is executed it installs all the packages inside package.json
//jshint esversion:6

//Include/Require/Import packages that are being used in this file
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var methodOverride = require('method-override');
var dateFormat = require("dateformat");

//This is app initialization with express - app is an object of express class
const app = express();

//Specify what templating/view engine we are going to use inside our application - here we have sspecified ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

//Here we specify the path of public directory we are using
app.use('/', express.static('public'));
app.use(methodOverride('_method'));

//Connection string: mongodb://localhost:27017/CMM
//Name of the database is CMM
mongoose.connect("mongodb+srv://admin:shunshuke@cluster0.cyzeb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true });
// mongoose.connect("mongodb://localhost:27017/CMM", { useUnifiedTopology: true });

//Here we specify the structure/schema of the mongodb collection - key value pair - Specify the type of each key that is in the mongodb collection
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

// "Post" is name of the collection/table - Pass a schema i.e. postSchema that describes the structure of document in Post collection in mongodb
const Post = mongoose.model("Post", postSchema);

//Specify an express route, This route recieves a get request, and we have a call back function(req, res) - recieves two argguments - request and response
app.get("/", function(req, res){
  
  //Query Mongodb to find all the posts in the Post collection using the Postschema model we created above
  Post.find({}, function(err, posts){

    console.log({
      posts: posts
      })
    
    //posts variabel contains all the posts and passes their variables to home page - where we can iterate over posts array to render the content and display it
    res.render("home", {
      posts: posts
      });
  });
});

//Compose route
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){

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
      postId: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      picture: post.picture,
      postDate: post.postDate
    });
  });

});

app.get("/posts/:postId/edit", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("edit", {
      postId: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      picture: post.picture,
      postDate: post.postDate
    });
  });
})

app.put("/posts/:postId", async function(req, res) {
  const requestedPostId = req.params.postId;
  console.log(req.body);
  await Post.findById(requestedPostId, function(err, post) {
    if (!err) {
    post.title = req.body.postTitle,
    post.picture = req.body.picture,
    post.content = req.body.postBody,
    post.author = req.body.author
    };
  post.save();
  })
  res.redirect("/");
}
)



app.delete('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findByIdAndDelete(requestedPostId, function(err) {
    if(err) console.log(err);
  })

})

//static about route
app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/post", function(req, res){
  res.render("post");
});

//Here we specify the port for the application to listen on and start serving the application with a message
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
