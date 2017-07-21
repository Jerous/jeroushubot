module.exports = function (robot) {

  var jobs = ['清理瑪莉亞', '拖地', '水槽擦桌子', '倒垃圾', '輪空'];
  var peoples = ['@rdjue', '@q0821', '@shingo0620', '@jerouslu', '@meow820730'];

  Array.prototype.shuffle = function () {
    this.forEach(function (el, index, origin) {
      var randomIndex = Math.floor(Math.random()*origin.length)
      var cache = origin[index]
      origin[index] = origin[randomIndex]
      origin[randomIndex] = cache
    })
  }

  robot.hear(/開始抽打掃/, function (res) {
    res.send('@channel 開始抽打掃囉，輸入「好手氣」電腦幫大家抽，或「@user 輪空，抽打掃」來設定誰輪空');
  });

  robot.hear(/好手氣/, function (res) {
    jobs.shuffle();
    for (var i = 0; i < jobs.length; i++) {
      res.send(peoples[i] + '：' + jobs[i]);
    }
  });

  robot.hear(/ (.*) 輪空，抽打掃/, function(res) {
    var freePeople = res.match[1];
    var clearPeoples = peoples.filter(function (people){
      return people !== freePeople;
    });
    var clearJob = jobs.filter(function (job){
      return job !== '輪空'; 
    });

    clearJob.shuffle();
    for (var i = 0; i < clearJob.length; i++) {
      res.send(clearPeoples[i] + '：' + clearJob[i]);
    }
    res.send(freePeople + '：輪空');
  });
}
