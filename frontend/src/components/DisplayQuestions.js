import React, { useEffect, useState } from 'react';

const DisplayQuestions = props => {
  const [studentQuestions, setStudentQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/questions')
      .then(response => response.json())
      .then(data => {
        if (data.length == 0) {
          console.log('No data.');
        }
        // console.log(data)
        setStudentQuestions(data);
      });
  }, []);

  return (
    <div className="questions wrapper tableContainer">
      <h1 style={{ fontSize: '2rem' }}>Student Questions:</h1>
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {studentQuestions.map((question, index) => (
              <tr key={index}>
                <td>{question.firstName}</td>
                <td>{question.lastName}</td>
                <td>{question.email}</td>
                <td style={{ width: 'auto' }}>{question.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayQuestions;
