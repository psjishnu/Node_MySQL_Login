var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var mysql =require('mysql');
var ck=0;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "jishnu"
  //Create a table customers in jishnu with varchar name and varchar address
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Sql login is listening at localhost:",port)

});

 
app.get('/', function (req, res) {
  var html='';
  ck=0;
  fs.readFile('new.html', 'utf8', function(err,html){
  html=html.replace("poda","ppp");
  res.send(html); });
});
app.get('/register',urlencodedParser,function(req,res){
    fs.readFile('register.html', 'utf8', function(err,html){
      if(err) throw err;
      res.send(html); });
});



app.post('/thank1',urlencodedParser,function(req,res){
  var nn="";var np="";var npre="";var ns="";var lock=0;
  var sql = "INSERT INTO customers (name, address) VALUES ('x1', 'x2')";
  nn=req.body.name;np=req.body.password;ns=req.body.submit;
  npre=req.body.repassword;
  function verify(x){
    var x1=0;
    x1=x;
    if(np!=npre){
      x1=3;
    }
    ins(x1);
  }
  con.query("SELECT name,address FROM customers", function (err, result,fields ) {
  for(i=0;i<result.length;i++)
      {
          if(result[i].name==nn)
          {  
            lock=1;        
            break;
          }

      }
    verify(lock);
    });
  function ins(ax){
    if(ax==0){
      var sql1= sql.replace("x1",req.body.name);
      sql1=sql1.replace("x2",req.body.password);
      con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("record inserted");
      });
      fs.readFile('register.html', 'utf8', function(err,htmla){
      if(err) throw err;
      htmla=htmla.replace("id=\"id1\">","id=\"id1\"><b>NEW USER REGISTERED<b>")
      res.send(htmla); });
    }
    else if(ax==3){
      fs.readFile('register.html', 'utf8', function(err,html){
      if(err) throw err;
      html=html.replace("<p id=\"id1\">","<p id=\"id1\">PASSWORD NOT SAME")
      res.send(html); });
    }
    else{
      fs.readFile('register.html', 'utf8', function(err,html){
      if(err) throw err;
      html=html.replace("<p id=\"id1\">","<p id=\"id1\"><b>USERNAME ALREADY EXISTS<b>")
      res.send(html); });
    }
  }
});
app.post('/thank', urlencodedParser, function (req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  var nn="";var np="";var ns="";ck=1;
  var sql = "INSERT INTO customers (name, address) VALUES ('x1', 'x2')";
  nn=req.body.name;np=req.body.password;ns=req.body.submit;
  con.query("SELECT name,address FROM customers", function (err, result,fields ) {
    if (err) throw err;
    var html='';str1='';var inn=0;var k;
    for(i=0;i<result.length;i++)
    {
        if(nn==result[i].name && np==result[i].address )
         { 
            inn=1;
            break;
         }

    }
    if(inn==1 && ck==1){
      for(k=0;k<nn.length;k++)
      {
        str1=str1+"<i>"+nn[k]+"<i>" ;
      }
    fs.readFile('welcome.html', 'utf8', function(err,html){
      if(err) throw err;  
      html=html.replace("<div id=\"wow\">",str1);
      res.send(html); });
    }
    if(inn==0){
      fs.readFile('new.html','utf8',function(err,html){
        if(err) throw err 
        html=html.replace("id=\"id1\">","id=\"id1\">INVALID CREDENTIALS"); 
        res.send(html);  
      });
    }
  });
});
