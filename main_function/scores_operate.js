function ScoresOperate() {

}
ScoresOperate.prototype.getScoreList = function(scores) {
  var scoreList = [];
  scores.forEach(function(val) {
    for (var i = 0; i < scoreList.length; i++) {
      if (scoreList[i].studentId === val.student_id) {
        scoreList[i][val.subject_name] = val.score;
        return;
      }
    }
    var item = {};
    item.studentId = val.student_id;
    item.name = val.student_name;
    item[val.subject_name] = val.score;
    scoreList.push(item);
  });
  return scoreList;
};

ScoresOperate.prototype.sortScores = function(ScoreList, subject_name, order) {
  var sortedSocreList = ScoreList.sort(function(a, b) {
    return (parseInt(b[subject_name])* parseInt(order) - parseInt(a[subject_name])* parseInt(order)) ;
  });
  return sortedSocreList;
};

module.exports = ScoresOperate;
