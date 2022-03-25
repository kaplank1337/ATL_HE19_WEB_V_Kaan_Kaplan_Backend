const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const cors = require('cors');
const app = express()
const port = 3000;

app.use(cors());
app.use(express.json());



let user = [];

//Error 500
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500);
    res.render('error', { error: err });
  }

user.push({   
        id: 1, 
        username: "Kaan",
        password: "Kaan"
})

user.push({    
    id: 2,
    username: "Test",
    password: "Test"
})


app.post('/login', function (req,res){
    let username = req.body.username;
    let password = req.body.password;

    for(const element of user){
        if(username == element.username && password == element.password){
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);    
})

app.get('/getAllUsers', function (req,res){
 res.status(200).send(user);
})


app.post('/createUser', function (req,res){
    let userID = req.body.userID;
    let userName = req.body.userName;
    let userPassword = req.body.password;

    for(let element of user){
        if(userID == element.id || userName == element.username){
            validationIfUserExist = 1;
            return res.sendStatus(403)    
        }
    }

    user.push({
        id: userID,
        username: userName,
        password: userPassword
    })
    
    res.sendStatus(200);
    
})

app.delete('/deleteUser/:id', function (req,res){
    let userID = req.params.id; 

     for(let i = 0;user.length;i++){
        if(user[i].id == userID){
            res.send("Benutzer: " + user[i].name +" wurde gelöscht!");
            user.splice(i,1);
            return res.sendStatus(200);           
        }
    }
})

app.put('/updateUserPut/:id', function (req,res){
    let userID = req.params.id;
    let userName = req.body.username;
    let userPassword = req.body.password;

    for(let i = 0; i < user.length;i++){
        if(userID == user[i].id){
            user[i].username = userName;
            user[i].password = userPassword;

        }
    }
    return res.sendStatus(200);
})

app.patch('/updateUserPatch/:id', function(req,res){
    let userID = req.params.id;
    
    if(req.body.hasOwnProperty('username')){
        let userName = req.body.username;

        for(let i = 0;user.length;i++){
            if(user[i].id == userID){
                user[i].username = userName;
                return res.sendStatus(200);
            }
        }
    }

    if(req.body.hasOwnProperty('password')){
        let userPassword = req.body.password

        for(let i = 0;user.length;i++){
            if(user[i].id == userID){
                user[i].password = userPassword;
                return res.sendStatus(200);
            }
        }
    }    
})



app.listen(port)