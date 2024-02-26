import * as Yup from "yup";

function isStrongPassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
  return hasUpperCase && hasLowerCase && hasDigit && hasSpecialCharacter;
}

export const gender = ["male", "female"];

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export const loginForm = {
  initialValues: {
    email: "",
    password: "",
  },
  validationSchema: loginSchema,
};

const signupSchema = Yup.object({
  name: Yup.string()
    .min(5, "should be of minimum 5 characters length")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
    .test(
      "is-strong-password",
      "Password must contain one each of lowercase, uppercase and special character",
      (value) => isStrongPassword(value)
    ),
  password_confirmation: Yup.string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
  gender: Yup.string().oneOf(gender).required("Gender is required"),
  location: Yup.string()
    .min(8, "location should be of minimum 8 characters length")
    .required("location is required"),
});

export const signupForm = {
  initialValues: {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    location: "",
    gender: gender[0],
  },
  validationSchema: signupSchema,
};
