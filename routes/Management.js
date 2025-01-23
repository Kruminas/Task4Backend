import React, { useState, useEffect } from 'react';
import axios from 'axios';
const User = require("../models/user");

const router = express.Router();
const Management = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    }
  };
  
  router.post("/block", async (req, res) => {
    const { userIds } = req.body;
    try {
      await User.updateMany({ _id: { $in: userIds } }, { blocked: true });
      res.status(200).json({ message: "Users blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error blocking users", error });
    }
  });
  
  router.post("/unblock", async (req, res) => {
    const { userIds } = req.body;
    try {
      await User.updateMany({ _id: { $in: userIds } }, { blocked: false });
      res.status(200).json({ message: "Users unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error unblocking users", error });
    }
  });
  
  module.exports = router;
  
  return (
    <div>
      <h2>User Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default Management;