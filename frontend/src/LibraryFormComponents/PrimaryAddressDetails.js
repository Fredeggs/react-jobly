import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

function PrimaryAddressDetails({ formik, regionOptions, provinceOptions }) {
  const { values, handleChange } = formik;
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
      />

      <label htmlFor="p-barangay">Barangay</label>
      <input
        id="p-barangay"
        name="barangay"
        data-tag="primaryAddress"
        type="text"
        value={values.barangay}
        onChange={handleChange}
      />

      <label htmlFor="p-city">City or Municipality</label>
      <input
        id="p-city"
        name="city"
        data-tag="primaryAddress"
        type="text"
        value={values.city}
        onChange={handleChange}
      />

      <label htmlFor="p-province">Province</label>
      <select
        id="p-province"
        name="provinceId"
        data-tag="primaryAddress"
        type="select"
        value={values.provinceId}
        onChange={handleChange}
      >
        {provinceOptions.map((option) => {
          return (
            <option key={"pp-" + option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
      <label htmlFor="p-region">Region</label>
      <select
        id="p-region"
        name="regionId"
        data-tag="primaryAddress"
        type="select"
        value={values.regionId}
        onChange={handleChange}
      >
        {regionOptions.map((option) => {
          return (
            <option key={"pr-" + option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default PrimaryAddressDetails;
