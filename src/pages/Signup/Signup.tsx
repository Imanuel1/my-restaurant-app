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
  lastName: string;
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
  lastName: yup.string().required("Last name is required"),
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
    const { email, name, lastName, password } = data;
    signup({ email, name, lastName, password });
    setSubmitted(true);
    console.log(data); // Replace with your form submission logic
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
        label="Email"
        error={!!errors.email} // Concise error handling
        helperText={errors.email?.message} // Display specific error message
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("name", { required: true, maxLength: 20 })}
        label="Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("lastName", { required: true })}
        label="Last Name"
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("password", { required: true })}
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <TextField
        {...register("confirmPassword", { required: true })}
        label="Confirm Password"
        type="password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        className={errors.password ? "errorInput" : ""}
      />
      <Button type="submit" variant="contained" disabled={submitted}>
        Sign Up
      </Button>
      {submitted && <p>Form submitted successfully!</p>}
    </form>
  );
};

export default SignupForm;
