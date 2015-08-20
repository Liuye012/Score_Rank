var express = require('express');
var hbs = require('hbs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var ScoresOperate = require('./main_function/scores_operate.js');

var app = express();
var connection;
var Scores_Operate = new ScoresOperate();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('node_modules'));
app.use(express.static('public'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.all('*', function(req, res, next) {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'student'
  });
  connection.connect(function(err) {
    if (err) {
      throw err;
    } else {
      next();
    }
  });
});

app.get("/", function(req, res) {
  var sqlString = 'select students.student_id,student_name,subject_name,score ' +
    'from students,subjects,scores ' +
    'where scores.student_id=students.student_id and ' +
    'scores.subject_id=subjects.subject_id';
  connection.query(sqlString, function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows);
    var ScoreList = Scores_Operate.getScoreList(rows);
    //console.log(ScoreList);
    res.render('index', {
      ScoreList: ScoreList
    });

    connection.end();
  });
});

app.get("/scoreSort", function(req, res) {
  var sortKey = req.query.sortKey;
  var sortOrder = req.query.sortOrder;

  var sqlString = 'select students.student_id,student_name,subject_name,score ' +
    'from students,subjects,scores ' +
    'where scores.student_id=students.student_id and ' +
    'scores.subject_id=subjects.subject_id';
  connection.query(sqlString, function(err, rows, fields) {
    if (err) throw err;
    var ScoreList = Scores_Operate.getScoreList(rows);
    var sortedScoreList = Scores_Operate.sortScores(ScoreList, sortKey, sortOrder);
    res.send(sortedScoreList);
    connection.end();
  });
});

app.delete("/delScore", function(req, res, fields) {
  var delResult = {};
  var delStudent = req.body;
  var sqlString = "delete from scores where student_id=" + delStudent.delStudentId + ";";
  connection.query(sqlString, function(err, rows) {
    if (err) throw err;
    if (rows.affectedRows > 0) {
      delResult = {
        status: 200,
        message: "",
        data: ""
      };
    } else {
      delResult = {
        status: 404,
        message: "delete failed",
        data: ""
      };
    }
    res.send(delResult);
    connection.end();
  });
});

app.post("/InsertScore", function(req, res) {
  var insertResult = {};
  var InsertStudent = req.body;
  var InsertId;
  var sqlString1 = "insert into students(student_name) values('" + InsertStudent.InsertName + "');";
  connection.query(sqlString1, function(err, rows) {
    if (err) throw err;
    InsertId = rows.insertId;
    // console.log(InsertStudent.InsertName);
    var sqlString2 = "insert into scores values(''," + InsertId + ",1," + InsertStudent.InsertChinese + ")," +
      "(''," + InsertId + ",2," + InsertStudent.InsertMath + ")," +
      "(''," + InsertId + ",3," + InsertStudent.InsertMath + ");";
    connection.query(sqlString2, function(err, rows) {
      if (err) {
        throw err;
      } else {
        if (rows.affectedRows > 0) {
          insertResult = {
            status: 200,
            message: "",
            data: InsertId
          };
        } else {
          insertResult = {
            status: 404,
            message: "insert failed",
            data: ""
          };
        }
      }
      res.send(insertResult);
      connection.end();
    });

  });
});
app.listen(8080);
