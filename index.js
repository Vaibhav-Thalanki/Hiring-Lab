const express = require("express");
const app = express();
const profiles = require("./utils/profiles.js");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var message = null;
app.get("/", (req, res) => {
  res.render("index", {
    message,
  });
  message = null;
});
app.post("/", (req, res) => {
  message = null;
  var c = check(req);
  if (c == 1) res.redirect("/"); //signup
  else if (c == 2) {
    res.render("profilePage"); //login
  }
});
app.listen(port, () => {
  console.log("Server Started on port " + port);
});
const check = (req) => {
  if (req.body.form === "Join") {
    if (req.body.password != req.body.passwordRepeat) {
      message = "Passwords don't match...";
    } else {
      const added = profiles.addProfiles(req.body.email, req.body.password);
      if (added === 1) {
        message = "Succesfully Added";
      } else {
        message = "Profile Already Exists...";
      }
    }
    return 1;
  } else if (req.body.form === "Login") {
    const login = profiles.login(req.body.email,req.body.password);
    if(login===0){
      message = "Invalid Credentials";
      return 1;
    }
    else{
      message = "Login Succesful";
    }
    return 2;
  }
};
