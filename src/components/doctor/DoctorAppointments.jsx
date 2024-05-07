import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Footer from '../Footer';
import Header from '../Header';
import { useParams} from 'react-router-dom';

function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [dates, setDates] = useState([]);
    const { doctorId } = useParams();

    useEffect(() => {
        document.title = "Запланированные приемы";
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`/doctor/appointments/${doctorId}`);
                setAppointments(response.data.appointments.appointments);
                setDates(response.data.dates);
                console.log(response.data.dates);
                console.log(response.data.appointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [doctorId]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение отправки формы
        const formData = new FormData(event.target); // Получаем данные из формы
        const selectedDate = formData.get('date'); // Получаем выбранную дату
        try {
            // Отправляем запрос с выбранной датой
            const response = await axios.get(`/doctor/appointments/${doctorId}?date=${selectedDate}`);
            setAppointments(response.data.appointments.appointments);
            console.log(response.data.appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleCompleteAppointment = async (appointmentId) => {
        try {
            // Отправляем запрос на завершение приема
            await axios.post('/appointment/complete', null, {
                params: {
                    appointmentId: parseInt(appointmentId, 10), // Преобразовать appointmentId к типу long
                    doctorId: parseInt(doctorId, 10) // Преобразовать patientId к типу long
                }
            });
            const response = await axios.get(`/doctor/appointments/${doctorId}`);
            setAppointments(response.data.appointments.appointments);
            // Дополнительные действия после завершения приема, например, обновление списка приемов
        } catch (error) {
            console.error('Error completing appointment:', error);
        }
    };

    const gender = {
        MALE : 'Мужской',
        FEMALE : 'Женский'
    }
    

    const formatTime = (timeString, duration) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const start = new Date(0, 0, 0, hours, minutes);
        const end = new Date(start.getTime() + duration * 60000);
        const startTimeString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTimeString = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${startTimeString} - ${endTimeString}`;
    };

    return (
        <>
            <Header />
            <main className="container my-4" style={{ minHeight: '90vh' }}>
                <h2 className="mb-3">Запланированные приемы</h2>
                <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                    <form onSubmit={handleSubmit}> {/* Добавляем обработчик события onSubmit */}
                    <div className="input-group mb-3">
                        <select className="form-select" name="date" id="date">
                            <option value="" selected>Все даты</option>
                            {dates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary">Поиск</button>
                    </div>
                </form>
                </div>
                <div className="row my-4">
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="col-md-12 col-lg-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">{`${appointment.patientResponse.userResponse.lastName || ''} ${appointment.patientResponse.userResponse.firstName || ''} ${appointment.patientResponse.userResponse.middleName || ''}`}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{`Пациент №${appointment.patientResponse.id}`}</h6>
                                    <p className="card-text">
                                        Дата приема: {appointment.date}<br />
                                        Время: {formatTime(appointment.startTime, appointment.doctorResponse.appointmentDuration)}<br />
                                        Дата рождения: {appointment.patientResponse.dateOfBirth}<br />
                                        Пол: {gender[appointment.patientResponse.gender]}
                                    </p>
                                    <form onSubmit={() => handleCompleteAppointment(appointment.id)}>
                                        {/* <input type="hidden" name="appointmentId" value={appointment.id} />
                                        <input type="hidden" name="doctorId" value={doctorId} /> */}
                                        <button type="submit" className="btn btn-outline-success">Завершить прием</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AppointmentsPage;
