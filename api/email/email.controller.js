module.exports = {
  emailCheck,
  sendSubscribeConfirmation,
  subscribeToNewsletter,
  unsubscribeFromNewsletter
}

const emailService = require('./email.service');
const _ = require('lodash');

function emailCheck(req, res, next){
  let email = req.body.email || req.params.email;

  // If email is from params, it needs to be decoded and decrypted
  if(!req.body.email){
    try{
      email = emailService.decryptEmail(email);
    }catch(err){
      return next({status: 400, message: 'Invalid request, make sure that your link is correct.'});
    }
  }
  
  if(!_.isString(email) || !email.includes('@')){
    return next({status: 400, message: 'Invalid email'});
  }

  req.body.email = _.trim(email);
  next();
}

function sendSubscribeConfirmation(req, res, next){
  let email = req.body.email;
  let emailEncoded = emailService.encryptEmail(email);

  emailService.sendMail('Voya Code <blogs@voyacode.com>', email, 'Confirm subscription to Voya Code newsletter',
    'Hey,\n\n'
    + 'You have chosen to subscribe to Voya Code\'s blog newsletter. By subscribing you will get an email notification every time a new blog is added to Voya Code.\n\n'
    + 'Please confirm your subscription by using this link: https://voyacode.com/blogs/subscribe/' + emailEncoded + '\n\n'
    + 'If you didn\'t ask for this email, no action is needed.'
  ).then((data) => {
    res.status(200).json({message: 'Confirmation link has been sent to your email address. Use the link to confirm your subscription.'});
  })
  .catch((err) => next(err));
}

function subscribeToNewsletter(req, res, next){
  let email = req.body.email;

  emailService.addMember(email, 'blogs@voyacode.com').then(() => {
    res.status(200).json({message: 'Your subscription to email \'' + email + '\' has been confirmed. If you ever need to unsubscribe, you can do so from unsubscribe links included in every newsletter email.'});
  })
  .catch(next);
}

function unsubscribeFromNewsletter(req, res, next){
  let email = req.body.email;

  emailService.removeMember(email, 'blogs@voyacode.com').then(() => {
    res.status(200).json({message: 'Your email address ' + email + ' has successfully unsubscribed from Voya Code\'s newsletter.'});
  })
  .catch(next);
}
