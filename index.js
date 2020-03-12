var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var mysql =require('mysql');
const SHA256 = require('crypto-js/sha256'); 
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
var prid1="";
var htmlnow="";
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "jishnu"
  //Create a table customers in jishnu with varchar name and varchar address
});
function psntid(prid,htmlz){
   prid1=prid;
   htmlnow=htmlz;
   return prid;
}
class Block{
  constructor(index,timestamp ,data , previousHash= '')
  {
      this.index=index;
      this.timestamp = timestamp;
      this.data=data;
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
   
  }
  calculateHash()
  {
      return SHA256(this.index + this.previousHash +  this.timestamp + JSON.stringify(this.data)).toString();
  }
}
class Blockchain
{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
     createGenesisBlock(){
        return new Block(0,"01/01/2017","Genesis Block","0");
     }
     getLatestBlock(){
       return this.chain[this.chain.length - 1]; 
     }  
     addBlock(newBlock){
         newBlock.previousHash=this.getLatestBlock().hash;
         newBlock.hash=newBlock.calculateHash();
         this.chain.push(newBlock);
     }
    
}
let  jis = new Blockchain();
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Sql login is listening at localhost:",port)

});

app.get('/ensure',function(req,res){
  var k=JSON.stringify(jis,null,4);
  var obj=JSON.parse(k);var i,j;
  var len1=(obj.chain).length;
  function fun1(x,y,z)
  {
      ins(x,y,z);
  }
  con.query("SELECT name,v FROM vote", function (err, result,fields ) {
    var safe=1,restart=1,datapresent=1;
    if((obj.chain).length<2 && result.length<1)
        datapresent=0
    for(i=0;i<result.length;i++)
        {  
          for(j=0;j<len1-1;j++)
          {     
              if((obj.chain)[j+1].data == result[i].name)
              {   restart=0;
                  if(obj.chain[j+1].index != result[i].v)
                  {
                    safe=0;
                    break;
                  }
              }
          }
          if(safe==0) break;
  
        }
        fun1(safe,restart,datapresent);
      });
      function ins(q1,q2,q3){
        if(q3==0){
          fs.readFile('new.html', 'utf8', function(err,html){
          html=html.replace("<p id=\"alrt\">.","<p style=\"color:darkblue;\" id=\"alrt1\"><b>NO VOTES POLLED</b>");
          res.send(html); });
        }
        else if(q1==1 && q2==0){
          fs.readFile('new.html', 'utf8', function(err,html){
          html=html.replace("<p id=\"alrt\">.","<p style=\"color:green;\" id=\"alrt1\"><b>THE DATA IS INTACT</b>");
          res.send(html); });
        }
        else if(q2==1){
          fs.readFile('new.html', 'utf8', function(err,html){
          html=html.replace("<p id=\"alrt\">.","<p id=\"alrt1\"><b>PLEASE RESET THE DATA AND RESTART SERVER</b>");
          res.send(html); });
        }
        else{
          fs.readFile('new.html', 'utf8', function(err,html){
          html=html.replace("<p id=\"alrt\">.","<p id=\"alrt1\"><b>ALERT !! THE DATA IS TAMPERED</b>");
          res.send(html); });
        }
      }

});
app.get('/', function (req, res) {
  var html='';
  fs.readFile('new.html', 'utf8', function(err,html){
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
app.post('/vote',urlencodedParser,function(req,res){
var nn="";nn=req.body.name;var inn=0;
var sql = "INSERT INTO vote (name, v) VALUES ('x1', x2)";
sql=sql.replace("x1",prid1);sql=sql.replace("x2",nn);
function verify(x){
  ins(x);
 }
con.query("SELECT name,v FROM vote", function (err, result,fields ) {
  var lock=0;
  for(i=0;i<result.length;i++)
  {   
      if(prid1==result[i].name)
       { 
          lock=1;
          break;
       }

  }
  verify(lock);
});
function ins(ax){
  if(ax==0){
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("vote inserted");
    });
    jis.addBlock(new Block(nn,"10/5/1999",prid1));
   // jis.addBlock(new Block(2,"11/5/2099",{amount:5}));
      htmla=htmlnow.replace("<p id=\"idx\" style=\"color: greenyellow;\">.","<p id=\"idx\">VOTED SUCCESSSFULLY");
      res.send(htmla);
  }
  else{
      htmla=htmlnow.replace("<p id=\"idx\" style=\"color: greenyellow;\">.","<p id=\"idx\">ALREADY VOTED");
      res.send(htmla); }
}
});


app.post('/thank', urlencodedParser, function (req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  var nn="";var np="";var ns="";
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
    if(inn==1){
      fs.readFile('welcome.html', 'utf8', function(err,html){
      if(err) throw err;  
      html=html.replace("<div id=\"wow\">",str1);
      var z1=psntid(nn,html);
      res.send(html); });
    }
    if(inn==0 ){
      fs.readFile('new.html','utf8',function(err,html){
        if(err) throw err 
        html=html.replace("id=\"id1\">","id=\"id1\">INVALID CREDENTIALS"); 
        res.send(html);  
      });
    }
  });
});
