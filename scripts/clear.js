module.exports = function (robot) {

  var job = ['清理瑪莉亞', '拖地', '水槽擦桌子', '倒垃圾', '輪空'];
  var people = ['@meow820730', '@rdjue', '@q0821', '@shingo0620', '@jerouslu'];
  var finalJob = [];
  var tempJob = [];
  var count = 0;

  Array.prototype.shuffle = function () {
    this.forEach(function (el, index, origin) {
      var randomIndex = Math.floor(Math.random()*origin.length)
      var cache = origin[index]
      origin[index] = origin[randomIndex]
      origin[randomIndex] = cache
    })
  }

  Array.prototype.allValuesEqual = function() {
    var count = 0;
    for(var i = 1; i < this.length; i++)
    {
      if(this[i] == this[0])
        count = count + 1;
    }
    return count;
  }

  robot.hear(/開始抽打掃/, function (res) {
    res.send('@channel 開始抽打掃囉，「好手氣」電腦幫大家抽');
    finalJob = [];
    userGetPrev = null;
    userGetNow = null;
    count = 0;
  });

  robot.hear(/好手氣/, function (res) {
    job.shuffle();
    for (var i = 0; i < job.length; i++) {
      res.send(people[i] + '：' + job[i]);
    }
  });

  /*robot.hear(/我抽/, function (res) {
    count = count + 1;
    var userGetNow = res.random(job);
    tempJob.push(userGetNow);
    finalJob.push(res.message.user.name + ' ' + userGetNow);
    res.reply(res.message.user.name + ' ' + userGetNow);

    if (count == 4 && tempJob.allValuesEqual() !== 0) {
      res.send('工作有重複喔，請重複的人重抽！！！');
      count = count - tempJob.allValuesEqual() - 1;
    }

  });

  robot.hear(/結果/, function (res) {
    if (tempJob.allValuesEqual() == 0) {
      for (var i = 0; i < finalJob.length; i++) {
        res.send(finalJob[i]);
      }
    } else {
      res.send('還有人沒抽完阿，不然就是工作重複，猴急什麼！！？');
    }
  });*/


}
