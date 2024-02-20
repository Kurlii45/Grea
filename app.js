const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser= require("body-parser");

mongoose.connect('mongodb://127.0.0.1:27017/knowbase');
let db = mongoose.connection;

// connection check
db.once('open',function(){
    console.log('connected to mongodb')
});

// error connection
db.on('error', function(err){
    console.log(err);
})

// init app
const app = express();

//Bring models

const Article= require('./models/article')

//load view modules
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//set static public path
// app.use(express.static(path.join(__dirname,'public')));

//home route
app.get('/', function(req, res){

    Article.find({},function(err, articles){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title:'Articles',
                articles:articles
            });
        }
    }) 
});

// add articles routes
app.get('/add', function(req,res){ 
    res.render('add',{
        title:'Add Article'
    });
});

// add post route
app.post('/add',function(req, res){
    let article= new Article();
    article.title=req.body.title;
    article.author=req.body.author;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            console.log(article)
            res.redirect("/");
        }
    })
})

// start server
app.listen(3000, function(){
    console.log("Server started on port 3000...");
});