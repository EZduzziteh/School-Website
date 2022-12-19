import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayArray = props => {
  const [resultArr, setResultArr] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const searchGo = event => {
    setSearchValue(event.target.value);
  };

  var arr = [];

  useEffect(() => {
    fetch("http://localhost:5000/studentlist")
      .then(response => response.json())
      .then(data => setStudentList(data));
  }, []);

  useEffect(() => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: 'http://localhost:5000/getLoggedInUsername',
    })
      .then(res => {
        props.currentUser.username = res.data;
        console.log('set current user: ' + props.currentUser.username);
      })
      .then(res => {
        var currentStudent = studentList.find(
          student => student.username === props.currentUser.username
        );
        console.log(studentList);
        console.log(props.currentUser.username);
        console.log(currentStudent.username);
        if (!props.currentUser.username == ''){
          arr = currentStudent.registeredCourses;
          console.log(arr);
        }
        if (props.currentUser.username == '') arr = [];
      }).then(res => {
        setResultArr([...arr].filter(course =>
          (course.courseName + course.courseCode)
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        ))
      })
  }, [studentList, searchValue])

  return (
    <div>
      <form className="tableContainer">
        <label>Search Course: </label>
        <input type="text" value={searchValue} onChange={searchGo} />
        <div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Term</th>
                <th>StartDate</th>
                <th>EndDate</th>
              </tr>
            </thead>
            <tbody>
              {resultArr
                .sort(
                  (course1, course2) =>
                    course1.courseTerm
                      .toString()
                      .localeCompare(course2.courseTerm.toString()) ||
                    course1.courseCode > course2.courseCode
                )
                .map(courses => (
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
        </div>
      </form>
    </div>
  );
};

export default DisplayArray;
