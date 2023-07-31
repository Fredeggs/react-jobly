import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function USSponsorDetails({ formik, formData, USPhone, setUSPhone }) {
  const { values, handleChange } = formik;
  console.log(values);
  return (
    <div className="other-info-container">
      <label htmlFor="us-first-name">First Name</label>
      <input
        id="us-first-name"
        name="firstName"
        data-tag="USContact"
        type="text"
        value={values.firstName}
        onChange={handleChange}
      />

      <label htmlFor="us-last-name">Last Name</label>
      <input
        id="us-last-name"
        name="lastName"
        data-tag="USContact"
        type="text"
        value={values.lastName}
        onChange={handleChange}
      />

      <label htmlFor="us-email">Email</label>
      <input
        id="us-email"
        name="email"
        data-tag="USContact"
        type="email"
        value={values.email}
        onChange={handleChange}
      />

      <label htmlFor="us-phone">Phone</label>
      <input
        id="us-phone"
        name="phone"
        data-tag="USContact"
        type="phone"
        value={values.phone}
        onChange={handleChange}
      />
    </div>
  );
}

export default USSponsorDetails;
