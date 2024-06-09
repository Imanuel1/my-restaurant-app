import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import "./Login.css";
// import { makeStyles } from '@mui/styles'; // Import for styling

interface LoginFormData {
  email: string;
  password: string;
}

const validationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

// const useStyles = makeStyles((theme) => ({
//   errorInput: {
//     borderColor: theme.palette.error.main, // Use MUI's error color
//     borderWidth: '2px',
//   },
// }));

const LoginForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  // const classes = useStyles(); // Get styles

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data: LoginFormData) => {
    setSubmitted(true);
    console.log(data); // Replace with your login logic (e.g., API call)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email', { required: true })}
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
        className={errors.email ? 'errorInput' : ''} // Apply class conditionally
      />
      <TextField
        {...register('password', { required: true })}
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        className={errors.password ? 'errorInput' : ''}
      />
      <Button type="submit" variant="contained" disabled={submitted}>
        Login
      </Button>
      {submitted && <p>Login successful! (placeholder for now)</p>}
    </form>
  );
};

export default LoginForm;
