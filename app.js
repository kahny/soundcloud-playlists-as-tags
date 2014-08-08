var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),  
  flash = require("connect-flash"),
  app = express(),
  methodOverride = require("method-override");
  db = require("./models/index");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}) ); 
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));


app.use(cookieSession( {
  secret: 'thisismysecretkey',
  name: 'session with cookie data',
  // this is in milliseconds
  maxage: 86400000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){ 
      done(error, user);
    });
});


app.get('/', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("index");
  }
  else{
    //get distinct tags to only display those tags as link 
    db.sequelize
    .query('SELECT distinct(tag) FROM tracks WHERE "userId" = ' + req.user.id)
    .success(function(uniqueTags){
      console.log(uniqueTags) //returns tags as an array with tag objects in the form of tag: 'tag'
      res.render('home', {
  			tags: uniqueTags, 
  			//runs a function to see if the user is authenticated - returns true or false
  			isAuthenticated: req.isAuthenticated(),
  			//this is our data from the DB which we get from deserializing
  			user: req.user 
  		})
  	})
  }
});

//make sure user is logged in and then display the tag songs
app.get("/tags/:tag", function(req,res){
  var tag = req.params.tag;
  if(!req.user) {
    res.render("index");
  }
  else{
    db.track.findAll({where: {userId: req.user.id, tag: tag} }).success(function(foundSongs){
  		res.render('tag', {
  			tag: tag,
  			songs: foundSongs, 
  		})
  	})
  } 
});

//login page 
app.get('/login', function(req,res){
  if(!req.user) {	
    res.render("login", {message: req.flash('loginMessage'), email: ""});
  }
  else{
    res.redirect('/home');
  }
});


// authenticate users when logging in - no need for req.res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/login', 
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});


app.get('/signup', function(req,res){
  if(!req.user) {
    res.render("signup", { email: ""});
  }
  else{
    res.redirect('/');
  }
});

// on submit, create a new users using form values
app.post('/submit', function(req,res){  
  
  db.user.createNewUser(req.body.email, req.body.password, 
  function(err){
    res.render("signup", {message: err.message, email: req.body.email});
  }, 
  function(success){
    res.render("index", {message: success.message});
  });
});


//when adding hashtags, separate them out and create a new line in tracks database for each
app.post('/add', function(req,res){  
  
  var tags = req.body.tag.split(" ").join("").split("#")

  for (var i = 1; i < tags.length; i++){
   db.track.createNewTrack(req.body.trackLink, tags[i], req.body.title, req.user.id);
  }
    res.redirect('/');  
});


//delete a track by the id the track/tag listed on the track table
app.delete("/delete/:id", function(req, res) {
  var id = parseInt(req.params.id);
  console.log(id)
  db.track.deleteTrack(id);
  res.redirect("/") //change this to the specific tag page 
})


app.listen(process.env.PORT || 3000, function(){
  console.log("local hosties");  
});