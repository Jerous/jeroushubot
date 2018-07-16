const opencc = require('node-opencc');
const config = require('../config/config.json');

module.exports = function (robot) {

  robot.hear(/(.*)/, function(res) {
    var selfRes = res;
    var keyWord = res.match[1];
    var data = JSON.stringify({
      reqType:0,
        perception: {
          inputText: {
            text: keyWord
          }
        },
        userInfo: config.tuling123
    })
    robot.http("http://openapi.tuling123.com/openapi/api/v2")
      .header('Content-Type', 'application/json')
      .post(data)(function(err, res, body) {
        var body = JSON.parse(body);
        selfRes.send(opencc.simplifiedToTaiwanWithPhrases(body.results[0].values.text));
    });
  });

}
