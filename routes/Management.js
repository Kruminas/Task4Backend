import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Management = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://your-heroku-backend.herokuapp.com';

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users function
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    }
  };

  // Handle checkbox change for selecting users
  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  // Block selected users
  const handleBlock = async () => {
    try {
      await axios.post(`${backendUrl}/api/block`, { userIds: selectedUsers });
      fetchUsers(); // Reload users after blocking
    } catch (error) {
      console.error('Error blocking users:', error);
      setError('Error blocking users');
    }
  };

  // Unblock selected users
  const handleUnblock = async () => {
    try {
      await axios.post(`${backendUrl}/api/unblock`, { userIds: selectedUsers });
      fetchUsers(); // Reload users after unblocking
    } catch (error) {
      console.error('Error unblocking users:', error);
      setError('Error unblocking users');
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div>
        <button onClick={handleBlock} disabled={selectedUsers.length === 0}>
          Block
        </button>
        <button onClick={handleUnblock} disabled={selectedUsers.length === 0}>
          Unblock
        </button>
      </div>
      
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <input
              type="checkbox"
              onChange={(e) => handleCheckboxChange(e, user._id)}
              checked={selectedUsers.includes(user._id)}
            />
            {user.name} ({user.email}) {user.blocked ? ' - Blocked' : ' - Active'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Management;