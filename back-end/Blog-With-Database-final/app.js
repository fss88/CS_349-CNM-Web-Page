//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var methodOverride = require('method-override');

var dateFormat = require("dateformat");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static('public'));
app.use(methodOverride('_method'));

// mongoose.connect("mongodb+srv://admin:shunshuke@cluster0.gu0rv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/CMM", { useUnifiedTopology: true });
mongoose.connect("mongodb://localhost:27017/CMM", { useUnifiedTopology: true });

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
    post.author = req.body.auhor
    };
  post.save();
  })
  res.redirect("/");
}
)



app.delete('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findByIdAndDelete(requestedPostId, function(err) {
    if(!err) res.redirect("/");
    console.log(err);
  })

})


// app.put('/campgrounds/:id', async (req, res) => {
//   const { id } = req.params;
//   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//   res.redirect(`/campgrounds/${campground._id}`)
// });

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
