var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),  //store session data in a cookie 
  flash = require("connect-flash"),
  app = express(),
  db = require("./models/index");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}) ); 

app.use(cookieSession( {
  secret: 'thisismysecretkey',
  name: 'session with cookie data',
  // this is in milliseconds
  maxage: 360000
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
    // res.redirect('/home');
    db.track.findAll({where: {userId: req.user.id} }).success(function(tags){
  		res.render('home', {
  			tags: tags, 
  			//runs a function to see if the user is authenticated - returns true or false
  			isAuthenticated: req.isAuthenticated(),
  			//this is our data from the DB which we get from deserializing
  			user: req.user 
  		})
  	})
  }
});

//display the tag songs 
app.get("/tags/:tag", function(req,res){
  var tag = req.params.tag;
  if(!req.user) {
    res.render("index");
  }
  else{
    // res.redirect('/home');
    db.track.findAll({where: {userId: req.user.id, tag: tag} }).success(function(foundSongs){
  		res.render('tag', {
  			songs: foundSongs, 
  			//runs a function to see if the user is authenticated - returns true or false
  			isAuthenticated: req.isAuthenticated(),
  			//this is our data from the DB which we get from deserializing
  			user: req.user 
  		})
  	})
  } 
});


app.get('/home', function(req,res){
  res.render("home", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

// app.use(flash());

app.get('/login', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("login", {message: req.flash('loginMessage'), email: ""});
  }
  else{
    res.redirect('/home');
  }
});




// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home', 
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
    res.redirect('/home');
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


app.get('/search', function(req,res){

  var query = req.query.searchTerm;
  // console.log(query) 
	res.render('search', {
		taco: query,
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});       
})

app.post('/add', function(req,res){  
  console.log(req.body)
  console.log("USER")
  console.log(req.user)
  console.log('hi')
  db.track.createNewTrack(req.body.trackLink, req.body.tag, req.body.title, req.user.id);
  
  // console.log(query)
});


app.listen(3000, function(){
  console.log("local hosties");  
});