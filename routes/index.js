var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res) {
  res.render('index', { title: 'furnitureland'});
});
router.get('/about',ensureAuthenticated, function(req, res, next) {
  res.render('about');
});


router.get('/updateprofile',ensureAuthenticated, function(req, res, next) {
  res.render('updateprofile');
});

router.get('/furniture-list', function(req, res, next) {
  res.render('furnitureland-list');
});
function ensureAuthenticated(req,res,next){
if(req.isAuthenticated()){
return next();

}
else{
req.flash('error_msg','You are not logged in ');
res.redirect('/users/signin');
}

}
module.exports = router;
