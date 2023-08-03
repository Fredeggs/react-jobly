import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

function PrimaryAddressDetails({ formik, setFormTouched, setDisableNext, regionOptions, provinceOptions }) {
  const { values, handleChange, errors, touched, handleBlur } = formik;
  Object.keys(errors).length === 0 ? setDisableNext(false) : setDisableNext(true);
  Object.keys(touched).length === 0 ? setFormTouched(false) : setFormTouched(true);
  return (
    <div className="primary-address-container">
      <label htmlFor="p-street">Street Address</label>
      <input
        id="p-street"
        name="street"
        data-tag="primaryAddress"
        type="text"
        value={values.street}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.street && touched.street ? "input-error" : ""
        }
      />
      {errors.street && touched.street && (
        <p className="error">{errors.street}</p>
      )}

      <label htmlFor="p-barangay">Barangay</label>
      <input
        id="p-barangay"
        name="barangay"
        data-tag="primaryAddress"
        type="text"
        value={values.barangay}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.barangay && touched.barangay ? "input-error" : ""
        }
      />
      {errors.barangay && touched.barangay && (
        <p className="error">{errors.barangay}</p>
      )}

      <label htmlFor="p-city">City or Municipality</label>
      <input
        id="p-city"
        name="city"
        data-tag="primaryAddress"
        type="text"
        value={values.city}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.city && touched.city ? "input-error" : ""
        }
      />
      {errors.city && touched.city && (
        <p className="error">{errors.city}</p>
      )}

      <label htmlFor="p-province">Province</label>
      <select
        id="p-province"
        name="provinceId"
        data-tag="primaryAddress"
        type="select"
        value={values.provinceId}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.provinceId && touched.provinceId ? "input-error" : ""
        }
      >
        {provinceOptions.map((option) => {
          return (
            <option key={"pp-" + option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
      {errors.provinceId && touched.provinceId && (
        <p className="error">{errors.provinceId}</p>
      )}

      <label htmlFor="p-region">Region</label>
      <select
        id="p-region"
        name="regionId"
        data-tag="primaryAddress"
        type="select"
        value={values.regionId}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.regionId && touched.regionId ? "input-error" : ""
        }
      >
        {regionOptions.map((option) => {
          return (
            <option key={"pr-" + option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
      {errors.regionId && touched.regionId && (
        <p className="error">{errors.regionId}</p>
      )}
    </div>
  );
}

export default PrimaryAddressDetails;
