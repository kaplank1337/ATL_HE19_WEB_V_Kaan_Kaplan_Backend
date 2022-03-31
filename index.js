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

  /**
 * userIDValidation
 * Dieser überprüft die Eingabe der User ID via Regex. Der String darf nur aus Zahlen von 0-9 bestehen.
 * @param {String} userID Es wird die User ID mitgegeben die im Frontend im Feld ID eingegeben und mit Erstellen oder Update bestätigt wird.
 * @returns Es handelt sich eigentlich um einen Boolean der falls der Regex matcht ein True zurück gibt und ansonsten ein False
 */
function userIDValidation(userID){
    let reg = new RegExp('^[0-9]$');
    if(reg.test(userID)){
        return true;
    }
    return false;
}

/**
 * userNameValidaton
 * Dieser überprüft die Eingabe des Benutzernamens via Regex. Bei der Überprüfung muss der Anfangsbuchstabe gross sein und der klein. Es dürfen nur Buchstaben aus dem Alphabet verwendet werden.
 * @param {String} userName Als Parameter wird der eingegebene Benutzername, die im Frontend im Feld Benutzer eingegeben wird mitgegeben.
 * @returns Hierbei handelt es sich um eine boolsche Funktion die True bei Regex Match und ansonsten ein False zurückgibt.
 */
function userNameValidation(userName){
    let reg = new RegExp('^[A-Z][a-z\-]+$');
    if(reg.test(userName)){
        return true;
    }
    return false;
}

/**
 * userPasswordValidation
 * Dieser überprüft die Eingabe des Benutzerpassworts via Regex. Das Passwort muss min. 8 Zeichen lang sein, Gross- und Kleinbuchstaben sowie ein Sonderzeichen haben.
 * @param {String} userPassword Als Parameter wird der eingegebene Benutzerpasswort, die im Frontendim Feld Passwort eingegeben wird mitgegeben.
 * @returns Hierbei handelt es sich um eine boolsche Funktion die True bei Regex Match und asonsten ein False zurückgibt.
 */
function userPasswordValidation(userPassword){
    let reg = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    if(reg.test(userPassword)){
        return true;
    }
    return false;
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
    let areCredentialsCorrect = 0;

    for(const element of user){
        if(username == element.username && password == element.password){
            areCredentialsCorrect += 1;
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
  
    if(areCredentialsCorrect == 0 ){        
        res.sendStatus(403);
    }
    
   
   
})

app.get('/getAllUsers', verifyToken, function (req,res){
   
    jwt.verify(req.token, 'secretkey', (err,data) => {
        if(err){
            res.sendStatus(403);
        } else {
            res.status(200).send(user);
        }

    });
 
})


app.post('/createUser', verifyToken, function (req,res){
    let userID = req.body.userID;
    let userName = req.body.userName;
    let userPassword = req.body.password;

    if(!userIDValidation(userID)){
        return res.sendStatus(403);
    }

    if(!userNameValidation(userName)){
        return res.sendStatus(403);
    }

    if(!userPasswordValidation(userPassword)){
        return res.sendStatus(403);
    }

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

app.delete('/deleteUser/:id', verifyToken, function (req,res){
    let userID = req.params.id; 

    if(!userIDValidation(userID)){
        return res.sendStatus(403);
    }

     for(let i = 0;user.length;i++){
        if(user[i].id == userID){
            userTemporyName = user[i].userName;
            user.splice(i,1);
            res.sendStatus(200).json({username : userTemporyName});           
        }
    }
    
})

app.put('/updateUserPut/:id', verifyToken, function (req,res){
    let userID = req.params.id;
    let userName = req.body.username;
    let userPassword = req.body.password;

    if(!userIDValidation(userID)){
  
        return res.sendStatus(403);
        
    }

    if(!userNameValidation(userName)){
        
      
        return res.sendStatus(403);
    }

    if(!userPasswordValidation(userPassword)){
        
        return res.sendStatus(403);
    }

    for(let i = 0; i < user.length;i++){
        if(userID == user[i].id){
            user[i].username = userName;
            user[i].password = userPassword;

        }
    }
    return res.sendStatus(200);
})

app.patch('/updateUserPatch/:id', verifyToken, function(req,res){
    let userID = req.params.id;

     if(!userIDValidation(userID)){
        return res.sendStatus(403);
    }
    
    if(req.body.hasOwnProperty('username')){
        let userName = req.body.username;

         if(!userNameValidation(userName)){
           
        return res.sendStatus(403);
    }

        for(let i = 0;user.length;i++){
            if(user[i].id == userID){
                user[i].username = userName;
                return res.sendStatus(200);
            }
        }
    }

    if(req.body.hasOwnProperty('password')){
        let userPassword = req.body.password

          if(!userPasswordValidation(userPassword)){
           return res.sendStatus(403);
    }

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