import * as yup from "yup";

const regex = /^(\+1)\d{10}$/;

export const USContactDetailsSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name required"),
  lastName: yup
  .string()
  .required("Last name required"),
  email: yup
  .string()
  .email("Please enter a valid email (example: email@gmail.com")
  .required("Email required"),
  phone: yup
    .string()
    .matches(regex, "Phone number should start with +1 followed by 10 digits")
    .required("Phone required"),
});
