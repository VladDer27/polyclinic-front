import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useParams, useNavigate } from 'react-router-dom';

function EditPatient() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: '',
        login: '',
        password: '' // Assume password needs to be reset or left blank
    });
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        document.title = "Изменение данных пациента";
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`/admin/patient/edit/${patientId}`);
                setPatient({
                    lastName: response.data.userResponse.lastName,
                    firstName: response.data.userResponse.firstName,
                    middleName: response.data.userResponse.middleName,
                    dateOfBirth: response.data.dateOfBirth,
                    gender: response.data.gender,
                    login: response.data.userResponse.login,
                    password: '' // Don't fetch passwords
                });
                setGenders([{ name: 'MALE', label: 'Мужской' }, { name: 'FEMALE', label: 'Женский' }]); // Mocked genders if not provided by API
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatientData();
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
            await axios.put(`/admin/patient/edit/${patientId}`, patient);
            navigate('/admin'); // Redirect to the homepage after successful update
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
                        <label htmlFor="lastName" className="form-label">Фамилия</label>
                        <input type="text" className="form-control" name="lastName" id="lastName" value={patient.lastName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Имя</label>
                        <input type="text" className="form-control" name="firstName" id="firstName" value={patient.firstName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="middleName" className="form-label">Отчество</label>
                        <input type="text" className="form-control" name="middleName" id="middleName" value={patient.middleName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">Дата рождения</label>
                        <input type="date" className="form-control" name="dateOfBirth" id="dateOfBirth" value={patient.dateOfBirth} onChange={handleChange} />
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
                        <label htmlFor="login" className="form-label">Адрес электронной почты</label>
                        <input type="email" className="form-control" name="login" id="login" value={patient.login} onChange={handleChange} />
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
}

export default EditPatient;
