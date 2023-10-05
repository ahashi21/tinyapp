// generate random string
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

//check to see if email exist
const findEmail = (email, db) => {
  for (let key in db) {
    if (email === db[key].email) {
      return email;
    }
  }
  return undefined;
};

//check to see if password exist
const findPassword = (email, db) => {
  for (let key in db) {
    if (email === db[key].email) {
      return db[key].password;
    }
  }
  return undefined;
};

// find the id by email
const findUserID = (email, db) => {
  for (let key in db) {
    if (email === db[key].email) {
      return db[key].id;
    }
  }
  return undefined;
};

// returns URL matched with ID
const urlsForUser = (id, db) => {
  const userURLs = {};
  for (let url in db) {
    if (id === db[url].userID) {
      userURLs[url] = db[url];
    }
  }
  return userURLs;
};



// added it for mocha testing to match compass
const getUserByEmail = (email, db) => {
  // loop in database keys
  for (let key in db) {
    // compare the emails, if they match return the user obj
    if (db[key].email === email) {
      return db[key];
    }
  }
  return undefined;
};




module.exports = { generateRandomString,findEmail, findPassword, findUserID, urlsForUser, getUserByEmail };