var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users_service');

var http = require('http');
var socket = require('socket.io');


app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

var api = express.Router();

api.get('/users', (req, res) => {

    var User = require('./models/user');

    User.find({}, function(err, users) {
        if (err) throw err;
        res.json({data: users});
    });
})

app.use('/api', api);

var server = http.createServer(app).listen(63145, function(){
    console.log("Express server listening on port " + 63145);
});

var io = socket.listen(server);


io.on('connection', (socket) => {
    console.log('Application connected');

    socket.on('disconnect', function(){
        console.log('Application disconnected');
    });

    var User = require('./models/user');

    socket.on('sendUsers', (usersData) => {
        console.log('Application sent:');
        console.log(usersData);

        for (var i in usersData) {
        
            var cpf = usersData[i].cpf.trim() || null;
            var cnpj = usersData[i].cnpj.trim() || null;

            var newUser = new User({
                name: usersData[i].name,
                email: usersData[i].email,
                cpf: cpf,
                cnpj: cnpj,
                phoneNumber: usersData[i].phoneNumber
                });
        
            newUser.validateUniqueCpf(function(err, result) {
                if (err) throw err;
            });
        
            newUser.save(function(err) {
                if (err) throw err;
            
                console.log('User saved successfully!');
            });
        
            io.emit('import_result', {type:'new-user-import', data: usersData[i]});    
        }
  
    });
});
