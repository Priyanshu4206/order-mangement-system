import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, Alert } from 'antd';
import useStore from '../store';

function LoginPage() {
  const login = useStore(state => state.login);
  const loading = useStore(state => state.loading);
  const error = useStore(state => state.error);
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (e) {
      // error handled in store
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Typography.Title level={3}>Login</Typography.Title>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ role }}>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email' }]}><Input /></Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}><Input.Password /></Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>Login</Button>
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} style={{ marginTop: 16 }} />}
    </div>
  );
}

export default LoginPage; 