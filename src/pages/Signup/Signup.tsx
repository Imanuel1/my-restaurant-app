import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import "./Signup.css";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  email: string;
  name: string;
  birthday: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  name: yup
    .string()
    .max(20, "Name cannot exceed 20 characters")
    .required("Name is required"),
  birthday: yup
    .string()
    .required("Birthday is required")
    .matches(/^\d{2}\.\d{2}\.\d{4}$/, "Invalid birthday format (DD.MM.YYYY)"), // Birthday validation
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain lowercase, uppercase, number, and special character"
    )
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { signup } = useContext(UserContext);

  const navigate = useNavigate();
  const onSubmit = (data: SignupFormData) => {
    if (!Object.keys(errors)?.length) {
      const { email, name, birthday, password } = data;
      signup({ email, name, birthday, password });
      setSubmitted(true);
    }
    console.log("login errors: ", errors); // Replace with your login logic (e.g., API call)
    console.log("login data: ", data); // Replace with your login logic (e.g., API call)
  };

  useEffect(() => {
    if (submitted) {
      navigate("/menu"); // Replace "/" with your actual home page route
    }
  }, [submitted]);

  return (
    <form className="c-signup-container" onSubmit={handleSubmit(onSubmit)}>
      <h1>הרשמה למערכת</h1>
      <TextField
        {...register("email", { required: true })}
        label="אימייל"
        error={!!errors.email} // Concise error handling
        helperText={errors.email?.message} // Display specific error message
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("name", { required: true, maxLength: 20 })}
        label="שם מלא"
        error={!!errors.name}
        helperText={errors.name?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("birthday", { required: true })}
        label="תאריך לידה"
        placeholder="12.2.1995"
        error={!!errors.birthday}
        helperText={errors.birthday?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("password", { required: true })}
        label="סיסמה"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("confirmPassword", { required: true })}
        label="אימות סיסמה"
        type="password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <Button type="submit" variant="contained" disabled={submitted}>
        הרשמה
      </Button>
      {submitted && <p>Form submitted successfully!</p>}
    </form>
  );
};

export default SignupForm;
