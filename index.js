const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const cors = require('cors');
const app = express()
const port = 3000;

app.use(cors());
app.use(express.json());



let user = [];


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

//funktioniert
app.post('/login', function (req,res){
    let username = req.body.username;
    let password = req.body.password;

    for(const element of user){
        if(username == element.username && password == element.password){
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(404);

    
})

app.get('/getAllUsers', function (req,res){
 res.send(user).sendStatus(200);
})



//funktioniert
/*
app.get('/', function (req, res) {
  res.send(personen)
})
*/

/*
//funktioniert
app.get('/:id', function (req,res){
    
    let personenid = req.params.id;

    for(let i = 0;personen.length;i++){
        if(personen[i].id == personenid){
            res.send(personen[i]);
        }
    }
    
    
})
*/

//Funktioniert
/*app.delete('/:id', function (req,res){
    let personenid = req.params.id;

    for(let i = 0;personen.length;i++){
        if(personen[i].id == personenid){
            res.send("Benutzer: " + personen[i].name +" wurde gelöscht!");
            personen.splice(i,1);            
        }
    }
})
*/





/*
//funktioniert
app.put('/:id', function (req,res){
    
    let personenid = req.body.id;
    let personenname = req.body.name;
    let counter = 0;
    

    for(let i = 0;personen.length;i++){
        if(personen[i].id == personenid){
           personen[i].name = personenname;
           res.status(200).send("Update wurde durchgeführt!")
        } else{
            counter++;           
        } 
        if(counter == personen.length){
            personen.push({
                id: personenid,
                name: personenname
            })
            res.status(200).send("Benutzer wurde erstellt!");
        }        
    }
})
*/



/*
//funktioniert
app.patch('/:id', function(req,res){
    let entwurf = req.url;

    let personenid = entwurf.substring(1);
    let personenname = req.body.name;
    //console.log(personenid);

    for(let i = 0;personen.length;i++){
        if(personen[i].id == personenid){
            personen[i].name = personenname;
            res.send("Benutzer wurde durch PATCH updated!")
        }
    }

})
*/


app.listen(port)