module.exports = {
  addMember,
  removeMember,
  sendMail,
  encryptEmail,
  decryptEmail
}

const _ = require('lodash');

const config = require('../../.config/config');

const apiKey = config.mailgun.apiKey;
const domain = config.mailgun.domain;

const mailgun = require('mailgun-js')({ apiKey, domain });
const urlCrypt = require('url-crypt')(config.encryptPassword);

function addMember(address, list){
  let encodedAddress = encryptEmail(address);
  return mailgun.lists(list).members().create({address, subscribed: true, upsert: 'yes', vars: {encodedAddress}});
}

function removeMember(address, list){
  return mailgun.lists(list).members(address).update({ subscribed: false });
}

function sendMail(fromAddress, toAddress, subject, text, tags = {}){
  let data = {from: fromAddress, to: toAddress, subject, 'h:X-Mailgun-Track-Clicks': 'no', text};
  data = _.assign(data, tags);
  return mailgun.messages().send(data);
}

function encryptEmail(email){
  return urlCrypt.cryptObj(email);
}

function decryptEmail(cryptedEmail){
  return urlCrypt.decryptObj(cryptedEmail);
}
