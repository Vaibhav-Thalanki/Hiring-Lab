const fs = require("fs");
const loadProfiles = () => {
  try {
    const users = JSON.parse(fs.readFileSync("profiles.json").toString());
    return users;
  } catch (e) {
    return [];
  }
};
const saveProfiles = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("profiles.json", dataJSON);
};
const addProfiles = (email, password) => {
  const users = loadProfiles();

  const duplicateProfiles = users.filter((user) => {
    return user.email === email;
  });
  console.log(duplicateProfiles.length);
  if (duplicateProfiles.length === 0) {
    users.push({
      email,
      password,
    });
    saveProfiles(users);
    console.log("Added profile");
    return 1;
  } else {
    console.log("Profile exists");
    return 0;
  }
};
const login = (email,password)=>{
  const users = loadProfiles();
  const duplicateProfiles = users.filter((user) => {
    return (user.email === email && user.password === password);
  });
  console.log(duplicateProfiles);
  if(duplicateProfiles.length === 0){
    console.log("Invalid Credentials");
    return 0;
  }
  else{
    console.log("Login Succesful");
    return 1;
  }
};

module.exports = {
  addProfiles,
  login
};
