import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { Link, useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  // Roles with their Russian equivalents
  const roles = {
    'ROLE_ADMIN': 'АДМИН',
    'ROLE_DOCTOR': 'ДОКТОР',
    'ROLE_PATIENT': 'ПАЦИЕНТ',
    'ROLE_GUEST': 'ГОСТЬ'
  };

  // Fetch all users initially and then fetch based on role when "Поиск" is clicked
  useEffect(() => {
    document.title = "Панель администратора";
    fetchData('');
  }, []);

  const fetchData = async (role) => {
    try {
      const query = role ? `?role=${role}` : '';
      const result = await axios.get(`/admin${query}`);
      setUsers(result.data.userResponses);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSearch = () => {
    fetchData(selectedRole); // Fetch data based on the selected role when "Поиск" is clicked
  };

  const getIdByRole = async (userLogin, userRole, userId) => {
    try {
      if (userRole === 'ROLE_PATIENT') {
        const response = await axios.get(`/patient?email=${userLogin}`);
        navigate(`/admin/patient/edit/${response.data.id}`);
      } else if (userRole === 'ROLE_DOCTOR') {
        const response = await axios.get(`/doctor?email=${userLogin}`);
        navigate(`/admin/doctor/edit/${response.data.id}`);
      } else {
        navigate(`/admin/guest/edit/${userId}`);
        console.error('Invalid user role');
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const handleEdit = (user) => {
    getIdByRole(user.login, user.role, user.id);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/admin/user/delete/${userId}`);
      setUsers(users => users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 233px - 67.6px)' }}>
        <div className="col-12 text-center mt-3">
          <Link className="btn btn-outline-primary col-5" to="/admin/patient/new">Добавить пациента</Link>
          <Link className="btn btn-outline-primary col-5" to="/admin/doctor/new">Добавить врача</Link>
        </div>
        <h3 className="text-center mt-4">Список пользователей</h3>
        <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
          <div className="input-group mb-3">
            <select className="form-select" value={selectedRole} onChange={handleRoleChange}>
              <option value="">Все роли</option>
              {Object.entries(roles).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>Поиск</button>
          </div>
        </div>
        <table className="table table-bordered table-striped table-hover border-dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Имя пользователя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{`${user.lastName || ''} ${user.firstName || ''} ${user.middleName || ''}`}</td>
                <td>{user.login}</td>
                <td>{roles[user.role]}</td>
                <td className="text-center">
                  <button className="btn btn-link" onClick={() => handleEdit(user)}>Изменить</button>
                </td>
                <td className="text-center">
                  <button className="btn btn-link" onClick={() => handleDelete(user.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
}

export default AdminPanel;
