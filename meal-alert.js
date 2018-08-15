var express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var sgMail = require('@sendgrid/mail');

var app = express();

app.use(bodyParser.json());

app.post('/', function(req, res) {
  req.webtaskContext.storage.get((error, data) => {
    sgMail.setApiKey(req.webtaskContext.secrets.SENDGRID_API_KEY);
    const msg = {
      to: data,
      from: 'meals@webtask.io',
      subject: 'Meal Ideas!',
      text: req.body.meals.join('\n'),
    };
    sgMail.send(msg);
  });
  res.sendStatus(200);
});

app.get('/subs', (req, res) =>
  req.webtaskContext.storage.get((error, data) => res.json(data))
);

app.put('/subs', (req, res) => {
  req.webtaskContext.storage.set(req.body, { force: 1 }, () => {});
  res.sendStatus(204);
});

module.exports = Webtask.fromExpress(app);
