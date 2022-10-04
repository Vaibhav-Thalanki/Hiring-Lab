const express = require("express");
const app = express();
const path = require("path");
const profiles = require("./utils/profiles.js");
const bodyParser = require("body-parser");
const res = require("express/lib/response.js");
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
var message = null;
app.get("/", (req, res) => {
  res.render("index", {
    message,
  });
  message = null;
});
app.get("/landing", (req, res) => {
  res.render("landing");
});
app.get("/course1", (req, res) => {
  res.render("course1");
});
app.get("/maincourse", (req, res) => {
  res.render("maincourse");
});
app.get("/chat", (req, res) => {
  res.render("chat");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/profile", (req, res) => {
  res.render("profile");
});
app.post("/", (req, res) => {
  message = null;
  var c = check(req);
  if (c == 1) res.redirect("/"); //signup
  else if (c == 2) {
    res.redirect("/profile"); //login
  }
});
app.listen(port, () => {
  console.log("Server Started on port " + port);
});
const check = (req) => {
  if (req.body.form === "Join") {
    if (req.body.password != req.body.passwordRepeat) {
      message = "Passwords don't match...";
    } else if (req.body.password.length < 8) {
      message = "Password too short";
    } else {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;  
      if (!specialChars.test(req.body.password)) {
        message = "Password must atleast contain one special character";
      } else {
        const added = profiles.addProfiles(req.body.email, req.body.password);
        if (added === 1) {
          message = "Succesfully Added";
        } else {
          message = "Profile Already Exists...";
        }
      }
    }
    return 1;
  } else if (req.body.form === "Login") {
    const login = profiles.login(req.body.email, req.body.password);
    if (login === 0) {
      message = "Invalid Credentials";
      return 1;
    } else {
      message = "Login Succesful";
    }
    return 2;
  }
};
