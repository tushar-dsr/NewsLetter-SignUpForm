const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { send } = require("process");

const port = process.env.PORT ;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port || 3000, function () {
  console.log("Running on 3000!");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.post("/", function (req, res) {
  const firstName = req.body.FName;
  const lastName = req.body.LName;
  const email = req.body.Email;

  const data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ],
  };
  const jsonData = JSON.stringify(data);

  const url= "https://us6.api.mailchimp.com/3.0/lists/ ListID ?skip_merge_validation=true&skip_duplicate_check=true"

  const options = {
      method : "POST",
      auth: "tushar: API-Key "
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname +"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
  })
  request.write(jsonData);
  request.end();
});

//API Key: Check from the local database on PC
// List ID: Check from the local database on PC
