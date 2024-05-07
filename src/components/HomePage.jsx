import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import axios from '../api/axiosConfig';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [id, setId] = useState(null);
  
    useEffect(() => {
      // Проверяем наличие токена при монтировании компонента
      const token = localStorage.getItem('auth_token');
      if (token) {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setId()
        setUserRole(decoded.a[0]);
        getIdByRole(decoded.exp, decoded.a[0], token);
      }
  }, []); 

  const getIdByRole = async (userLogin, userRole, token) => {
    try {
        if (userRole === 'ROLE_GUEST') {
            console.log(userLogin, userRole);
            setId(jwtDecode(token).sub);
        } else if (userRole === 'ROLE_PATIENT') {
          const response = await axios.get(`/patient?email=${userLogin}`);
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
      <>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 233px - 67.6px)', display: 'flex', alignItems: 'center' }} className="mt-5 mb-5">
          <div className="index-message container pb-3">
            <div className="row">
              <div className="clo-12">
              <h2 className="text-center text-uppercase mb-5" style={{ color: 'lightgray' }}>Добро пожаловать!</h2>
              </div>
            </div>
            <div className="row">
            <div className="col-xl-3 col-lg-12 text-center">
                <img src="/CMO.png" alt="Главный врач" className="img-fluid chief-med-officer-img" />
            </div>
              <div className="col-xl-9 col-lg-12">
                <h4>Главный врач клиники Vitality</h4>
                <p>Уважаемые пациенты!</p>
                <p>Я рад приветствовать вас на странице нашей поликлиники. Наша команда делает все возможное, чтобы обеспечить вас лучшими медицинскими услугами.</p>
                <p>Все наши сотрудники готовы предоставить вам профессиональную и квалифицированную помощь в любой ситуации. Ваше здоровье является нашим приоритетом, и мы готовы сделать все, что в наших силах, чтобы обеспечить вас лучшей медицинской помощью.</p>
                <p>Мы предоставляем широкий спектр медицинских услуг, включая диагностику, лечение и профилактику различных заболеваний. Мы работаем с самыми современными технологиями и методиками лечения, чтобы обеспечить вам максимально эффективное и комфортное лечение.</p>
                <p>Мы надеемся, что наша поликлиника станет вашим надежным партнером в поддержании здоровья. Желаем вам здоровья и благополучия!</p>
                <p>С уважением, Константин Игоревич Петров</p>
                {isLoggedIn ? (
                    userRole === 'ROLE_GUEST' ? 
                        <Link to={`/guest/edit/${id}`} className="btn btn-primary mb-1">Записаться на прием</Link> :
                    userRole === 'ROLE_PATIENT' ? 
                        <Link to={"/appointment/schedule/0"} className="btn btn-primary mb-1">Записаться на прием</Link> :
                    null // Для случая, когда роль пользователя - доктор
                ) : (
                    <Link to="/login" className="btn btn-primary mb-1">Записаться на прием</Link>
                )}

              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  export default HomePage;