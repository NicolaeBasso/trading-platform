import React, { useEffect, useState } from 'react';
import { Button, Input, Paper, Text } from '@mantine/core';
import { Link, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AuthAPI } from '../api/auth';

export const Register = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    AuthAPI.register(form).then((result) => {
      const { status } = result;
      if (status === 201) navigate('/login');
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper style={{ width: 400, padding: 40 }}>
        <Text size='xl' style={{ marginBottom: 20 }}>
          Register
        </Text>
        <form onSubmit={handleSubmit}>
          <Input
            type='email'
            required
            placeholder='Enter your email'
            style={{ marginBottom: 20 }}
            onChange={(data) => {
              setForm({ ...form, email: data.target.value });
            }}
          />
          <Input
            type='password'
            required
            placeholder='Enter your password'
            style={{ marginBottom: 20 }}
            onChange={(data) => {
              setForm({ ...form, password: data.target.value });
            }}
          />
          <Button type='submit' variant='outline'>
            Register
          </Button>
        </form>
        <div style={{ marginTop: 20 }}>
          Already have an account? <Link to='/login'>Login here</Link>
        </div>
      </Paper>
    </div>
  );
};
