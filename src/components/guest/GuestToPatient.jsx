import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { setAuthToken } from '../../utils/auth';

function PatientDataForm() {
    const { guestId } = useParams(); // Correctly destructure the guestId from the params
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: ''
    });
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`guest/edit/${guestId}`);
                setFormData({
                    lastName: response.data.userResponse.lastName || '',
                    firstName: response.data.userResponse.firstName || '',
                    middleName: response.data.userResponse.middleName || '',
                    dateOfBirth: response.data.dateOfBirth || '',
                    gender: response.data.gender || ''
                });
                setGenders([{ name: 'MALE', label: 'Мужской' }, { name: 'FEMALE', label: 'Женский' }]); // Example static genders
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        document.title = "Внести данные";
    }, [guestId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`guest/edit/${guestId}`, formData);;
            setAuthToken(response.data.accessToken); // Set the token in local storage
            console.log(response.data.accessToken);
            navigate('/'); // Redirect to the homepage
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Ошибка при отправке данных');
        }
    };

    return (
        <>
            <Header />
            <div className="container my-5">
                <form onSubmit={handleSubmit} className="auth-form col-xl-4 col-lg-6 col-md-8 col-sm-11 mx-auto">
                    <h4 className="text-center mb-4">Заполните, пожалуйста, следующие поля</h4>
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Фамилия</label>
                        <input type="text" className="form-control" id="last_name" name="lastName"
                                required value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">Имя</label>
                        <input type="text" className="form-control" id="first_name" name="firstName"
                                required value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="middle_name" className="form-label">Отчество</label>
                        <input type="text" className="form-control" id="middle_name" name="middleName"
                                value={formData.middleName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date-of-birth" className="form-label">Дата рождения</label>
                        <input type="date" className="form-control" id="date-of-birth" name="dateOfBirth"
                                required value={formData.dateOfBirth} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Пол</label>
                        <select className="form-select" id="gender" name="gender"
                                value={formData.gender} onChange={handleChange}>
                            {genders.map(gender => (
                                <option key={gender.name} value={gender.name}>{gender.label}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default PatientDataForm;
