module.exports = function (robot) {
  robot.hear(/hello/, function (res) {
    res.send('world');
  });
  
  robot.error(function(err, res) {
    robot.logger.error("GG，可能哪裡出錯了");
    if (res !== null) {
      return res.reply("GG，可能哪裡出錯了");
    }
  });

}
