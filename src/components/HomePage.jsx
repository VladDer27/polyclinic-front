import React from 'react';
import Header from './Header';
import Footer from './Footer';

function HomePage() {
    return (
      <>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 233px - 67.6px)', display: 'flex', alignItems: 'center' }} className="mt-5 mb-5">
          <div className="index-message container pb-3">
            <div className="row">
              <div className="clo-12">
                <h2 className="text-center text-uppercase mb-5" style={{ color: 'lightgray' }}></h2>
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
                <a href="/auth/login" className="btn btn-primary mb-1">Записаться на прием</a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  export default HomePage;