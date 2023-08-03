import React, { useState, useContext, useEffect, useRef } from "react";
import "react-phone-number-input/style.css";

function PHSponsorDetails({ formik, setDisableNext, setFormTouched  }) {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  Object.keys(errors).length === 0 ? setDisableNext(false) : setDisableNext(true);
  Object.keys(touched).length === 0 ? setFormTouched(false) : setFormTouched(true);
  return (
    <div className="other-info-container">
      <p>The Filipino sponsor is the principal of the school, the head librarian of a community library, or the person in charge of a daycare.</p>
      <label htmlFor="ph-first-name">First Name</label>
      <input
        id="ph-first-name"
        name="firstName"
        data-tag="PHContact"
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

      <label htmlFor="ph-last-name">Last Name</label>
      <input
        id="ph-last-name"
        name="lastName"
        data-tag="PHContact"
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

      <label htmlFor="ph-email">Email</label>
      <input
        id="ph-email"
        name="email"
        data-tag="PHContact"
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

      <label htmlFor="ph-phone">Phone</label>
      <input
        id="ph-phone"
        name="phone"
        data-tag="PHContact"
        type="phone"
        value={values.phone}
        placeholder="PH Phone Number"
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

export default PHSponsorDetails;
