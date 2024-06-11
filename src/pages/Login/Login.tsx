import React, { useState, useContext } from "react";
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
import "./Login.css";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { makeStyles } from '@mui/styles'; // Import for styling

interface LoginFormData {
  email: string;
  password: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const LoginForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password);
    setSubmitted(true);
    console.log(data); // Replace with your login logic (e.g., API call)
  };

  if (submitted) {
    navigate("/menu"); // Replace "/" with your actual home page route
    // <Link to="/" />;
  }

  return (
    <form className="c-login-container" onSubmit={handleSubmit(onSubmit)}>
      <h1>התחברות למערכת</h1>
      <TextField
        {...register("email", { required: true })}
        label="Email"
        error={!!errors.email}
        helperText={
          errors.email?.message ? <span>{errors.email?.message}</span> : <></>
        }
        className={errors.email ? "errorInput" : ""} // Apply class conditionally
      />
      <TextField
        {...register("password", { required: true })}
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={
          errors.password?.message ? (
            <span>{errors.password?.message}</span>
          ) : (
            <></>
          )
        }
        className={errors.password ? "errorInput" : ""}
      />
      <Button type="submit" variant="contained" disabled={submitted}>
        Login
      </Button>
      {submitted && <p>Login successful! (placeholder for now)</p>}
    </form>
  );
};

export default LoginForm;
