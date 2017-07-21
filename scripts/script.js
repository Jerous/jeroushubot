module.exports = function (robot) {
  robot.error(function(err, res) {
    robot.logger.error("GG，可能哪裡出錯了");
    var admin = "@jerouslu";
    if (res !== null) {
      robot.messageRoom(admin, 'errName：' + err.name + '\n' + 'errMsg：' + err.message);
    }
  });
}
