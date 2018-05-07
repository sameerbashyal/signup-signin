var express = require('express');
var router = express.Router();
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;

var User= require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/signin', function(req, res, next) {
  res.render('signin');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});


router.post('/signup', function(req, res, next) {
  var firstname= req.body.firstname;
  var lastname= req.body.lastname;
  var email= req.body.email;
  var password= req.body.password;
  var password2= req.body.password2;
  // validation
  req.checkBody('firstname','Firstname is Required').notEmpty();
  req.checkBody('lastname','Lastname is Required').notEmpty();
  req.checkBody('email','Email is Required').isEmail();
  req.checkBody('password','Password is Required').notEmpty();
  req.checkBody('password2','passwords do not match').equals(req.body.password);

 var errors= req.validationErrors();
 if(errors)
 {
   res.render('signup',{
   errors:errors
 });
 }
 else{
var newUser = new User({
firstname:firstname,
lastname:lastname,
email:email,
password:password
});
User.createUser(newUser,function(err,user){

  if(err)throw err;
  console.log(user);
});
req.flash('success_msg','You are registered and can now login');
res.redirect('/users/signin');
}
 
});

passport.use(new LocalStrategy(
  { usernameField: 'email',    
    passwordField: 'password'
  },
  function(email, password, done) {
 
User.getUserByUsername(email,function(err,user){

if(err) throw err;
if(!user){
return done(null,false,{message:'Unknown User'});

}
User.comparePassword(password , user.password,function(err,isMatch){
if(err) throw err;
if(isMatch){

  return done(null,user);
}
else 
{
   return done (null, false, {message:'Invalid password'});
}
});
});
}));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});





router.post('/signin',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/signin',failureFlash:true}),
  function(req, res) {
    res.redirect('/');
   
  });

router.get('/signout',function(req,res){
req.logout();
req.flash('success_msg',' you are logged out ');
res.redirect('/users/signin');
});




module.exports = router;