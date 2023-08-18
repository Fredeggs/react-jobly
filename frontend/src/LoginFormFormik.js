import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "./schemas/loginSchema";
function LoginForm({ login }) {
  const history = useHistory();
  const onSubmit = async (e) => {
    e.preventDefault();
    await login({
      email: values.email,
      password: values.password,
    });
    history.push("/");
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
    });
  return (
    <div className="form">
      <div className="form-container">
        <div className="header">
          <h1>Login</h1>
        </div>
        <div className="body">
          <form className="signup-container">
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

export default LoginForm;
