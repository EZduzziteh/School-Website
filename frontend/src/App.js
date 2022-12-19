import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import Landing from "./pages/LandingPage";
import StudentPage from "./pages/StudentPage";

import ContactForm from "./components/ContactForm";
import CreateCourse from "./components/CreateCourse";
import DeleteCourse from "./components/DeleteCourse";
import DisplayArray from "./components/DisplayArray";
import DisplayStudentCourses from "./components/DisplayStudentCourses";
import DisplayStudent from "./components/DisplayStudents";
import DisplayQuestions from "./components/DisplayQuestions";
import EnrollCourse from "./components/EnrollCourse";
import Footer from "./components/Footer";
import Header from "./components/Header";
import StudentRegister from "./components/StudentRegister";

import "./index.css";
import axios from "axios";

const App = () => {
  //Baseline courseData as a starting point
  const [courseData, setCourseData] = useState([]);

  // PETER
  // Get courses from the backend api and update 'courseData' accordingly
  // 'courseData' is then sent as a prop to all relevant components
  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then((response) => {
      setCourseData(response.data.Courses);
    });
  }, []);

  //Add a course to courseData
  const addCourseHandler = (newCourse) => {
    let repeat = false; //For notifying of duplicate courseCodes

    // PETER
    // Send 'newCourse' in a post request to create course api
    axios
      .post("http://localhost:5000/api/courses", newCourse)
      .catch((error) => {
        console.log(error.response.data.error);
      });

    courseData.forEach((course) => {
      if (
        course.courseCode.toLowerCase() === newCourse.courseCode.toLowerCase()
      ) {
        //Checking for duplicate courseCodes
        repeat = true;
        alert("Cannot have two courses with same course code!");
      }
    });

    if (!repeat) {
      setCourseData((prevState) => {
        return [...prevState, newCourse];
      });
      alert(
        "Course " +
          newCourse.courseCode +
          ", " +
          newCourse.courseName +
          " has been added."
      );
    }
  };

  //Delete a course from courseData
  const deleteCourseHandler = (courseToDelete) => {
    const course = courseData.find(
      (course) => course.courseCode === courseToDelete
    );

    // PETER
    // Send 'course.courseCode' in a delete request to delete course api
    axios
      .delete(`http://localhost:5000/api/courses/${course.courseCode}`)
      .catch((error) => {
        console.log(error.response.data.error);
      });

    setCourseData(
      courseData.filter((course) => course.courseCode !== courseToDelete)
    );

    alert(
      course.courseCode + ", " + course.courseName + " - successfully deleted."
    );
  };

  // Display student questions from ContactForm data
  const [studentQuestions, setStudentQuestions] = useState([]);

  const submitFormHandler = (submittedFormInput) => {
    setStudentQuestions((prevState) => {
      return [...prevState, submittedFormInput];
    });
    // console.log(studentQuestions);
  };

  const [registeredStudents, setRegisteredStudents] = useState([]);

  const addNewStudent = (newStudent) => {
    setRegisteredStudents((prevState) => {
      return [...prevState, newStudent];
    });
    console.log("in app");
    console.log(registeredStudents);
  };

  const enrollCourseHandler = (enrolledCourses) => {
    setRegisteredStudents(
      registeredStudents.map((student) => {
        if (student.username === currentUser.username) {
          return {
            ...student,
            registeredCourses: [...student.registeredCourses, enrolledCourses],
          };
        } else return { ...student };
      })
    );
    console.log("in app");
    console.log(currentUser.username);
    console.log(enrolledCourses);
    console.log(registeredStudents);
  };

  const [registeredAdmins, setRegisteredAdmins] = useState([
    { username: "Admin", password: "password" },
  ]);

  const [currentUser, setCurrentUser] = useState({
    username: "",
    password: "",
    profileType: "",
  });

  const updateUserHandler = (currentUser) => {
    setCurrentUser(currentUser);
  };

  return (
    <>
      <Header currentUser={currentUser} />
      <Routes>
        <Route
          index
          element={
            <Landing
              students={registeredStudents}
              admins={registeredAdmins}
              updateUser={updateUserHandler}
            />
          }
        />
        <Route path="student" element={<StudentPage />}>
          <Route
            path="view"
            element={
              <DisplayStudentCourses
                currentUser={currentUser}
                registeredStudents={registeredStudents}
              />
            }
          />
          <Route
            path="search"
            element={
              <>
                <DisplayArray courseCode={courseData} />
                <EnrollCourse
                  courseCode={courseData}
                  currentUser={currentUser}
                  students={registeredStudents}
                  enrollCourse={enrollCourseHandler}
                />
              </>
            }
          />
          <Route
            path="signup"
            element={
              <StudentRegister
                onSignup={addNewStudent}
                students={registeredStudents}
              />
            }
          />
          <Route
            path="form"
            element={<ContactForm onSubmitForm={submitFormHandler} />}
          />
        </Route>
        <Route path="admin" element={<AdminPage />}>
          <Route
            path="search"
            element={<DisplayArray courseCode={courseData} />}
          />
          <Route
            path="add"
            element={<CreateCourse onAddCourse={addCourseHandler} />}
          />
          <Route
            path="delete"
            element={
              <DeleteCourse
                courses={courseData}
                onDeleteCourse={deleteCourseHandler}
              />
            }
          />
          <Route
            path="registered-students"
            element={
              <DisplayStudent
                students={registeredStudents}
                courses={courseData}
              />
            }
          />
          <Route
            path="questions"
            element={<DisplayQuestions studentQuestions={studentQuestions} />}
          />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
