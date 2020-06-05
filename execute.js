const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const fs = require('fs');
 
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/register', function (req, res) {
    res.send('Registering....')

    let filename = 'register.sh';
    let content = 'prosodyctl register '+ req.body.username +' ' + req.body.email +' ' + req.body.password;
    fs.writeFile(filename, content, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    }); 

    const exec = require('child_process').exec;
    const myShellScript = exec("sh " +  filename);

    myShellScript.stdout.on('data', (data)=>{
        console.log(data); 
        // do whatever you want here with data
        fs.unlink(filename, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        }); 
    });
    myShellScript.stderr.on('data', (data)=>{
        console.error(data);
        fs.unlink(filename, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        }); 
    });

})
 
app.listen(3000)