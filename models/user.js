var bcrypt = require("bcrypt");
var passport = require("passport");
var passportLocal = require("passport-local");
var salt = bcrypt.genSaltSync(10);


function User(sequelize, DataTypes){
  var User = sequelize.define('user',{
    email: {
			type: DataTypes.STRING,
			unique: true,
      allowNull: false,
			validate: {
			len: [6, 30],
			}	
		},
    password: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		}
  },
    {
      classMethods: {
        associate: function(db) {
          User.hasMany(db.track);
        },
        encryptPass: function(password) {
          var hash = bcrypt.hashSync(password, salt);
          return hash;
        },
        comparePass: function(userpass, dbpass) {
          // don't salt twice when you compare....watch out for this
          return bcrypt.compareSync((userpass), dbpass);  
        },
        createNewUser:function(email, password, err, success ) {
          if(password.length < 6) {
            err({message: "Password should be more than six characters"});
        }
        else{
          User.create({
            email: email,
            password: this.encryptPass(password)
          }).error(function(error) {
            console.log(error);
            if(error.email){
              err({message: 'Your email should be at least 6 characters long', email: email});
            }
            else{
              err({message: 'An account with that username already exists', email: email});
              }
          }).success(function(user) {
            success({message: 'Account created, please log in now'}); //not getting this message..
          });
        } //close else 
      },  //close create new ueser 


      }//close class methods outer 
    }
  )//close define user  
  

  passport.use(new passportLocal.Strategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback : true
    },

    function(req, email, password, done) {
      // find a user in the DB
      User.find({
          where: {
            email: email
          }
        })
        // when that's done, 
        .done(function(error,user){
          console.log(user)
          if(error){
            console.log(error);
            return done (err, req.flash('loginMessage', 'Oops! Something went wrong.'));
          }
          if (user === null){
            return done (null, false, req.flash('loginMessage', 'Email does not exist.'));
          }
          if ((User.comparePass(password, user.password)) !== true){
            return done (null, false, req.flash('loginMessage', 'Invalid Password'));
          }
          done(null, user); 
        });
    }));


  return User;
}//close user function 

module.exports = User;