import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = props => {
  const navigate = useNavigate();

  const [btnStudentSelected, setBtnStudentSelected] = useState(false);
  const [btnAdminSelected, setBtnAdminSelected] = useState(false);
  const [btnSelected, setBtnSelected] = useState(false);

  const styleBtnStudent = () => {
    setBtnStudentSelected(true);
    setBtnAdminSelected(false);
    setBtnSelected(true);
  };

  const styleBtnAdmin = () => {
    setBtnAdminSelected(true);
    setBtnStudentSelected(false);
    setBtnSelected(true);
  };
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    let correctInfo = false;
    axios({
      method: 'POST',
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: 'http://localhost:5000/handleLogin',
    }).then(res => {
      console.log(res.data);

      correctInfo = res.data;
      console.log(correctInfo);
      if (res.data === true) {
        correctInfo = true;
      }

      if (correctInfo) {
        if (btnAdminSelected) {
          console.log('logging admin');

          navigate('/admin/search');
        }
        if (btnStudentSelected) {
          //navigate()
          console.log('logging stud');
          navigate('/student/search');
        }
      } else {
        alert('Invalid Login Information! please try again');
      }
    });
  };

  const displayedText = () => {
    if (!btnSelected) {
      return 'Please Choose Student / Admin';
    } else if (btnStudentSelected) {
      return 'Logging in as Student';
    } else if (btnAdminSelected) {
      return 'Logging in as Admin';
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={styleBtnStudent}
          className={btnStudentSelected ? 'selectedBtn' : 'btn'}
        >
          Student
        </button>
        <button
          type="button"
          onClick={styleBtnAdmin}
          className={btnAdminSelected ? 'selectedBtn' : 'btn'}
        >
          Admin
        </button>{' '}
        <br />
        <div className="row">
          Username:{' '}
          <input
            placeholder="username"
            type="text"
            required
            onChange={e => setLoginUsername(e.target.value)}
          />{' '}
          <br />
        </div>
        <div className="row">
          Password:{' '}
          <input
            placeholder="password"
            type="password"
            required
            onChange={e => setLoginPassword(e.target.value)}
          />{' '}
          <br />
        </div>
        <button
          className={btnSelected ? 'submitBtn' : 'submitBtnDisabled'}
          type="submit"
          disabled={btnSelected ? false : true}
        >
          Submit
        </button>{' '}
        <br />
        <p>{displayedText()}</p>
      </form>
    </div>
  );
};

export default Login;
