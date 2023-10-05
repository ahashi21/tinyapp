function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};


//express
const express = require("express");
const app = express();
//port
const PORT = 8080; // default port 8080
//ejs
app.set("view engine", "ejs");
//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// helper functions 
const { findEmail, findPassword, findUserID} = require('./helpers/userFunctions')

// url Database 
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// user database 
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


//login form 
app.get("/login", (req, res) => {
  const templateVars = { 
  user: users[req.cookies["user_id"]]
  };
  res.render("urls_login",templateVars);
});

//register form 
app.get("/register", (req, res) => {
  const templateVars = { 
  user: users[req.cookies["user_id"]]
  };
  res.render("urls_registration",templateVars);
});

//main page
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log("longURL", longURL);
  res.redirect(longURL);
});

//new URLS 
app.get("/urls/new", (req, res) => {
  const templateVars = { 
  user: users[req.cookies["user_id"]]
  };
  res.render("urls_new",templateVars);
});

//edit / show tiny url 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});


/*app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});*/

// generate new id and store registration infos 
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const email = req.body.email
  const password = req.body.password;
  const userObj = {
    id : newUserID,
    email : email,
    password : password
  }; 
  console.log(users);

  const userEmail = findEmail(email, users);
  console.log(userEmail);
  if (userObj.email === "" || userObj.password === ""){
   
    res.send("400 error ! Bad request");
  } else if  (!userEmail) {
    console.log("hello");
    users[newUserID] = userObj;
    res.cookie("user_id", newUserID);
    res.redirect("/urls");
  } else {
    res.send("400 error ! Bad request");
  }
});



app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL
  console.log(req.body.longURL);
  urlDatabase[req.params.id] = longURL;
  res.redirect('/urls');
})

//generate random shurt url + add to database 
app.post("/urls", (req, res) => {
  console.log(req)
  const shortURL = generateRandomString();
  const longURL= req.body.longURL;
  urlDatabase[shortURL]= longURL;
  console.log(urlDatabase);
  res.redirect("/urls/${shortURL}");         
});


app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("DELETE ROUTE HAS BEEN HIT");
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.post("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password;
  const userEmail = findEmail(email, users);
  console.log(userEmail);
  const userPassword = findPassword(email,users);
  if (email === userEmail) {
    if (password === userPassword){
      const userID = findUserID(email,users)
      res.cookie("user_id", userID);
      res.redirect("/urls");
    } else {
    res.send("403 Forbidden");
    }
  } else {
    res.send("403 Forbidden");
  }
})


app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});