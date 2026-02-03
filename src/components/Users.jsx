//My users accounts

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //
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
  // Update this function in your Users component
const validatePassword = (user) => {
  if (loginPassword === user.password) {
    alert(`Welcome ${user.name} ${user.surname}! Login successful.`);
    setLoginUserId(null);
    setLoginPassword('');
    // Navigate to account page with user ID
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
    //<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <div className="usertab">
      <h1></h1>

      {/* Create/Update Form */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleInputChange}
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ margin: '5px', padding: '8px' }}
          />
          <button type="submit" style={{ margin: '5px', padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ margin: '5px', padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Users Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>User ID</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Surname</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.userID}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.surname}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                <button 
                  onClick={() => handleEdit(user)}
                  style={{ margin: '2px', padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(user.userID)}
                  style={{ margin: '2px', padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
                <button 
                  onClick={() => handleLogin(user)}
                  style={{ margin: '2px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Enter Account
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Password Validation Modal */}
      {loginUserId && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '30px', border: '2px solid #333', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3>Enter Password</h3>
          <p>User: {users.find(u => u.userID === loginUserId)?.name} {users.find(u => u.userID === loginUserId)?.surname}</p>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <button 
            onClick={() => validatePassword(users.find(u => u.userID === loginUserId))}
            style={{ margin: '5px', padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
          <button 
            onClick={() => { setLoginUserId(null); setLoginPassword(''); }}
            style={{ margin: '5px', padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;
