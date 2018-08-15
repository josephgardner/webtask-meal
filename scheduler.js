var request = require('request');

module.exports = function(context, cb) {
  request(
    {
      url: context.secrets.MEALS_URL,
      json: true,
    },
    (error, response, body) => {
      var meals = body
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(m => m.title);

      request(
        {
          url: context.secrets.ALERT_URL,
          method: 'post',
          json: { meals: meals },
        },
        (error, response, body) => cb(error, meals)
      );
    }
  );
};
