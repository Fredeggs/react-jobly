import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { signupSchema } from "./schemas/signupSchema";

function SignupForm({ signup }) {
  const history = useHistory();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "+63",
      },
      validationSchema: signupSchema,
    });
  const onSubmit = async (e) => {
    e.preventDefault();
    await signup({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      email: values.email,
      password: values.password,
    });
    history.push("/");
  };
  return (
    <div className="form">
      <div
        className="form-container"
        style={{ height: `${600 + Object.keys(errors).length * 30}px` }}
      >
        <div className="header">
          <h1>Sign Up</h1>
        </div>
        <div className="body">
          <form className="signup-container">
            <label htmlFor="firstName">First Name</label>
            <input
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
              id="firstName"
              type="text"
              className={
                errors.firstName && touched.firstName ? "input-error" : ""
              }
            />
            {errors.firstName && touched.firstName && (
              <p className="error">{errors.firstName}</p>
            )}

            <label htmlFor="lastName">Last Name</label>
            <input
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
              id="lastName"
              type="lastName"
              className={
                errors.lastName && touched.lastName ? "input-error" : ""
              }
            />
            {errors.lastName && touched.lastName && (
              <p className="error">{errors.lastName}</p>
            )}

            <label htmlFor="phone">Phone</label>
            <input
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              id="phone"
              type="tel"
              className={errors.phone && touched.phone ? "input-error" : ""}
            />
            {errors.phone && touched.phone && (
              <p className="error">{errors.phone}</p>
            )}

            <label htmlFor="email">Email</label>
            <input
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              id="email"
              type="email"
              className={errors.email && touched.email ? "input-error" : ""}
            />
            {errors.email && touched.email && (
              <p className="error">{errors.email}</p>
            )}

            <label htmlFor="password">Password</label>
            <input
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              id="password"
              type="password"
              className={
                errors.password && touched.password ? "input-error" : ""
              }
            />
            {errors.password && touched.password && (
              <p className="error">{errors.password}</p>
            )}

            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              value={values.confirmPassword}
              onBlur={handleBlur}
              onChange={handleChange}
              id="confirmPassword"
              type="password"
              className={
                errors.confirmPassword && touched.confirmPassword
                  ? "input-error"
                  : ""
              }
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </form>
        </div>
        <div className="footer">
          {/* The button should be grey'd out if there is incorrect/invalid inputs or if all of the input fields have not been touched */}
          <button
            onClick={onSubmit}
            disabled={
              Object.keys(errors).length > 0 ||
              Object.keys(touched).length === 0
            }
            style={
              Object.keys(errors).length > 0 ||
              Object.keys(touched).length === 0
                ? { backgroundColor: "grey" }
                : {}
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
