import * as yup from "yup";

const phoneRegex = /^(\+63)\d{10}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRegex, {
      message:
        "Password must be a minimum of 5 characters, have 1 uppercase letter, 1 lowercase letter, and 1 numeric digit",
    })
    .required("Password is required"),
});
