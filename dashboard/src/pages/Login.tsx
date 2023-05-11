import React, { useEffect, useState } from 'react';
import { Button, Input, Paper, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/auth';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    AuthAPI.login(form).then((result) => {
      const { status } = result;
      if (status === 200) navigate('/dashboard');
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper style={{ width: 400, padding: 40 }}>
        <Text size='xl' style={{ marginBottom: 20 }}>
          Login
        </Text>
        <form onSubmit={handleSubmit}>
          <Input
            name='email'
            type='email'
            required
            placeholder='Enter your email'
            style={{ marginBottom: 20 }}
            value={form.email}
            onChange={(data) => {
              setForm({ ...form, email: data.target.value });
            }}
          />
          <Input
            name='password'
            type='password'
            required
            placeholder='Enter your password'
            style={{ marginBottom: 20 }}
            onChange={(data) => {
              setForm({ ...form, password: data.target.value });
            }}
          />
          <Button type='submit' variant='outline'>
            Login
          </Button>
        </form>
        <div style={{ marginTop: 20 }}>
          Don't have an account? <Link to='/register'>Register here</Link>
        </div>
      </Paper>
    </div>
  );
};
