import * as yup from "yup";

const phoneRegex = /^(\+63)\d{10}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const signupSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  phone: yup
    .string()
    .matches(
      phoneRegex,
      "Phone number should start with +63 followed by 10 digits"
    )
    .required("Phone required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRegex, {
      message:
        "Password must be a minimum of 5 characters, have 1 uppercase letter, 1 lowercase letter, and 1 numeric digit",
    })
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
