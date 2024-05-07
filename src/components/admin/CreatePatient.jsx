import React, { useState } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

function AddPatient() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: '',
        login: '',
        password: ''
    });

    // Assuming genders are provided from an API or a static source
    const genders = [
        { name: 'MALE', label: 'Мужской' },
        { name: 'FEMALE', label: 'Женский' }
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPatient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/admin/patient/new', patient);
            navigate('/admin'); // Navigate to the admin dashboard or patient list on successful creation
        } catch (error) {
            console.error('Failed to add new patient:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="container auth-form col-xl-4 col-lg-6 col-md-8 col-sm-11 my-5">
                <form className="m-4" onSubmit={handleSubmit}>
                    <h4 className="text-center">Новый пациент</h4>
                    {['lastName', 'firstName', 'middleName', 'login', 'password'].map(field => (
                        <div className="mb-3" key={field}>
                            <label htmlFor={field} className="form-label">{{
                                lastName: 'Фамилия',
                                firstName: 'Имя',
                                middleName: 'Отчество',
                                login: 'Адрес электронной почты',
                                password: 'Пароль'
                            }[field]}</label>
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                className="form-control"
                                id={field}
                                name={field}
                                value={patient[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className="mb-3">
                        <label htmlFor="date-of-birth" className="form-label">Дата рождения</label>
                        <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            id="date-of-birth"
                            value={patient.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Пол</label>
                        <select
                            className="form-select"
                            name="gender"
                            id="gender"
                            value={patient.gender}
                            onChange={handleChange}
                            required
                        >
                            {genders.map(gender => (
                                <option key={gender.name} value={gender.name}>{gender.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <button type="submit" className="btn btn-primary">Добавить пациента</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default AddPatient;
