module.exports = function (robot) {

  // var jobs = ['清理瑪莉亞', '拖地', '水槽擦桌子', '倒垃圾', '輪空'];
  var jobs = ['清理瑪莉亞', '拖地', '水槽擦桌子', '倒垃圾'];
  var peoples = ['@rdjue', '@q0821', '@shingo0620', '@jerouslu'];

  Array.prototype.shuffle = function () {
    this.forEach(function (el, index, origin) {
      var randomIndex = Math.floor(Math.random()*origin.length)
      var cache = origin[index]
      origin[index] = origin[randomIndex]
      origin[randomIndex] = cache
    })
  }

  robot.hear(/開始抽打掃/, function (res) {
    if (res.envelope.room === 'C0Q32Q4GZ') {
      res.send('@channel 開始抽打掃囉，輸入「好手氣」電腦幫大家抽，或「@user 輪空，抽打掃」來設定誰輪空');
    }
  });

  robot.hear(/好手氣/, function (res) {
    if (res.envelope.room === 'C0Q32Q4GZ') {
      jobs.shuffle();
      for (var i = 0; i < jobs.length; i++) {
        res.send(peoples[i] + '：' + jobs[i]);
      }
    }
  });

  robot.hear(/(.*) 輪空，抽打掃/, function(res) {
    if (res.envelope.room === 'C0Q32Q4GZ') {
      var freePeople = res.match[1];
      var clearPeoples = peoples.filter(function (people){
        return people !== freePeople;
      });
      var clearJobs = jobs.filter(function (job){
        return job !== '輪空';
      });

      clearJobs.shuffle();
      for (var i = 0; i < clearJobs.length; i++) {
        res.send(clearPeoples[i] + '：' + clearJobs[i]);
      }
      res.send(freePeople + '：輪空');
    }
  });
}
