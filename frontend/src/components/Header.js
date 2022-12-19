import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import logo from '../assets/bvcfullcut.jpg';
import '../index.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = (props) => {
  const location = useLocation();
  useEffect(() => {
    console.log('url changed');
    getLoggedInUser();
  }, [location]);

  const navigate = useNavigate();

  // const [loggedInUserName, SetLoggedInUserName] = useState(null);

  const getLoggedInUser = () => {
    console.log('getting user name');

    axios({
      method: 'GET',
      withCredentials: true,
      url: 'http://localhost:5000/CheckIsLoggedIn',
    }).then(res => {
      if (res) {
        //user logged in
        console.log('there is a user logged in');
        axios({
          method: 'GET',
          withCredentials: true,
          url: 'http://localhost:5000/getLoggedInUsername',
        }).then(res => {
          console.log(res.data);

          //console.log("Getting username: "+req.user.username);
          if (res.data != null) {
            console.log('current: location: ' + location.pathname);
            /*
            if(location.pathname='/student/signup'){
              document.getElementById('loggedInInformation').innerHTML ="Please Sign up below!";
            }
            if(location.pathname='/'){
              document.getElementById('loggedInInformation').innerHTML ="Please Login Below!";
            }*/
            document.getElementById('loggedInInformation').innerHTML =
              'Logged in as: ' + res.data;
            document.getElementById('logoutButton').removeAttribute('hidden');
            console.log('updated logged in info');
          } else {
            console.log('there is not a user logged in');
            document.getElementById('loggedInInformation').innerHTML =
              'Not logged in!';
            document
              .getElementById('logoutButton')
              .setAttribute('hidden', 'hidden');
          }
        });
      }
    });
  };

  function logout() {
    console.log('logging out');
    axios({
      method: 'POST',
      withCredentials: true,
      url: 'http://localhost:5000/logout',
    }).then(res => {
      navigate('/');
    });

    document.getElementById('loggedInInformation').innerHTML = 'Not logged in!';
    if (document.getElementById('logoutButton')) {
      document.getElementById('logoutButton').setAttribute('hidden', 'hidden');
    }
    props.currentUser.username = "";
    alert("Now logging out")
    navigate('/');
  }

  return (
    <header>
      <div className="nav-area">
        <img src={logo} alt="BVC Logo" className="logo-icon" />
        <div>
          {' '}
          <p id="loggedInInformation">Not logged in!</p>
          <button hidden id="logoutButton" onClick={logout}>
            Logout
          </button>{' '}
        </div>
        <Dropdown />
      </div>
      
    </header>
  );
};

export default Header;
