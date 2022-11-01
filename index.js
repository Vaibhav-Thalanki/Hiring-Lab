// loading all imports
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const fs = require("fs");
const multer = require("multer"); // for image file upload
const bodyParser = require("body-parser");
// session storage
const sessionstorage = require("node-sessionstorage");
const session = require("express-session");
var urlencodedParaser = bodyParser.urlencoded({ extended: true });
app.use(
  session({
    secret: "Your_Secret_Key",
    resave: true,
    saveUninitialized: true,
  })
);
const router = express.Router();
var curr_user = "xxxx";

const port = process.env.PORT || 3000;
var data = null;
var pdata = null;
var message = null;
var emailsend = null;
var ID = 1;
var IDcontinue = 1;
var email;

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//PROFILE PICTURE
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

//STARTING SERVER
app.listen(port, () => {
  console.log("Server Started on port " + port);
});

//DATABASE CONNECTION
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/HIRINGLAB");
}

//SCHEMAS
const userSchema = new mongoose.Schema({
  name: String,
  post: [String],
  connected_users: [String],
});

const courseSchema = new mongoose.Schema({
  courseName: String,
  courseDesc: String,
  courseID: Number,
  courseImg: String,
  score: Number,
});

const postSchema = new mongoose.Schema(
  {
    email_id: String,
    post: String,
    likes: Number,
    peopleliked: [String],
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    key: String,
    user1: String,
    user2: String,
    message: String,
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema({
  name: String,
  email_id: String,
  about: String,
  contactInfo: String,
  address: String,
  experience: String,
  education: String,
  skills: String,
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
});
const Post = mongoose.model("Post", postSchema);
const Profile = mongoose.model("Profile", profileSchema);
const LoginSchema = new mongoose.Schema({
  user_id: Number,
  email_id: String,
  password: String,
  name: String,
  courses: [courseSchema],
  profile: profileSchema,
  connected: [String],
  posts: [postSchema],
});

//MAIL CONFIGURE
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "naghaakshayaa@gmail.com",
    pass: "uflsagkwnxigmrsa",
  },
});

//WELCOME PAGE
app.get("/", (req, res) => {
  res.render("index", {
    message,
    data,
  });
  message = null;
});
app.post("/", async (req, res) => {
  message = null;
  var c = await check(req);

  if (c == 1) res.redirect("/"); //signup
  else if (c == 2) {
    res.redirect("/profile"); //login
  } else if (c == 3) {
    res.redirect("/otp"); //otp for signup
  }
});

//OTP
app.get("/otp", (req, res) => {
  res.render("otp", {
    emailsend,
  });
});

//LANDING
app.get("/landing", (req, res) => {
  res.render("landing");
});

var nametosearch = null;
var SearchPersonData = null;

//Extract the path which is searching the name in header.js
app.post("/:path/search", function (req, res) {
  console.log("From path: ", req.params.path);
  var a = "/" + req.params.path;
  nametosearch = req.body.name; //nameoftheaccount
  console.log(nametosearch);

  Profile.findOne({ name: nametosearch }, function (err, result) {
    //console.log(result);
    if (result == null) {
      console.log("No record found");
      res.redirect(a);
    } else {
      SearchPersonData = result;
      res.redirect("/profilePage");
    }
  });
});

// TEST
app.get("/test", (req, res) => {
  res.render("test", {
    ID: IDcontinue,
  });
});
app.post("/:custom/test", (req, res) => {
  console.log(email);
  try {
    finalID = req.params.custom;
    result = req.body.testDone;
    score = req.body.testScore;
    console.log("score : ", score);
    console.log(email);
    if (result === "pass") {
      Login.findOne({ email_id: email }, (er, found) => {
        if (!found.courses) found.courses = [];
        var courseToBeAdded = "course" + String(finalID);
        var newcourse = eval(courseToBeAdded);
        newcourse.score = score;
        found.courses.push(newcourse);
        data.courses.push(newcourse);
        found.save();
      });
    }
  } catch (e) {
    console.log("error: ", e);
  }
  res.redirect("/profile");
});

// COURSE 1
app.get("/course1", (req, res) => {
  res.render("course1", {
    ID: ID,
    stylepath: "css/course1.css",
    path: "course1",
    data,
    pdata,
  });
});
app.post("/course1", (req, res) => {
  IDcontinue = req.body.testTake;
  res.redirect("/test");
});

// MAIN COURSE
app.post("/maincourse", (req, res) => {
  ID = req.body.courseID;
  res.redirect("/course1");
});

app.get("/maincourse", (req, res) => {
  Course.find({}, (err, resp) => {
    if (resp.length === 0) {
      Course.insertMany([course1, course2, course3], () => {});
      res.redirect("/maincourse");
    } else {
      res.render("maincourse", {
        stylepath: "css/maincoursestyle.css",
        courses: resp,
        path: "maincourse",
        data,
        pdata,
      });
    }
  });
});

//ADDING COURSES
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

var posts = [];
async function getpostdata(element) {
  var c = 0;
  //db.posts.find({email_id:{$in:['a@11','a@1']}})
  await Post.findOne({ email_id: element }, (err, prof) => {
    if (prof.posts[0] != "") {
      prof.posts.forEach((p) => {
        posts[c] = p;
        c = c + 1;
      });
    }
  }).clone();
  return true;
}
//HOME

app.get("/home", async (req, res) => {
  var feeds = [];

  // RECOMMEND FEEDS BASED ON CREATION DATE
  Post.find({ email_id: { $in: data.connected } })
    .sort({ createdAt: -1 })
    .exec(function (err, feed) {
      feeds = feed;
      alldatas = [];
      Profile.find((err, response) => {
        alldatas = response;
        var name = req.session.name;
        res.render("home", {
          stylepath: "css/home.css",
          path: "home",
          data,
          feed: feeds,
          alldata: alldatas,
          name,
          pdata,
        });
      });
    });
});

app.post("/home", (req, res) => {
  res.redirect("/home");
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
        if (docs == null) valacc = 0;
        else valacc = 1;
      }
    }
  ).clone();
}
//SHOW PROFILE
app.get("/profilePage", (req, res) => {
  Login.findOne({ email_id: email }, (er, found) => {
    Profile.findOne({ email_id: SearchPersonData.email_id }, (err, found2) => {
      if (JSON.stringify(found2.profilePicture) === "{}") {
        res.render("profilePage", {
          stylepath: "css/profileStyle.css",
          data2: SearchPersonData,
          path: "profile",
          connectedAlreadyCheck: found.connected,
          data,
          image: null,
          pdata,
        });
      } else {
        res.render("profilePage", {
          stylepath: "css/profileStyle.css",
          data2: SearchPersonData,
          path: "profile",
          connectedAlreadyCheck: found.connected,
          data,
          image: found2.profilePicture,
          pdata,
        });
      }
    });
  });
});
app.post("/profilePage", (req, res) => {
  Login.findOne({ email_id: email }, (er, found) => {
    found.connected.push(req.body.connectperson);
    found.save();
    data = found;
  });
  res.redirect("/profilePage");
});

//PROFILE
app.get("/profile", (req, res) => {
  curr_user = data.email_id;
  Profile.findOne({ email_id: email }, (err, element) => {
    if (element == null) {
      req.session.name = "Username";
      res.render("profile", {
        stylepath: "css/profileStyle.css",
        data: data,
        path: "profile",
        image: null,
        pdata,
      });
    } else {
      req.session.name = element.name;
      if (
        element.profilePicture === {} ||
        JSON.stringify(element.profilePicture) === "{}" ||
        element.profilePicture === null
      ) {
        res.render("profile", {
          stylepath: "css/profileStyle.css",
          data: data,
          path: "profile",
          image: null,
          pdata,
        });
      } else {
        res.render("profile", {
          stylepath: "css/profileStyle.css",
          data: data,
          path: "profile",
          image: element.profilePicture,
          pdata,
        });
      }
    }
  });
});
app.get("/session", function (req, res) {
  var name = req.session.name;
  return res.send(name);
  /*  To destroy session you can use
      this function
   req.session.destroy(function(error){
      console.log("Session Destroyed")
  })
  */
});

app.post("/profile", upload.single("image"), (req, res, next) => {

  req.session.name = req.body.uname;
  data.profile.name = req.body.uname;
  data.profile.contactInfo = req.body.cinfo;
  data.profile.address = req.body.add;
  data.profile.experience = req.body.exp;
  data.profile.skills = req.body.skill;
  data.profile.education = req.body.edu;
  data.profile.about = req.body.abt;

  Profile.findOne({ email_id: email }, function (err, result) {
   
    if (result == null) {
      const profile = new Profile({
        name: req.body.uname,
        about: req.body.abt,
        contactInfo: req.body.cinfo,
        address: req.body.add,
        email_id: email,
        experience: req.body.exp,
        education: req.body.edu,
        skills: req.body.skill,
        profilePicture: {},
      });
      pdata = profile;
      profile.save();
      Login.findOneAndUpdate(
        { email_id: email },
        { $set: { profile: profile } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something went wrong when updating data!", err);
          }
        }
      );
    } else {
      const profile = new Profile({
        name: req.body.uname,
        contactInfo: req.body.cinfo,
        address: req.body.add,
        about: req.body.abt,
        email_id: email,
        experience: req.body.exp,
        education: req.body.edu,
        skills: req.body.skill,
      });

      Profile.findOneAndUpdate(
        { email_id: email },
        {
          name: req.body.uname,
          email_id: data.email_id,
          contactInfo: req.body.cinfo,
          about: req.body.abt,
          address: req.body.add,
          experience: req.body.exp,
          education: req.body.edu,
          skills: req.body.skill,
        },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something went wrong when updating data!", err);
          }
          pdata = doc;
        }
      );
      Login.findOneAndUpdate(
        { email_id: email },
        { $set: { profile: profile } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something went wrong when updating data!", err);
          }
        }
      );
    }
  });
  if (req.file == null || typeof req.file === "undefined") {
    res.redirect("/profile");
  } else {
    var img = {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    };
    Profile.findOneAndUpdate(
      { email_id: email },
      { $set: { profilePicture: img } },
      { new: true },
      (err, result) => {
        pdata = result;
        res.redirect("/profile");
      }
    );
  }
});

var c = 0; //find the count of datas present
var query = Login.find();
query.count(function (err, count) {
  if (err) console.log(err);
  else c = count;
});

//LOGIN SIGNUP CHECK
const check = async (req) => {
  if (req.body.form === "Join") {
    console.log("setting email session variable ", req.body.email);
    sessionstorage.setItem("email_session", req.body.email);
    email = sessionstorage.getItem("email_session");

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
        if (valacc == 0) {
          const data = new Login({
            user_id: uid,
            email_id: email,
            password: pass,
            profile: { name: "" },
            connected: [email],
          });
          data.save();
          message = "Account Succesfully added";
          valacc = -1;
          emailsend = email;
          setTimeout(() => {
            let mailDetails = {
              from: "naghaakshayaa@gmail.com",
              to: emailsend,
              subject: "Welcome to Hiring Lab",
              text: "Welcome to hiring Lab,\n\tYou are at the right place to make your network strong.\n\nCheck the attachment below for more information.\n\nThe Hiring Lab.",
              attachments: [
                {
                  filename: "THE_HIRING_LAB.pdf",
                  path: __dirname + "/THE_HIRING_LAB.pdf",
                  cid: "uniq-THE_HIRING_LAB.pdf",
                },
              ],
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
              if (err) {
                console.log("Error Occurred in emailing");
              } else {
                console.log("Email sent successfully");
              }
            });
          }, 15000);

          console.log("out of mail");
          return 3;
        } else {
          message = "Account already exists";
          valacc = -1;
          return 1;
        }
      }
    }
  } else if (req.body.form === "Login") {
    console.log("setting email session variable ", req.body.loginemail);
    sessionstorage.setItem("email_session", req.body.loginemail);
    email = sessionstorage.getItem("email_session");
    const password = req.body.loginpassword; //destructuring the req object to get the email and password
    var response = await Login.findOne({
      email_id: email,
    }); 
    if (!response) {
      message = "Account doesn't exists";
      return 1;
    } else {
      email = req.body.loginemail;
      if (response.password === password) {
        pdata = await Profile.find({ email_id: email });
        pdata = pdata[0];
        data = response;
        return 2;
      } else {
        message = "Invalid Login Credentials";
        return 1;
      }
    }
  }
};

async function add_post(uname, post1, about) {
  const data = new Post({
    email_id: email,
    post: post1,
    likes: 0,
    peopleliked: [],
  });
  data.save();
  Post.find({ email_id: email }, {}, (err, result) => {
    Login.findOneAndUpdate(
      { email_id: email },
      {
        posts: result,
      },
      { new: true },
      (err, docs) => {}
    );
  });
  console.log("new record created");
}


app.post("/feed", urlencodedParaser, async (req, res) => {
  if (typeof req.body.txtarea == "undefined") {
    Post.findOne(
      { $and: [{ email_id: req.body.postby }, { post: req.body.post }] },
      (err, response) => {
        if (response.peopleliked.includes(email)) {
          res.redirect("/home");
        } else {
          var newppl = response.peopleliked;
          newppl.push(email);
          Post.findOneAndUpdate(
            { email_id: req.body.postby, post: req.body.post },
            {
              likes: response.likes + 1,
              peopleliked: newppl,
            },
            (err, ress) => {
              res.redirect("/home");
            }
          );
        }
      }
    );
  } else {
    var post = await req.body.txtarea;
    add_post(data.profile.name, post);
    res.redirect("/home");
  }
});


//CHAT
const chat = mongoose.model("Chat", chatSchema);
var logindatas = [];
app.get("/chat", (req, res) => {
  Profile.find((err, response) => {
    logindatas = response;
    chat
      .find({ user2: data.email_id })
      .sort({ createdAt: +1 })
      .exec(function (err, result) {
        res.render("chat", {
          stylepath: "css/chat.css",
          path: "chat",
          data,
          pdata,
          user1: " ",
          user2: " ",
          alldatas: logindatas,
          allchatdata: result,
        });
      });
  });
});

app.post("/chat", (req, res) => {
  if (req.body.mess === "-1") {
    var a = [];
    a[0] = req.body.user1;
    a[1] = req.body.user2;
    a.sort();
    var b = a.join("");
    console.log(b);
    chat
      .find({ key: b })
      .sort({ createdAt: +1 })
      .exec(function (err, result) {

        chat
          .find({ user2: data.email_id })
          .sort({ createdAt: +1 })
          .exec(function (err, result1) {
            res.render("chat", {
              stylepath: "css/chat.css",
              path: "chat",
              data,
              pdata,
              user1: req.body.user1,
              user2: req.body.user2,
              alldatas: logindatas,
              chatdata: result,
              allchatdata: result1,
            });
          });
      });
  } else {
    var a = [];
    a[0] = req.body.user1;
    a[1] = req.body.user2;
    a.sort();
    var b = a.join("");
    const ch = new chat({
      key: b,
      user1: req.body.user1,
      user2: req.body.user2,
      message: req.body.mess,
    });
    ch.save(function (err, doc) {
      console.log("Document inserted succussfully!");
      chat
        .find({ key: b })
        .sort({ createdAt: +1 })
        .exec(function (err, result) {
          chat
            .find({ user2: data.email_id })
            .sort({ createdAt: +1 })
            .exec(function (err, result1) {
              res.render("chat", {
                stylepath: "css/chat.css",
                path: "chat",
                data,
                pdata,
                user1: req.body.user1,
                user2: req.body.user2,
                alldatas: logindatas,
                chatdata: result,
                allchatdata: result1,
              });
            });
        });
    });
  }
});
