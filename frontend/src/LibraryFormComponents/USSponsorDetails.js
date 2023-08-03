import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function USSponsorDetails({ formik, setDisableNext, setFormTouched }) {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  Object.keys(errors).length === 0 ? setDisableNext(false) : setDisableNext(true);
  Object.keys(touched).length === 0 ? setFormTouched(false) : setFormTouched(true);
  return (
    <div className="other-info-container">
      <p>The US sponsor is a US resident who is responsible for monitoring the status and requirements of the library.</p>
      <label htmlFor="us-first-name">First Name</label>
      <input
        id="us-first-name"
        name="firstName"
        data-tag="USContact"
        type="text"
        value={values.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.firstName && touched.firstName ? "input-error" : ""
        }
      />
      {errors.firstName && touched.firstName && (
        <p className="error">{errors.firstName}</p>
      )}

      <label htmlFor="us-last-name">Last Name</label>
      <input
        id="us-last-name"
        name="lastName"
        data-tag="USContact"
        type="text"
        value={values.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.lastName && touched.lastName ? "input-error" : ""
        }
      />
      {errors.lastName && touched.lastName && (
        <p className="error">{errors.lastName}</p>
      )}

      <label htmlFor="us-email">Email</label>
      <input
        id="us-email"
        name="email"
        data-tag="USContact"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.email && touched.email ? "input-error" : ""
        }
      />
      {errors.email && touched.email && (
        <p className="error">{errors.email}</p>
      )}

      <label htmlFor="us-phone">Phone</label>
      <input
        id="us-phone"
        name="phone"
        data-tag="USContact"
        type="phone"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.phone && touched.phone ? "input-error" : ""
        }
      />
      {errors.phone && touched.phone && (
        <p className="error">{errors.phone}</p>
      )}
    </div>
  );
}

export default USSponsorDetails;
