import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
    const { guestId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        login: '',
        password: '' // Assume password needs to be reset or left blank
    });

    useEffect(() => {
        document.title = "Изменение данных пользователя";
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/admin/user/edit/${guestId}`);
                setUser({
                    lastName: response.data.lastName,
                    firstName: response.data.firstName,
                    middleName: response.data.middleName,
                    login: response.data.login,
                    password: '' // Don't fetch passwords for security reasons
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [guestId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/admin/user/edit/${guestId}`, user);
            navigate('/admin'); // Redirect to the admin page after successful update
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="container auth-form col-xl-4 col-lg-6 col-md-8 col-sm-11 my-5">
                <form className="m-4" onSubmit={handleSubmit}>
                    <h4 className="text-center">Изменить данные пользователя</h4>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Фамилия</label>
                        <input type="text" className="form-control" name="lastName" id="lastName" value={user.lastName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Имя</label>
                        <input type="text" className="form-control" name="firstName" id="firstName" value={user.firstName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="middleName" className="form-label">Отчество</label>
                        <input type="text" className="form-control" name="middleName" id="middleName" value={user.middleName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">Адрес электронной почты</label>
                        <input type="email" className="form-control" name="login" id="login" value={user.login} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Пароль</label>
                        <input type="password" className="form-control" name="password" id="password" required value={user.password} onChange={handleChange} />
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

export default EditUser;
