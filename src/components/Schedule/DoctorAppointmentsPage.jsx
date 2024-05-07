import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AppointmentPage() {
    const { doctorId, date } = useParams();
    const nav = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [availableTime, setAvailableTime] = useState([]);
    const [id, setId] = useState(null);

    const specialties = {
        GASTROENTEROLOGY: 'Гастроэнтеролог',
        HEMATOLOGY: 'Гематолог',
        GYNECOLOGY: 'Гинеколог',
        DERMATOLOGY: 'Дерматолог',
        CARDIOLOGY: 'Кардиолог',
        NEUROLOGY: 'Невролог',
        NEPHROLOGY: 'Нефролог',
        ONCOLOGY: 'Онколог',
        ORTHOPEDICS: 'Ортопед',
        OTORHINOLARYNGOLOGY: 'Отоларинголог',
        OPHTHALMOLOGY: 'Офтальмолог',
        PEDIATRICS: 'Педиатр',
        PSYCHIATRY: 'Психиатр',
        UROLOGY: 'Уролог',
        ENDOCRINOLOGY: 'Эндокринолог'
    };

    document.title = `Запись к ${specialties[doctor?.speciality] || ''}у`;

    const getIdByRole = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            const userLogin = jwtDecode(token).e;
            try {
                const response = await axios.get(`/patient?email=${userLogin}`);
                setId(response.data.id);
                console.log('ID ебаного пользователя:', response.data.id);
        
                
            } catch (error) {
                console.error('Ошибка при получении ID пользователя:', error);
            }
        }
    };

    useEffect(() => {
        getIdByRole();
        const fetchDoctorSchedule = async () => {
            try {
                const response = await axios.get(`/appointment/schedule/${doctorId}/${date}`);
                setDoctor(response.data.doctorResponse);
                setAvailableTime(response.data.availableTime);
            } catch (error) {
                console.error('Error fetching doctor schedule:', error);
            }
        };

        fetchDoctorSchedule();
    }, [doctorId, date]);

    const handleSubmit = async (event, time) => {
        event.preventDefault();
        try {
            await axios.post('/appointment/new', null, {
                params: {
                    doctorId: doctor.id,
                    patientId: id, // Note: Ensure this is correct; usually, patientId should be different.
                    date: date,
                    startTime: time
                }
            });
            nav("/home");
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    };

    if (!doctor) {
        return <div>Loading...</div>;
    }

    const formatAppointmentTime = (time) => {
        const startTime = new Date(new Date(date).setHours(time.split(':')[0], time.split(':')[1], 0));
        const endTime = new Date(startTime.getTime() + doctor.appointmentDuration * 60000);
        return `${startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div>
            <Header />

            <main style={{ minHeight: '90vh' }} className="pt-5">
                <div className="container">
                    <table className="table table-bordered border-dark text-center mt-5 bg-light">
                        <thead>
                            <tr>
                                <th colSpan="2" className="text-center">Пожалуйста, выберите время, на которое Вы хотите сделать запись.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowSpan="2" className="align-middle">
                                    {doctor.userResponse.lastName || ''} {doctor.userResponse.firstName || ''} {doctor.userResponse.middleName || ''}
                                </td>
                                <td>
                                    Запись на {new Intl.DateTimeFormat('ru').format(new Date(date))}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {availableTime.length === 0 ? (
                                        <span>Нет свободного времени для записи</span>
                                    ) : (
                                        <ul className="list-unstyled">
                                            {availableTime.map(time => (
                                                <li key={time}>
                                                    <form className="d-inline" onSubmit={(e) => handleSubmit(e, time)}>
                                                        <button type="submit" className="btn btn-transparent">
                                                            {formatAppointmentTime(time)}
                                                        </button>
                                                    </form>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AppointmentPage;
