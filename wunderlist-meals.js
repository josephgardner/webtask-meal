var WunderlistSDK = require('wunderlist');
var express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

let reg = /(\w+):\s*([^;]*)/g;
function join(tasks, notes) {
  return tasks.map(task => {
    var rep = { id: task.id, title: task.title };
    var note = notes.find(n => n.task_id === task.id);
    if (note !== undefined) {
      let tag;
      while ((tag = reg.exec(note.content))) {
        rep[tag[1]] = tag[2];
      }
    }
    return rep;
  });
}

app.get('/:id', function(req, res) {
  var api = new WunderlistSDK({
    accessToken: req.webtaskContext.secrets.WUNDERLIST_ACCESS_TOKEN,
    clientID: req.webtaskContext.secrets.WUNDERLIST_CLIENT_ID,
  });

  api.http.tasks
    .forList(req.params.id)
    .done(tasks =>
      api.http.notes
        .forList(req.params.id)
        .done(notes =>
          res.json(join(tasks, notes)).fail(() => res.sendStatus(500))
        )
    )
    .fail(() => res.sendStatus(500));
});

module.exports = Webtask.fromExpress(app);
