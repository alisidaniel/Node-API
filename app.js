var express = require('express');

var todoController = require('./controllers/todoController');

var app = express();


//Set up templete engine
app.set('view engine', 'ejs');


//Static files
app.use(express.static('./public'));


//fire controller
todoController(app);

//Listen to port
app.listen(3000);
console.log('You are listening to port 3000');