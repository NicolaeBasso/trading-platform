import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Paper, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/auth';
import UserContext from '../contexts/UserContext';
import jwt_decode from 'jwt-decode';

export const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (localStorage.getItem('jwt')) navigate('/dashboard');

  useEffect(() => {
    if (localStorage.getItem('jwt') || user) navigate('/dashboard');
  }, [user, localStorage.getItem('jwt')]);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    AuthAPI.login(form).then((result) => {
      const { status } = result;
      const cookie = document.cookie;
      const jwtEncoded = cookie.substring(4);

      if ([200, 201].includes(status)) {
        const jwtDecoded = jwt_decode(jwtEncoded);
        localStorage.setItem('jwt', jwtEncoded);
        navigate('/dashboard');
        setUser(jwtDecoded);
      }
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
