import * as yup from "yup";

export const basicLibraryDetailsSchema = yup.object().shape({
  libraryName: yup
    .string()
    .min(2, "Library Name must be at least 2 characters long")
    .required("Required"),
  libraryType: yup
    .string()
    .oneOf(["day care", "elementary school", "high school", "community"])
    .required("Required"),
  classrooms: yup.number().moreThan(-1, "Please enter a non-negative number"),
  teachers: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
  studentsPerGrade: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
  totalResidents: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
  elementaryVisitors: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
  highSchoolVisitors: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
  collegeVisitors: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
  adultVisitors: yup
    .number()
    .integer("Please enter whole numbers only")
    .moreThan(-1, "Please enter a non-negative number"),
});
