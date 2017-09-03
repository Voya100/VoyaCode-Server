module.exports = {
  adminAuth,
  checkLogin,
  initializeUser,
  login
}

const auth = require('./auth.service');

// This is called before all routes to initialize user state
function initializeUser(req, res, next){
  req.user = {username: 'Anonymous', admin: false, loggedIn: false};
  if (!(req.headers && req.headers.authorization)) {
    return next();
  }
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  auth.decodeToken(token, (err, payload) => {
    if (!err) {
      req.user = payload;
      console.log('authenticated, setting payload', payload)
      next();
    }
  });
}

function login(req, res, next){
  const username = req.body.username;
  const password = req.body.password;

  return auth.login(username, password).then((token) => {
    res.status(200).json({token: token});
  }).catch((err) => {
    return next({status: 400, message: 'Invalid login details.'});
  });
}

function checkLogin(req, res){
  if(req.user.loggedIn){
    res.status(200).json({message: 'Logged in'});
  }else{
    res.status(401).json({message: 'Not logged in'});
  }
}

function adminAuth(req, res, next){
  if (!(req.headers && req.headers.authorization)) {
    return next({status: 401, message: 'Admin authentication required.'});
  }else if(!req.user || !req.user.admin){
    return next({status: 401, message: 'Token has expired.'});
  }
  next();
}