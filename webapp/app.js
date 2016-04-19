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
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/views')));


var mysql = require('mysql');


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'beat.comp.ae.keio.ac.jp',
    port     :  **,
    user     : '**',
    password : '**',
    database : 'ad_reverb',
    debug    :  false

});

function handle_database(req, res) {

    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        console.log('connected as id ' + connection.threadId);

		         
	    var searchType = req.query.searchType;
		
	   
        // hardcoding input data at the moment
        var sentence_triple1 = req.query.triple1;
		var sentence_triple2 = req.query.triple2;
		var sentence_triple3 = req.query.triple3;
		var whereClause=" ";
		
		var triple1_synonymns=[];
		var triple2_synonymns=[];
		var triple3_synonymns=[];
		//Parsing the triples based on ";"
		if(sentence_triple1.trim()!="") 
		{
			triple1_synonymns = sentence_triple1.split(';');
			var triple1_query="(";
	
			for(i=0;i<triple1_synonymns.length;i++){
				if(searchType == "exactMatch")
				{
					if(i==triple1_synonymns.length-1)
						triple1_query+=" s=?";
					else
						triple1_query+=" s=? or";
				}
				else
				{
					if(i==triple1_synonymns.length-1)
					triple1_query+=" s LIKE ?";
					else
					triple1_query+=" s LIKE ? or";
				}
			}
			if(sentence_triple2.trim()!="" || (sentence_triple3.trim()!="") ) 
				triple1_query+=") and";
			else
				triple1_query+=")";
			whereClause+=triple1_query;
		}	
		
		if(sentence_triple2.trim()!="") 
		{	
			triple2_synonymns = sentence_triple2.split(';');
			var triple2_query="(";
			for(i=0;i<triple2_synonymns.length;i++){
				if(searchType == "exactMatch")
				{
					if(i==triple2_synonymns.length-1)
						triple2_query+=" p=?";
					else
						triple2_query+=" p=? or";
				}
				else
				{
					if(i==triple2_synonymns.length-1)
					triple2_query+=" p LIKE ?";
					else
					triple2_query+=" p LIKE ? or";
				}
			}
			if(sentence_triple3.trim()!="") 
				triple2_query+=") and ";
			else
				triple2_query+=")";
			whereClause+=triple2_query;
			
		
		}
		
		if(sentence_triple3.trim()!="") 
		{
			triple3_synonymns = sentence_triple3.split(';');
			var triple3_query="(";
			for(i=0;i<triple3_synonymns.length;i++){
				if(searchType == "exactMatch")
				{
					if(i==triple3_synonymns.length-1)
						triple3_query+=" o=?";
					else
						triple3_query+=" o=? or";
				}
				else
				{
					if(i==triple3_synonymns.length-1)
					triple3_query+=" o LIKE ?";
					else
					triple3_query+=" o LIKE ? or";
				}
			}
			
			triple3_query+=")";
			whereClause+=triple3_query;
		}
			
		   console.log(triple1_synonymns.concat(triple2_synonymns.concat(triple3_synonymns)));
			console.log(triple1_query+triple2_query+triple3_query);
			console.log(whereClause);
			
		
		
        connection.query("select s,p,o, count(o) as c from triples where "+ whereClause +" Group by o ORDER BY count(o) DESC"
        , (triple1_synonymns.concat(triple2_synonymns.concat(triple3_synonymns))),function(err,rows){

            connection.release();
            if (!err) {
                var arr = [];
                for (var dataObj in rows) {
                    arr.push({
                        'key': rows[dataObj].o,
                        'value': rows[dataObj].c,
                        'subject': rows[dataObj].s,
                        'predicate': rows[dataObj].p,
                        'inputSubject': sentence_triple1,
                        'inputPredicate': sentence_triple2,
                        'inputObject': sentence_triple3
                    });
                }


                //rows.sort(function(a, b) {return a[0] - b[0]})
                //res.json(rows);
                res.render('results', {
                    result: JSON.stringify(arr)
                });
                //res.end();
                //return rows;
            } else {
                console.log(err);
            }
        });

        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}
app.get('/q', function(req, res) {
    handle_database(req, res);
});

<<<<<<< HEAD
app.get('/get-link', function (req, res) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);

      var where_clause = " ";
      if(req.query.filter == "true"){
		 if(req.query.year2.trim()!="")
			where_clause += " and year >= " + req.query.year + " and year <= " + req.query.year2;
		else
			where_clause += " and year = " + req.query.year ;
      }

      var queryEntries = [];
      queryEntries.push(req.query.sub);
      queryEntries.push(req.query.pred);
      queryEntries.push(req.query.key );
      connection.query("select s,p,o, triples.pmid, sentence, year from  triples, sentences, years where s = ? " + where_clause + " and p= ? and o= ? and triples.sent_id=sentences.sent_id and triples.pmid = years.pmid"
      , (queryEntries), function(err,rows){
          connection.release();
          if(!err) {
            var arr = [];
            for(var dataObj in rows){
              arr.push({
                'key':rows[dataObj].sentence,
                'value':"http://www.ncbi.nlm.nih.gov/pubmed/?term="+ rows[dataObj].pmid
              });
            }
            console.log(arr.length);
              res.send((arr));
            }
        });

        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
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
    handle_database(req, res);
});
app.listen(3000, function() {
    console.log('Application now listening on port 3000!');
});
module.exports = app;
