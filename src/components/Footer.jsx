import React from 'react';

function Footer() {
  return (
    <footer className="overflow-hidden pt-4 pt-md-5 pb-3 bg-light border-top">
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <h5>Партнеры и спонсоры</h5>
            <ul className="text-small text-start">
              <li><a href="https://genetico.ru/" className="link-secondary">Genetico</a></li>
              <li><a href="https://www.biocad.ru/" className="link-secondary">Биокад</a></li>
              <li><a href="https://www.generium.ru/" className="link-secondary">Generium</a></li>
              <li><a href="https://www.rfs.ru/" className="link-secondary">Федерация футбола России</a></li>
            </ul>
          </div>
          <div className="col-sm-6 col-md-4">
            <h5>Берегите себя</h5>
            <ul className=" text-small text-start">
              <li><a href="https://xn----8sbehgcimb3cfabqj3b.xn--p1ai/" className="link-secondary">Правильное питание и здоровый образ жизни</a></li>
              <li><a href="https://www.who.int/immunization/diseases/en/" className="link-secondary">Вакцинация и профилактика заболеваний</a></li>
              <li><a href="https://www.nlm.nih.gov/medlineplus/healthyliving.html" className="link-secondary">Уход за здоровьем в различных возрастных категориях</a></li>
              <li><a href="https://medlineplus.gov/ency/patientinstructions/000655.htm" className="link-secondary">Медицинский справочник</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Контактная информация</h5>
            <ul className=" text-small text-start">
              <li>Адрес: Москва, ул. Профсоюзная, д. 115</li>
              <li>Запись на прием: <a href="tel:+74951234567" className="link-primary">+7 (495) 123-45-67</a></li>
              <li>Справочная служба: <a href="tel:+74957654321" className="link-primary">+7 (495) 765-43-21</a></li>
              <li>Электронная почта: <a href="mailto:vitality-clinic@yandex.ru" className="link-primary">vitality-clinic@yandex.ru</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
