import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';

function EditPatientForm() {
    const patientId = useParams().patientId;
    const [patient, setPatient] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: '',
        login: '',
        password: ''
    });
    const [genders, setGenders] = useState([]);

    const navigate = useNavigate(); 

    useEffect(() => {
        document.title = "Изменить профиль";
        const fetchPatientData = async (patientId) => {
            try {
                const response = await axios.get(`/patient/edit/${patientId}`);
                setPatient({
                    lastName: response.data.userResponse.lastName,
                    firstName: response.data.userResponse.firstName,
                    middleName: response.data.userResponse.middleName,
                    dateOfBirth: response.data.dateOfBirth,
                    gender: response.data.gender,
                    login: response.data.userResponse.login,
                    password: '' // Don't fetch passwords
                });
                // Assuming `genders` is a predefined list since your backend doesn't seem to provide it
                setGenders([{ name: 'MALE', label: 'Мужской' }, { name: 'FEMALE', label: 'Женский' }]);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };
    
        if (patientId) {
            fetchPatientData(patientId);
        }
    }, [patientId]);
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPatient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/patient/edit/${patientId}`, patient);
            navigate('/'); // Redirect to the homepage
            window.location.reload();
        } catch (error) {
            console.error('Error updating patient data:', error);
        }
    };

    return (
        <>
        <Header />
        <div className="container auth-form col-xl-4 col-lg-6 col-md-8 col-sm-11 my-5">
            <form className="m-4" onSubmit={handleSubmit}>
                <h4 className="text-center">Изменить данные пациента</h4>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Фамилия</label>
                    <input type="text" className="form-control" name="lastName" id="last_name" value={patient.lastName} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">Имя</label>
                    <input type="text" className="form-control" name="firstName" id="first_name" value={patient.firstName} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="middle_name" className="form-label">Отчество</label>
                    <input type="text" className="form-control" name="middleName" id="middle_name" value={patient.middleName} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="date-of-birth" className="form-label">Дата рождения</label>
                    <input type="date" className="form-control" name="dateOfBirth" id="date-of-birth" value={patient.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Пол</label>
                    <select className="form-select" name="gender" id="gender" value={patient.gender} onChange={handleChange}>
                        {genders.map(gender => (
                            <option key={gender.name} value={gender.name}>{gender.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Адрес электронной почты</label>
                    <input type="email" className="form-control" name="login" id="username" value={patient.login} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input type="password" className="form-control" name="password" id="password" value={patient.password} onChange={handleChange} />
                </div>
                <div className="col">
                    <button type="submit" className="btn btn-primary">Изменить данные</button>
                </div>
            </form>
        </div>
        <Footer />
        </>
    );
};

export default EditPatientForm;
