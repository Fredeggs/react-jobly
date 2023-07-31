import React, { useState, useContext, useEffect, useRef } from "react";
import "react-phone-number-input/style.css";

function PHSponsorDetails({ formik, formData, PHPhone, setPHPhone }) {
  const { values, handleChange } = formik;
  console.log(values);
  return (
    <div className="other-info-container">
      <label htmlFor="ph-first-name">First Name</label>
      <input
        id="ph-first-name"
        name="firstName"
        data-tag="PHContact"
        type="text"
        value={values.firstName}
        onChange={handleChange}
      />
      <label htmlFor="ph-last-name">Last Name</label>
      <input
        id="ph-last-name"
        name="lastName"
        data-tag="PHContact"
        type="text"
        value={values.lastName}
        onChange={handleChange}
      />
      <label htmlFor="ph-email">Email</label>
      <input
        id="ph-email"
        name="email"
        data-tag="PHContact"
        type="email"
        value={values.email}
        onChange={handleChange}
      />
      <label htmlFor="ph-phone">Phone</label>
      <input
        id="ph-phone"
        name="phone"
        data-tag="PHContact"
        type="phone"
        value={values.phone}
        onChange={handleChange}
        placeholder="PH Phone Number"
      />
    </div>
  );
}

export default PHSponsorDetails;
