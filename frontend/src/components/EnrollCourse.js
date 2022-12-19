import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const EnrollCourse = (props) => {
  const [studentList, setStudentList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  const selectedHandler = (event) => {
    setSelectedCourse(event.target.value);
  };

  const enrollCourse = (event) => {
    event.preventDefault();
    let newCourse;

    // axios({
    //   method: 'GET',
    //   withCredentials: true,
    //   url: 'http://localhost:5000/getLoggedInUsername',
    // })
    //   .then(res => {
    //     props.currentUser.username = res.data;
    //     console.log('set current user: ' + props.currentUser.username);
    //   })
    //   .then(res => {
    if (props.currentUser.username === "") {
      alert("You must register first!");
      return navigate("/student/signup");
    }
    if (
      studentList.some(
        (student) =>
          student.username === props.currentUser.username &&
          student.program === "Upgrade" &&
          (student.registeredCourses.length === 3 || enrolledCourses.length >= 3)
      )
    )
      return alert(
        "You cannot register for more than 3 courses while upgrading"
      );
    if (
      !enrolledCourses.some((course) => course.courseName === selectedCourse)
    ) {
      props.courseCode.map((course) => {
        if (course.courseName === selectedCourse) {
          newCourse = course;
        }
      });
      setEnrolledCourses((prevState) => [...prevState, newCourse]);
    } else return alert("You have already registered for this course!");
    //props.enrollCourse(newCourse);
    console.log(enrolledCourses);
    setStudentList((current) =>
      current.map((obj) => {
        if (obj.username === props.currentUser.username) {
          return { ...obj, registeredCourses: enrolledCourses };
        }
        return obj;
      })
    );
    //})
    //.then(() =>
    //sendData(newCourse)//);

    let dataToSend = {
      username: props.currentUser.username,
      newCourse: newCourse,
    };
    fetch("http://localhost:5000/enrollcourse", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response.data);
      if (response.status >= 200 && response.status < 300);
      else alert("Something went wrong, please try again later.");
    });
  };

  // function sendData(newCourse) {
  //   console.log('called');
  //   let dataToSend = {
  //     username: props.currentUser.username,
  //     newCourse: newCourse,
  //   };
  //   fetch('http://localhost:5000/enrollcourse', {
  //     method: 'POST',
  //     body: JSON.stringify(dataToSend),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }).then(response => {
  //     console.log(response.data);
  //     if (response.status >= 200 && response.status < 300);
  //     else alert('Something went wrong, please try again later.');
  //   });
  // }

  const [initialRun, setInitialRun] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/studentlist")
      .then((response) => response.json())
      .then((data) => setStudentList(data))
      .then(() => setInitialRun(1));
  }, []);

  let arr;

  useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/getLoggedInUsername",
    })
      .then((res) => {
        props.currentUser.username = res.data;
        console.log("set current user: " + props.currentUser.username);
      })
      .then((res) => {
        var currentStudent = studentList.find(
          (student) => student.username === props.currentUser.username
        );
        console.log(studentList);
        console.log(props.currentUser.username);
        console.log(currentStudent.username);
        if (!props.currentUser.username == "") {
          arr = currentStudent.registeredCourses;
          console.log(arr);
        }
        if (props.currentUser.username == "") arr = [];
      })
      .then((res) => {
        setEnrolledCourses(arr);
      });
  }, [initialRun]);

  return (
    <div>
      {console.log("onload")}
      {console.log(enrolledCourses)}
      {console.log(studentList)}
      <div>
        <form onSubmit={enrollCourse}>
          <label>Enroll in Course: </label>
          <select required onChange={selectedHandler}>
            <option value=""></option>
            {props.courseCode
              .sort(
                (course1, course2) =>
                  course1.courseTerm
                    .toString()
                    .localeCompare(course2.courseTerm.toString()) ||
                  course1.courseCode > course2.courseCode
              )
              .map((courseCode) => (
                <option
                  value={courseCode.courseName}
                  key={courseCode.courseName}
                >
                  {courseCode.courseName}
                </option>
              ))}
          </select>
          <button type="submit"> Ok</button>
          <br></br>
          <br></br>
          <label>Currently Enrolled in: </label>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Term</th>
                <th>StartDate</th>
                <th>StartDate</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses
                .sort(
                  (course1, course2) =>
                    course1.courseTerm
                      .toString()
                      .localeCompare(course2.courseTerm.toString()) ||
                    course1.courseCode > course2.courseCode
                )
                .map((courses) => (
                  <tr key={courses.courseCode}>
                    <td>{courses.courseCode}</td>
                    <td>{courses.courseName}</td>
                    <td>{courses.courseTerm}</td>
                    <td>{courses.courseStartDate}</td>
                    <td>{courses.courseEndDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default EnrollCourse;
