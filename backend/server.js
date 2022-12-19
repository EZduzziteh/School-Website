const _ = require('underscore');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const expressSession = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const messageDataURL = './database/storedMessages.json';
const user = require('./user');

mongoose.connect(
  'mongodb+srv://myUser:myPassword@cluster0.jmqkcax.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('connected to mongodb');
  }
);

// // /**** WAS MADE FOR TESTING ON MY END CAN IGNORE (COLIN) CAN BE DELETED AT LATER DATE *****/
// let objData;

// if (fs.existsSync('database/data.json')) {
//   console.log('Loading data from "database/data.json"');
//   let data = fs.readFileSync('database/data.json', 'utf8');
//   objData = JSON.parse(data);
// } else {
//   console.log('Created variable "obj" to hold data');
//   objData = {
//     Admins: [],
//     Courses: [
//       {
//         courseCode: 'PM111',
//         courseName: 'Intro to Project Management',
//         courseTerm: 1,
//         courseStartDate: '2022-09-06',
//         courseEndDate: '2022-12-16',
//         courseFees: '676.67',
//         courseDescription:
//           'This is a course where we will introduce you to basic Project Management concepts.',
//       },
//       {
//         courseCode: 'PF111',
//         courseName: 'C++ Programming Fundamentals',
//         courseTerm: 1,
//         courseStartDate: '2022-09-06',
//         courseEndDate: '2022-12-16',
//         courseFees: '785.15',
//         courseDescription:
//           'This is a course where we will introduce you to basic C++ Programming fundamentals.',
//       },
//       {
//         courseCode: 'CM111',
//         courseName: 'Computer Maintenance',
//         courseTerm: 1,
//         courseStartDate: '2022-09-06',
//         courseEndDate: '2022-12-16',
//         courseFees: '457.49',
//         courseDescription:
//           'In this course you will learn about the basics of computer maintenance.',
//       },
//       {
//         courseCode: 'IS111',
//         courseName: 'Information Security',
//         courseTerm: 1,
//         courseStartDate: '2022-09-06',
//         courseEndDate: '2022-12-16',
//         courseFees: '647.77',
//         courseDescription:
//           'In this course you will learn about the basics of Information Security.',
//       },
//       {
//         courseCode: 'NET222',
//         courseName: 'Networking',
//         courseTerm: 2,
//         courseStartDate: '2023-01-09',
//         courseEndDate: '2023-04-21',
//         courseFees: '533.66',
//         courseDescription:
//           'In this course you will be introduced to the basics of networking and how to setup a home network.',
//       },
//       {
//         courseCode: 'WEB222',
//         courseName: 'Web Technology',
//         courseTerm: 2,
//         courseStartDate: '2023-01-09',
//         courseEndDate: '2023-04-21',
//         courseFees: '874.95',
//         courseDescription:
//           'In this course you will learn about the basics of web design and programming.',
//       },
//       {
//         courseCode: 'PM222',
//         courseName: 'Project Management',
//         courseTerm: 2,
//         courseStartDate: '2023-01-09',
//         courseEndDate: '2023-04-21',
//         courseFees: '788.87',
//         courseDescription:
//           'In this course you will dive deeper into the many aspects of project management.',
//       },
//       {
//         courseCode: 'PM333',
//         courseName: 'Intermediate Project Management',
//         courseTerm: 3,
//         courseStartDate: '2023-10-04',
//         courseEndDate: '2023-12-15',
//         courseFees: '877.78',
//         courseDescription:
//           'In this course you will study more specific aspects about project management specifically pertaining to software development.',
//       },
//       {
//         courseCode: 'PF333',
//         courseName: 'Advanced C++ Programming Fundamentals',
//         courseTerm: 3,
//         courseStartDate: '2023-10-04',
//         courseEndDate: '2023-12-15',
//         courseFees: '966.96',
//         courseDescription:
//           'In this course you will learn more advanced and in-depth features within the C++ programming language.',
//       },
//       {
//         courseCode: 'CM333',
//         courseName: 'Advanced Computer Maintenance',
//         courseTerm: 3,
//         courseStartDate: '2023-10-04',
//         courseEndDate: '2023-12-15',
//         courseFees: '579.89',
//         courseDescription:
//           'This course will go into more specific elements about computer maintenance.',
//       },
//       {
//         courseCode: 'IS333',
//         courseName: 'Advanced Information Security',
//         courseTerm: 3,
//         courseStartDate: '2023-10-04',
//         courseEndDate: '2023-12-15',
//         courseFees: '745.54',
//         courseDescription:
//           'In this course you will go into more specific detail pertaining to aspects of information security.',
//       },
//       {
//         courseCode: 'NET444',
//         courseName: 'Advanced Networking',
//         courseTerm: 4,
//         courseStartDate: '2024-01-08',
//         courseEndDate: '2024-04-19',
//         courseFees: '713.67',
//         courseDescription:
//           'In this course you will learn more advanced networking techniques and learn how to set up a mid-sized office network.',
//       },
//       {
//         courseCode: 'WEB444',
//         courseName: 'Advanced Web Technology',
//         courseTerm: 4,
//         courseStartDate: '2024-01-08',
//         courseEndDate: '2024-04-19',
//         courseFees: '634.50',
//         courseDescription:
//           'In this course you will learn how to create websites using react as well as back-end logic and setting up a server.',
//       },
//       {
//         courseCode: 'PR444',
//         courseName: 'Advanced Project Management',
//         courseTerm: 4,
//         courseStartDate: '2024-01-08',
//         courseEndDate: '2024-04-19',
//         courseFees: '533.24',
//         courseDescription:
//           'In this course you will learn advanced techniques about project management as well as create your own project idea.',
//       },
//     ],
//     Students: [],
//     Questions: [],
//   };
//   let data = JSON.stringify(objData, null, 2);
//   fs.writeFile('database/data.json', data, complete);
//   function complete() {
//     console.log('File has been successfully created');
//   }
// }

// PETER
// Loading courses from database/courseData.json

//DATABASE:
var userStore;
var courseStore;
var messageStore;

//Looking for existing User file.
if (fs.existsSync(path.join(__dirname, 'database', 'storedUsers.json'))) {
  userStore = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'database', 'storedUsers.json'))
  );
  console.log('Loaded file from storedUsers.json');
} else {
  userStore = { Users: [] };
  fs.writeFile(
    path.join(__dirname, 'database', 'storedUsers.json'),
    JSON.stringify(userStore, null, 2),
    fileCreated
  );
  function fileCreated() {
    console.log('Created file storedUsers.json');
  }
}

//Looking for existing Course file.
if (fs.existsSync(path.join(__dirname, 'database', 'storedCourses.json'))) {
  courseStore = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'database', 'storedCourses.json'))
  );
  console.log('Loaded file from storedCourses.json');
} else {
  courseStore = { Courses: [] };
  fs.writeFile(
    path.join(__dirname, 'database', 'storedCourses.json'),
    JSON.stringify(courseStore, null, 2),
    fileCreated
  );
  function fileCreated() {
    console.log('Created file storedCourses.json');
  }
}

//Looking for existing question file.
if (fs.existsSync(path.join(__dirname, 'database', 'storedMessages.json'))) {
  messageStore = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'database', 'storedMessages.json'))
  );
  console.log('Loaded file from storedMessages.json');
} else {
  messageStore = { Messages: [] };
  fs.writeFile(
    path.join(__dirname, 'database', 'storedMessages.json'),
    JSON.stringify(messageStore, null, 2),
    fileCreated
  );
  function fileCreated() {
    console.log('Created file storedMessages.json');
  }
}

//APIs for recovering Data.
app.get('/userData', function (req, res) {
  res.sendFile(__dirname + '/database/storedUsers.json');
});

app.get('/courseData', function (req, res) {
  res.sendFile(__dirname + '/database/storedCourses.json');
});

app.get('/messageData', function (req, res) {
  res.sendFile(__dirname + '/database/storedMessages.json');
});

// PETER
// API (GET): retrieve all courses
app.get('/api/courses', (req, res) => {
  if (fs.existsSync('database/storedCourses.json')) {
    let data = fs.readFileSync('database/storedCourses.json', 'utf8');
    courseData = JSON.parse(data);
  } else {
    console.log(
      'Could not load courses from database/courses.json - Check if file exists.'
    );
  }
  res.send(courseData);
});

// PETER
// API (POST): create new course
app.post('/api/courses', (req, res) => {
  let newCourse = {
    courseCode: req.body.courseCode,
    courseName: req.body.courseName,
    courseTerm: req.body.courseTerm,
    courseStartDate: req.body.courseStartDate,
    courseEndDate: req.body.courseEndDate,
    courseFees: req.body.courseFees,
    courseDescription: req.body.courseDescription,
  };

  let verified = true;
  let msg = 'Something went wrong.';

  if (
    !req.body.courseCode ||
    !req.body.courseName ||
    !req.body.courseTerm ||
    !req.body.courseStartDate ||
    !req.body.courseEndDate ||
    !req.body.courseFees ||
    !req.body.courseDescription
  ) {
    verified = false;
    msg = 'Missing information, please fill out all fields.';
  }

  if (req.body.courseCode.length > 6) {
    verified = false;
    msg =
      '"Course Code" has to be at least 1 and no more than 6 characters long.';
  }

  if (req.body.courseName.length > 50) {
    verified = false;
    msg =
      '"Course Name" has to be at least 1 and no more than 50 characters long.';
  }

  if (req.body.courseTerm < 1 || req.body.courseTerm > 4) {
    verified = false;
    msg = '"Course Term" has to be a number between 1 to 4.';
  }

  if (req.body.courseStartDate.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
    verified = false;
    msg = '"Course Start Date" has to be in the proper format yyyy-mm-dd.';
  }

  if (
    req.body.courseEndDate.match(/^\d{4}-\d{2}-\d{2}$/) === null ||
    req.body.courseEndDate < req.body.courseStartDate
  ) {
    verified = false;
    msg =
      '"Course End Date" has to be in the proper format yyyy-mm-dd and has to be after the Course Start Date.';
  }

  if (req.body.courseFees > 1000000) {
    verified = false;
    msg = '"Course Fee" cannot be more than 1000000.';
  }

  if (req.body.courseDescription.length > 300) {
    verified = false;
    msg = '"Course Description" has a maximum length of 300 characters.';
  }

  if (verified) {
    courseStore.Courses.push(newCourse);
    res.send(newCourse);

    let data = JSON.stringify(courseStore, null, 2);
    fs.writeFile('database/storedCourses.json', data, completed);
    function completed() {
      console.log('New course has been added to database/storedCourses.json');
    }
  } else {
    res.send(msg);
  }
});

// PETER
// API (DELETE): delete a course
app.delete('/api/courses/:courseCode', (req, res) => {
  const course = courseStore.Courses.find(
    c => c.courseCode === req.params.courseCode
  );
  if (!course)
    return res
      .status(404)
      .send('The course with the given "course code" was not found.');

  const index = courseStore.Courses.indexOf(course);
  courseStore.Courses.splice(index, 1);

  let data = JSON.stringify(courseStore, null, 2);
  fs.writeFile('database/storedCourses.json', data, completed);
  function completed() {
    console.log(
      'The selected course has been deleted from database/storedCourses.json'
    );
  }
  res.send(course);
});

app.get('/', (req, res) => {
  res.send('BVC Course Registration Backend');
});

/***** COLIN *****/
// For enrolling in course
app.post('/enrollcourse', (req, res) => {
  let verified = true;
  let msg = 'Something went wrong.';

  if (!req.body.username || !req.body.newCourse) {
    verified = false;
    msg = 'Missing information, please fill out all fields.';
  } else if (
    !userStore.Users.some(user => user.username === req.body.username)
  ) {
    verified = false;
    msg = 'Incorrect username, please try again.';
  } else if (
    courseStore.Courses.filter(
      course => JSON.stringify(course) === JSON.stringify(req.body.newCourse)
    ).length < 1
  ) {
    verified = false;
    msg =
      'Incorrect course information, course does not exist, please check information and try again.';
  } else {
    userStore.Users.forEach(user => {
      if (user.username == req.body.username) {
        if (user.program == 'Upgrade' && user.registeredCourses.length >= 3) {
          verified = false;
          msg = 'Cannot register for more than three courses.';
        }
        if (
          user.registeredCourses.forEach(
            course => JSON.stringify(course) === JSON.stringify(req.body.course)
          )
        ) {
          verified = false;
          msg = 'Already registered for this course.';
        }
      }
    });
  }

  if (!verified) {
    res.send(msg);
  } else {
    userStore.Users.forEach(user => {
      if (user.username == req.body.username) {
        if (req.body.newCourse != null)
          user.registeredCourses.push(req.body.newCourse);
      }
    });
    let data = JSON.stringify(userStore, null, 2);
    fs.writeFile(
      path.join(__dirname, 'database', 'storedUsers.json'),
      data,
      complete
    );
    function complete() {
      console.log('Course registration successful');
    }

    res.send({ success: true, code: 200 });
  }
});

// For getting student info
app.get('/studentlist', (req, res) => {
  res.send(userStore.Users); // WILL NEED TO BE UPDATED BASED ON PEDRO'S WORK
});

// For adding students
app.post('/newstudent', (req, res) => {
  // WILL NEED TO BE UPDATED BASED ON PEDRO'S WORK
  const newStudentID = GenerateNewStudentID();

  let verified = true;
  let msg = 'Something went wrong.';

  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.phone ||
    !req.body.dateOfBirth ||
    !req.body.department ||
    !req.body.program ||
    !req.body.username ||
    !req.body.password
  ) {
    verified = false;
    msg = 'Missing information, please fill out all fields.';
  }

  if (
    userStore.Users.some(
      student => student.email.toLowerCase() === req.body.email.toLowerCase()
    )
  ) {
    verified = false;
    msg = 'Email is already in use.';
  }

  if (
    req.body.email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    ) === null
  ) {
    verified = false;
    msg = 'Please submit a proper email address.';
  }

  if (
    req.body.phone.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/) === null
  ) {
    verified = false;
    msg = 'Please enter a phone number with the following format: 123-456-7890';
  }

  let dateOfBirth = new Date(req.body.dateOfBirth).getTime();

  if (
    req.body.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/) === null ||
    typeof dateOfBirth !== 'number' ||
    Number.isNaN(dateOfBirth) ||
    dateOfBirth > new Date().getTime()
  ) {
    verified = false;
    msg = 'Please enter an appropriate date in the format: yyyy-mm-dd';
  }

  if (req.body.department !== 'IT' && req.body.department !== 'Other') {
    verified = false;
    msg = 'Please enter one of the following: IT, Other';
  }

  if (
    req.body.program !== 'Diploma (2 Years)' &&
    req.body.program !== 'Post-Diploma (1 Year)' &&
    req.body.program !== 'Certificate (3 Months)' &&
    req.body.program !== 'Certificate (6 Months)' &&
    req.body.program !== 'Upgrade' &&
    req.body.program !== 'Other'
  ) {
    verified = false;
    msg =
      'Please enter one of the following: Diploma (2 Years), Post-Diploma (1 Year), Certificate (3 Months), Certificate (6 Months), Upgrade, Other';
  }

  if (
    userStore.Users.some(
      student =>
        student.username.toLowerCase() === req.body.username.toLowerCase()
    )
  ) {
    verified = false;
    msg = 'Username is already in use.';
  }

  if (!verified) {
    res.send(msg);
  }

  if (verified) {
    const newStudent = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      department: req.body.department,
      program: req.body.program,
      studentID: newStudentID,
      username: req.body.username,
      password: req.body.password,
      registeredCourses: [],
    };

    userStore.Users.push(newStudent);
    let data = JSON.stringify(userStore, null, 2);
    fs.writeFile(
      path.join(__dirname, 'database', 'storedUsers.json'),
      data,
      complete
    );
    function complete() {
      console.log('New Student Added:\n' + newStudent);
    }

    res.send({ success: true, code: 200 });
  }

  function GenerateNewStudentID() {
    let tempID;
    let isUnique = false;

    //This loop runs and keeps generating ids until a unique id is generated.
    while (!isUnique) {
      tempID = Math.floor(Math.random() * 999999); //Generate random number between 000000 - 999999

      isUnique = true; // Set it to true to exit loop
      if (userStore.Users.find(student => student.studentID === tempID)) {
        isUnique = false; // If found set back to false to run the loop again
      }
    }

    console.log('Succesfully generated a new unique id: ' + tempID);
    return tempID;
  }
});
/***** END OF COLIN *****/

/* **********Sasha  start*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: 'mySecret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./passportConfig')(passport);

app.post('/handleLogin', (req, res, next) => {
  console.log('hi');
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.send(false);
    } else {
      req.logIn(user, err => {
        if (err) throw err;
        res.send('auth success');
      });
    }
  })(req, res, next);
});

app.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });

  console.log('logging out');
});

app.post('/handleRegister', (req, res) => {
  user.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send('user already exists');
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new user({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send('User Created');
    }
  });
});

app.get('/getLoggedInUsername', (req, res) => {
  res.send(req.user.username);
});

app.get('/CheckIsLoggedIn', (req, res) => {
  if (res.user != null) {
    console.log('logged in as: ' + res.user.username);
    res.send(true);
  } else {
    console.log('Not Logged In!');
    res.send(true);
  }
});

// Checking for file
var exists = fs.existsSync(messageDataURL);
if (exists) {
  var data = fs.readFileSync(messageDataURL, 'utf-8');
  obj = JSON.parse(data);
} else {
  // Create the data object if the file does not exist
  console.log('Creating data object');
  var obj = { messages: [] };
}

// Gemma
// API to submit new message/question
app.post('/newmessage', (req, res) => {
  let reply = 'Success';
  let check = true;

  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.message
  ) {
    check = false;
    reply = 'Please fill out all fields.';
  }

  if (!check) {
    res.send(reply);
  }

  if (check) {
    // Create Contact Request object to store properties from msgInfo
    const contactRequest = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      message: req.body.message,
    };

    // Push the current contact request to the data object
    obj.messages.push(contactRequest);

    // Convert the JS object to a JSON string
    let data = JSON.stringify(obj, null, 2);

    // Write the JSON string to file
    fs.writeFile(messageDataURL, data, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('Data successfully written to file.\n');
      }
    });
    res.send(contactRequest);
  }
});

// Gemma
// API to retrieve all messages
app.get('/questions', (req, res) => {
  if (obj.messages == []) {
    res.send('There are no messages.');
  }
  res.send(obj.messages);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
