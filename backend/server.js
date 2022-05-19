const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/checkAccount', (req,res)=>{
    var userData = fs.readFileSync('./data/data.json');
    userData = JSON.parse(userData);

    if(userData[req.query.mail]?.pass == req.query.pass){
        res.send("ok");
        return;
    }
    res.send("שם משתמש או סיסמה לא נכון");
})

app.post('/createAccount', (req,res)=>{
    if(!req.body.mail || !req.body.pass) {res.send('בעיה בשרת'); return} 
    var userData = fs.readFileSync('./data/data.json');
    userData = JSON.parse(userData);
    if(userData[req.body.mail]) {res.send("קיים כבר משתמש עם מייל זה"); return}

    userData[req.body.mail] = {pass:req.body.pass, history:[]};
    
    fs.writeFileSync('./data/data.json',JSON.stringify(userData,null,2));

    res.send("ok");
})

app.get('/getAccountData', (req,res)=>{
    if(!req.query.mail || !req.query.pass) {res.sendStatus(400); return} 
    var userData = fs.readFileSync('./data/data.json');
    userData = JSON.parse(userData);
    if(userData[req.query.mail]?.pass != req.query.pass) {res.sendStatus(400); return} 

    res.json(userData[req.query.mail]);
})

app.post('/createAccountData', (req,res)=>{
    if(!req.body.mail || !req.body.pass || req.body.cost === undefined || !req.body.profit === undefined){res.sendStatus(400);return};
    var userData = fs.readFileSync('./data/data.json');
    userData = JSON.parse(userData);
    if(userData[req.body.mail]?.pass != req.body.pass) {res.sendStatus(400); return} 

    userData[req.body.mail].history.push({cost:req.body.cost, profit:req.body.profit});
    
    fs.writeFileSync('./data/data.json', JSON.stringify(userData,null,2));
    
    res.sendStatus(200);
})

app.listen(3000);