import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import axios from '../api/axiosConfig';

function Header() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [id, setId] = useState(null);
  
  useEffect(() => {
      // Проверяем наличие токена при монтировании компонента
      const token = localStorage.getItem('auth_token');
      if (token) {
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decoded.a[0]);
          getIdByRole(decoded.e, decoded.a[0]);
      }
  }, []); 
  
  const handleLogout = () => {
      localStorage.removeItem('auth_token');
      navigate('/');
      window.location.reload();
  };
  
  const handleLogin = () => {
      navigate('/login');
  };
  
  
  const getIdByRole = async (userLogin, userRole) => {
      try {
          if (userRole === 'ROLE_PATIENT') {
              console.log(userLogin, userRole);
              const response = await axios.get(`/patient?email=${userLogin}`);
              setId(response.data.id);
              console.log('ID пользователя:', response.data.id);
          } else if (userRole === 'ROLE_DOCTOR') {
            const response = await axios.get(`/doctor?email=${userLogin}`);
            setId(response.data.id);
            console.log('ID пользователя:', response.data.id);  
          } else {
              console.error('Недопустимая роль пользователя');
              return;
          }
  
          
      } catch (error) {
          console.error('Ошибка при получении ID пользователя:', error);
      }
  };
  

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
        <a className="navbar-brand" href="/home">
            <img src={process.env.PUBLIC_URL + '/logo.png'} width="43" alt="Logo" />
        </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/home">Главная</a>
              </li>
              {isLoggedIn ? (
                <>
                {userRole === 'ROLE_ADMIN' && 
                    <li className="nav-item">
                    <a className="nav-link" href="/admin">Панель администратора</a>
                </li>}
                {userRole === 'ROLE_PATIENT' && 
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to={`/patient/edit/${id}`}>Изменить профиль</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={`/patient/appointments/${id}`}>Мои записи</Link>
                    </li>
                </>}
                {userRole === 'ROLE_DOCTOR' && <li className="nav-item">
                    <Link className="nav-link" to={`/doctor/appointments/${id}`}>Запланированные приемы</Link>
                </li>}
                <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>Выйти</button>
                </li>
                </>
              ) : (
                <li className="nav-item">
                    <button className="nav-link" onClick={handleLogin}>Войти в аккаунт</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
