//My users accounts

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customersData from './Customers'; 
import './users.scss'

const Users = () => {
    const navigate = useNavigate();
  const [users, setUsers] = useState(customersData);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    userID: '',
    name: '',
    surname: '',
    email: '',
    password: ''
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [loginUserId, setLoginUserId] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create new user
  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      alert('Please fill all fields');
      return;
    }
    const newUser = {
      ...formData,
      userID: users.length > 0 ? Math.max(...users.map(u => u.userID)) + 1 : 1
    };
    setUsers([...users, newUser]);
    resetForm();
  };

  // Update user
  const handleUpdate = (e) => {
    e.preventDefault();
    setUsers(users.map(user => 
      user.userID === editingId ? { ...formData, userID: editingId } : user
    ));
    resetForm();
  };

  // Delete user
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.userID !== id));
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingId(user.userID);
    setFormData(user);
  };

  // Login validation
  const handleLogin = (user) => {
    setLoginUserId(user.userID);
    setLoginPassword('');
  };

  const validatePassword = (user) => {
    if (loginPassword === user.password) {
      alert(`Welcome ${user.name} ${user.surname}! Login successful.`);
      setLoginUserId(null);
      setLoginPassword('');
      navigate(`/account/${user.userID}`, { state: { user } });
    } else {
      alert('Incorrect password!');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userID: '',
      name: '',
      surname: '',
      email: '',
      password: ''
    });
    setEditingId(null);
  };

  return (
    <div className="usertab">
      <h1></h1>
      <div className="user-form">
        <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button className="user-btn" type="submit">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>

      
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(user.userID)}>
                  Delete
                </button>
                <button onClick={() => handleLogin(user)}>
                  Enter Account
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {loginUserId && (
        <div className="login-user">
          <p>Enter Password - User: {users.find(u => u.userID === loginUserId) ?.name} {users.find(u => u.userID === loginUserId)?.surname}</p>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button className="login-btn" onClick={() => validatePassword(users.find(u => u.userID === loginUserId))}>
            Login
          </button>
          <button className="cancel-btn" onClick={() => { setLoginUserId(null); setLoginPassword(''); }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;