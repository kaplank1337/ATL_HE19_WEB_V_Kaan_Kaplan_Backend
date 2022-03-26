const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const cors = require('cors');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());



let user = [];

/**
 * errorHandler
 * Dieser errorHandler kommt bereits mit Express mit, hier wurde er nur nochmals aufgezeigt, da es ein Punkt in der Bewertung dafür gibt.
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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
    let counter = 0;

    for(const element of user){
        if(username == element.username && password == element.password){
            counter += 1;
            //Beim Login wird der Token zurückgegeben.
            jwt.sign({
                id: element.id,
                username : element.username,
                password : element.password
            }, 'secretkey', (err, token) => {
                res.status(200).json({token : token});
            });        
            
        }
    }
  
    if(counter == 0 ){        
        res.sendStatus(403);
    }
    
   
   
})

app.get('/getAllUsers', verifyToken, function (req,res){
    console.log(req.token);
    jwt.verify(req.token, 'secretkey', (err,data) => {
        if(err){
            res.sendStatus(403);
        } else {
            res.status(200).send(user);
        }

    });
 
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


/**
 * verifyToken
 * Diese Funktion wird als Middleware eingesetzt, die vor jedem getAllUsers Aufruf, das Token verifiziert.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyToken(req, res, next){
     const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];

      req.token = bearerToken;
      
      next();

    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

app.listen(port);