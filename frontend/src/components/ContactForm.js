import React, { useEffect, useState } from 'react';

const ContactForm = props => {
  const [msgInfo, setMsgInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  //Single handler to handle form input changes
  const changeHandler = e => {
    setMsgInfo({ ...msgInfo, [e.target.name]: e.target.value });
  };

  //To clear form after successful submission
  const resetForm = () => {
    setMsgInfo({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    });
  };

  const submitFormHandler = async event => {
    event.preventDefault();

    if (
      !msgInfo.firstName ||
      !msgInfo.lastName ||
      !msgInfo.email ||
      !msgInfo.message
    ) {
      alert('Please fill out all fields.');
    } else {
      fetch('http://localhost:5000/newmessage', {
        method: 'POST',
        body: JSON.stringify(msgInfo),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          console.log('Response received');
        })
        .catch(error => {
          console.warn('Error: ', error.response.body);
        });

      resetForm();
      alert('Your message has been sent.');
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={submitFormHandler}>
        <div>
          <h2>First Name: </h2>
          <input
            type="text"
            name="firstName"
            maxLength="30"
            required
            value={msgInfo.firstName}
            onChange={changeHandler}
          />
        </div>
        <div>
          <h2>Last Name: </h2>
          <input
            type="text"
            name="lastName"
            maxLength="30"
            required
            value={msgInfo.lastName}
            onChange={changeHandler}
          />
        </div>
        <div>
          <h2>Email: </h2>
          <input
            type="email"
            name="email"
            maxLength="50"
            required
            value={msgInfo.email}
            onChange={changeHandler}
          />
        </div>
        <div>
          <h2>Message: </h2>
          <textarea
            name="message"
            maxLength="500"
            required
            value={msgInfo.message}
            onChange={changeHandler}
          />
        </div>
        <div className="button-div">
          <button type="submit" className="submitBtn">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
