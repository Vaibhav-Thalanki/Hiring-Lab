const express = require("express");
const app = express();
const path = require("path");
const assert = require("assert");
const mongoose = require("mongoose");
const profiles = require("./utils/profiles.js");
const bodyParser = require("body-parser");
const res = require("express/lib/response.js");
const port = process.env.PORT || 3000;
var data = null;
var message = null;
var emailsend = null;
var ID = 1;
var IDcontinue = 1;
var email;
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.post("/maincourse", (req, res) => {
  ID = req.body.courseID;
  res.redirect("/course1");
});

app.get("/", (req, res) => {
  res.render("index", {
    message,
  });
  message = null;
});
app.post("/", async (req, res) => {
  message = null;
  email = req.body.loginemail;
  console.log(req.body.form);
  var c = await check(req);
  console.log(c, "doneee");
  if (c == 1) res.redirect("/"); //signup
  else if (c == 2) {
    res.redirect("/profile"); //login
  } else if (c == 3) {
    res.redirect("/otp"); //otp
  }
});

app.get("/header", (req, res) => {
    console.log(req.body.name);
});

app.get("/otp", (req, res) => {
  res.render("otp", {
    emailsend,
  });
});

// TEST
app.get("/test", (req, res) => {
  res.render("test", {
    ID: IDcontinue,
  });
});

app.get("/landing", (req, res) => {
  res.render("landing");
});

// COURSE 1
app.get("/course1", (req, res) => {
  res.render("course1", {
    ID: ID,
    stylepath: "css/course1.css",
    path:"course1"
  });
});
app.post("/course1", (req, res) => {
  IDcontinue = req.body.testTake;
  res.redirect("/test");
});
app.post("/:custom/test", (req, res) => {


/*app.get('/profile/:start/:end', function (req, res) {
    console.log("Starting Page: ", req.params['start']);
    console.log("Ending Page: ", req.params['end']);
    res.send();
})*/

//Extract the path which is searching the name in header.js
app.post('/:path/search', function (req, res) {
    console.log("From path: ", req.params['path']);
    var a = '/'+req.params['path'];
    var name = req.body.name; //nameoftheaccount
    console.log(name);
    res.redirect(a);
})

  console.log(email);
  try {
    finalID = req.params.custom;
    result = req.body.testDone;
    score = req.body.testScore;
    console.log("score : ",score);
    console.log(email);
    if (result === "pass") {
      Login.findOne({ email_id: email }, (er, found) => {
        console.log(found);
        if(!found.courses)
        found.courses = [];
        var courseToBeAdded = "course" + String(finalID);
        var newcourse = eval(courseToBeAdded);
        newcourse.score = score;
        found.courses.push(newcourse);
        found.save();
    });
    }
  } catch (e) {
    console.log("error: ",e);
  }
  res.redirect("/profile");
});
// MAIN COURSE
app.get("/maincourse", (req, res) => {
  console.log(email);
  Course.find({}, (err, resp) => {
    if (resp.length === 0) {
      Course.insertMany([course1, course2, course3], () => {});
      res.redirect("/maincourse");
    } else {
      res.render("maincourse", {
        stylepath: "css/maincoursestyle.css",
        courses: resp,
        path:"maincourse"
      });
    }
  });
});

app.get("/chat", (req, res) => {
  res.render("chat", {
    stylepath: "css/chat.css",
    path:"chat"
  });
});
app.get("/home", (req, res) => {
  console.log(req.body.name11);
  res.render("home", {
    stylepath: "css/home.css",
    path:"home"
  });
});
app.post("/home", (req, res) => {
  console.log(req.body.name11);
  res.redirect("/home");
});

app.get("/profile", (req, res) => {
  console.log(data.courses[0].score);
  res.render("profile", {
    stylepath: "css/profileStyle.css",
    data: data,
    path:"profile"
  });
});

app.listen(port, () => {
  console.log("Server Started on port " + port);
});

var valacc = -1;
async function checkacc(email) {
  await Login.findOne(
    {
      email_id: email,
    },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Result : ", docs);
        if (docs == null) valacc = 0;
        else valacc = 1;
      }
    }
  ).clone();
}

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/HIRINGLAB");
}

const courseSchema = new mongoose.Schema({
  courseName: String,
  courseDesc: String,
  courseID: Number,
  courseImg: String,
  score: Number
});
const profileSchema=new mongoose.Schema({
  name: String,
  email_id:String,
  contactInfo: String,
  address: String,
  experience: String,
  education: String,
  skills: String
});
const Profile = mongoose.model('Profile', profileSchema);
const LoginSchema = new mongoose.Schema({
  user_id: Number,
  email_id: String,
  password: String,
  name: String,
  courses: [courseSchema],
  profile:profileSchema
});
// const userSchema = new mongoose.Schema({
//   username: String,
// email: String,
// password: String,
// name
// courses
// connected
// posts
// });
const Course = mongoose.model("courses", courseSchema);
const Login = mongoose.model("Login", LoginSchema);
const course1 = new Course({
  courseName: "Basics of HTML",
  courseDesc:
    "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.",
  courseID: 1,
  courseImg:
    "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2018/11/what-is-html-3.jpg",
});
const course2 = new Course({
  courseName: "Understanding javascript",
  courseDesc:
    "JavaScript, often abbreviated JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
  courseID: 2,
  courseImg: "https://www.barrownz.com/images/design/javascript.jpg",
});
const course3 = new Course({
  courseName: "Basics of CSS",
  courseDesc:
    "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.",
  courseID: 3,
  courseImg: "https://blog.logrocket.com/wp-content/uploads/2020/06/CSS-3.png",
});

app.post('/profile', (req,res) =>{
  console.log(req.body.uname,email,req.body.cinfo,req.body.add,req.body.exp,req.body.edu,req.body.skill);
  /*function(err, result) {
    console.log(result);
    if(result == null){
      const profile = new Profile({
        name: req.body.uname,
        contactInfo: req.body.cinfo,
        address: req.body.add,
        email_id: email,
        experience: req.body.exp,
        education: req.body.edu,
        skills: req.body.skill
      });
      profile.save();
    }

  }*/
  Profile.findOne({email_id: email},function(err, result) {
    console.log(result);
    if(result == null){
      const profile = new Profile({
        name: req.body.uname,
        contactInfo: req.body.cinfo,
        address: req.body.add,
        email_id: email,
        experience: req.body.exp,
        education: req.body.edu,
        skills: req.body.skill
      });
      profile.save();
      Login.findOneAndUpdate({email_id:email},{$set: { profile: profile } },{new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!",err);
    }

    console.log(doc);
});
    }
    else{
      const profile = new Profile({
        name: req.body.uname,
        contactInfo: req.body.cinfo,
        address: req.body.add,
        email_id: email,
        experience: req.body.exp,
        education: req.body.edu,
        skills: req.body.skill
      });
      console.log("haha",data.email_id,email);
      Profile.findOneAndUpdate(
      { email_id: email },
      {name: req.body.uname,
        email_id: data.email_id,
      contactInfo: req.body.cinfo,
      address: req.body.add,
      experience: req.body.exp,
      education: req.body.edu,
      skills: req.body.skill}, {new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!",err);
    }

    console.log(doc);
}
    );
    Login.findOneAndUpdate({email_id:email},{$set: { profile: profile } },{new: true}, (err, doc) => {
  if (err) {
      console.log("Something wrong when updating data!",err);
  }

  console.log(doc);
});


    }
  }
);
    res.redirect("/profile");
});

var c = 0; //find the count of datas present
var query = Login.find();
query.count(function (err, count) {
  if (err) console.log(err);
  else c = count;
});

const check = async (req) => {
  //console.log(req.body.form);
  if (req.body.form === "Join") {
    email = req.body.email;
    emailsend = email;
    var pass = req.body.password;
    var uid = c + 1;
    await checkacc(email);
    if (req.body.password != req.body.passwordRepeat) {
      message = "Passwords don't match...";
      return 1;
    } else if (req.body.password.length < 2) {
      message = "Password too short";
      return 1;
    } else {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (!specialChars.test(req.body.password)) {
        message = "Password must atleast contain one special character";
        return 1;
      } else {
        console.log(valacc);
        if (valacc == 0) {
          const data = new Login({
            user_id: uid,
            email_id: email,
            password: pass,
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
    email = req.body.loginemail;
    const password = req.body.loginpassword; //destructuring the req object to get the email and password
    var response = await Login.findOne({
      email_id: email,
    }); //to find whether a user already exist
    if (!response) {
      //req.flash("message", "User doesnt exist..Please Sign Up");
      //res.redirect("/");
      console.log("Not Success");
      message = "Account doesn't exists";
      return 1;
    } else {
      console.log("brruhhx2");
      email =  req.body.loginemail;
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
