const express = require("express");
const app = express();
const path = require("path");
const assert = require('assert')
const mongoose = require('mongoose');
const profiles = require("./utils/profiles.js");
const bodyParser = require("body-parser");
const res = require("express/lib/response.js");
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
var message = null;
app.get("/", (req, res) => {
  res.render("index", {
    message,
  });
  message = null;
});

var emailsend = "mom";
app.get("/otp", (req, res) => {
  res.render("otp", {
    emailsend,
  });
});
app.get("/test", (req, res) => {
  res.render("test");
});
app.get("/landing", (req, res) => {
  res.render("landing");
});
app.get("/course1", (req, res) => {
  res.render("course1", {
    stylepath: "css/course1.css"
  });
});
app.get("/maincourse", (req, res) => {
  res.render("maincourse", {
    stylepath: "css/maincoursestyle.css"
  });
});
app.get("/chat", (req, res) => {
  res.render("chat", {
    stylepath: "css/chat.css"
  });
});
app.get("/home", (req, res) => {
  res.render("home", {
    stylepath: "css/home.css"
  });
});
var data = null;
app.get("/profile", (req, res) => {
  res.render("profile", {
    stylepath: "css/profileStyle.css",
    data: data,
  });
});
app.post("/", async (req, res) => {
  message = null;
  var c = await check(req);
  console.log(c, "doneee");
  if (c == 1) res.redirect("/"); //signup
  else if (c == 2) {
    res.redirect("/profile"); //login
  } else if (c == 3) {
    res.redirect("/otp"); //otp
  }
});
app.listen(port, () => {
  console.log("Server Started on port " + port);
});

var valacc = -1;
async function checkacc(email) {
  await Login.findOne({
    email_id: email
  }, function(err, docs) {
    if (err) {
      console.log(err)
    } else {
      console.log("Result : ", docs);
      if (docs == null)
        valacc = 0;
      else
        valacc = 1;
    }

  }).clone();
}

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/HIRINGLAB');
}
const LoginSchema = new mongoose.Schema({
  user_id: Number,
  email_id: String,
  password: String
});

const Login = mongoose.model('Login', LoginSchema);

var c = 0; //find the count of datas present
var query = Login.find();
query.count(function(err, count) {
  if (err) console.log(err)
  else c = count
});


const check = async (req) => {
  if (req.body.form === "Join") {

    var email = req.body.email;
    emailsend = email;
    var pass = req.body.password;
    var uid = c + 1;
    await checkacc(email);
    if (req.body.password != req.body.passwordRepeat) {
      message = "Passwords don't match...";
      return 1;
    } else if (req.body.password.length < 2) {
      message = "Password too short";
    } else {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (!specialChars.test(req.body.password)) {
        message = "Password must atleast contain one special character";
      } else {
        console.log(valacc);
        if (valacc == 0) {
          const data = new Login({
            user_id: uid,
            email_id: email,
            password: pass
          });
          data.save();
          message = "Account Succesfully added";
          valacc = -1;
          return 3;
          emailsend = email;
          //res.render("index",{message:message});
        } else {
          message = "Account already exists";
          valacc = -1;
          return 1;
        }
      }
    }
  } else if (req.body.form === "Login") {
    const email = req.body.loginemail;
    const password = req.body.loginpassword; //destructuring the req object to get the email and password
    var response = await Login.findOne({
      email_id: email
    }); //to find whether a user already exist
    if (!response) {
      //req.flash("message", "User doesnt exist..Please Sign Up");
      //res.redirect("/");
      console.log("Not Success");
      message = "Account doesn't exists";
      return 1;
    } else {
      console.log(response);
      if (response.password === password) {
        data = response;
        console.log("Success");
        return 2;
      } else {
        message = "Invalid Login Credentials";
        console.log("Not Success");
        return 1;
      }
    }
    /*const login = profiles.login(req.body.email, req.body.password);
    if (login === 0) {
  }
};      message = "Invalid Credentials";
      return 1;
    } else {
      message = "Login Succesful";
    }
    return 2;*/
  }
};
