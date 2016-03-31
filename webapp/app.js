var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/views')));


var mysql      = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
    user     : 'root',
    password : 'pulse',
    database : 'database_design',
    debug    :  false
});

function handle_database(req, res) {

    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        console.log('connected as id ' + connection.threadId);

        console.log(req);
        // hardcoding input data at the moment
        var sentence_term = 'alzheimer\'s disease';
        connection.query("select s,p,o, count(o) as c from triples where (s =? or s ='ad' or s ='alzheimer disease' or s ='alzheimer' ) and p='be' Group by o ORDER BY count(o) DESC"
        , (sentence_term),function(err,rows){
            connection.release();
            if(!err) {
              var arr = [];
              for(var dataObj in rows){
                arr.push({
                  'key':rows[dataObj].o,
                  'value':rows[dataObj].c
                });
              }


                //rows.sort(function(a, b) {return a[0] - b[0]})
                //res.json(rows);
                res.render('results', { result: JSON.stringify(arr) });
                //res.end();
                //return rows;
            }
            else{
              console.log(err);
            }
          });

        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
}
function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}
app.get('/q', function (req, res) {
   handle_database(req.query.triple1, res);
   // Prepare output in JSON format
   /*response = {
       first_name:req.query.triple1,
       last_name:req.query.triple2
   };*/
   //console.log(response);
});
app.get('/get-link', function (req, res) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);

      console.log(req.query.key);
      var sentence_term = 'alzheimer\'s disease';
      connection.query("select s,p,o, sentence from  triples, sentences where (s = ? or s ='ad' or s ='alzheimer disease' or s ='alzheimer' ) and p='be' and o= ? and triples.sent_id=sentences.sent_id"
      , [sentence_term, req.query.key], function(err,rows){
          connection.release();
          if(!err) {
            var arr = [];
            for(var dataObj in rows){
              arr.push({
                'key':rows[dataObj].sentence,
                'value':0
              });
            }
              res.send((arr));
            }
          else{
            //console.log(err);
          }
        });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
});
});
//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/
app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname + '/views/index.html'));
});
app.get('/sqlOutput', function(req, res) {
   handle_database(req,res);
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
module.exports = app;
