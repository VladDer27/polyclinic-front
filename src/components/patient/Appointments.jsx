import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Footer from '../Footer';
import Header from '../Header';
import { useParams } from 'react-router-dom';

function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const { patientId } = useParams();


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
  
  const appointmentStatuses = {
      ACTIVE: 'Подтвержден',
      COMPLETED: 'Выполнен',
      CANCELED: 'Отменен'
  };
  
  
    useEffect(() => {
        document.title = "Мои записи";
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`/patient/appointments/${patientId}`);
                setAppointments(response.data.appointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (patientId) {
            fetchAppointments();
        }
    }, [patientId]);

    const formatTime = (timeString, duration) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const start = new Date(0, 0, 0, hours, minutes);
        const end = new Date(start.getTime() + duration * 60000); // Convert duration to milliseconds and add to start time
        return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const cancelAppointment = async (appointmentId) => {
      try {
        await axios.post('/appointment/cancel', null, {
          params: {
              appointmentId: parseInt(appointmentId, 10), // Преобразовать appointmentId к типу long
              patientId: parseInt(patientId, 10) // Преобразовать patientId к типу long
          }
      });
      // Обновить список приемов после отмены
      const response = await axios.get(`/patient/appointments/${patientId}`);
      setAppointments(response.data.appointments);
          console.log('Appointment canceled successfully');
      } catch (error) {
          console.error('Error canceling appointment:', error);
      }
  };

    return (
        <>
            <Header />
            <main className="container my-4" style={{ minHeight: '90vh' }}>
                <h2 className="mb-3">Приемы</h2>
                {appointments.length === 0 && <div>У вас пока нет записей</div>}
                <div className="row my-4">
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="col-md-12 col-lg-6">
                            {appointment.status === 'ACTIVE' && (
                                <div className="card mb-3 border-success">
                                    <div className="card-body bg-success bg-opacity-10">
                                        <h5 className="card-title">{`${appointment.doctorResponse.userResponse.lastName || ''} ${appointment.doctorResponse.userResponse.firstName || ''} ${appointment.doctorResponse.userResponse.middleName || ''}`}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{specialties[appointment.doctorResponse.speciality]}</h6>
                                        <p className="card-text">
                                            Дата: {appointment.date}<br />
                                            Время: {formatTime(appointment.startTime, appointment.doctorResponse.appointmentDuration)}<br />
                                            Кабинет: {appointment.doctorResponse.room}<br />
                                            Статус: {appointmentStatuses[appointment.status]}
                                        </p>
                                        <button onClick={() => cancelAppointment(appointment.id)} className="btn btn-outline-danger">Отменить прием</button>
                                    </div>
                                </div>
                            )}
                            {appointment.status === 'COMPLETED' && (
                                <div className="card mb-3 border-primary">
                                    <div className="card-body bg-primary bg-opacity-10">
                                        <h5 className="card-title">{`${appointment.doctorResponse.userResponse.lastName || ''} ${appointment.doctorResponse.userResponse.firstName || ''} ${appointment.doctorResponse.userResponse.middleName || ''}`}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{specialties[appointment.doctorResponse.speciality]}</h6>
                                        <p className="card-text">
                                            Дата: {appointment.date}<br />
                                            Время: {formatTime(appointment.startTime, appointment.doctorResponse.appointmentDuration)}<br />
                                            Кабинет: {appointment.doctorResponse.room}<br />
                                            Статус: {appointmentStatuses[appointment.status]}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {appointment.status === 'CANCELED' && (
                                <div className="card mb-3 border-danger">
                                    <div className="card-body bg-danger bg-opacity-10">
                                        <h5 className="card-title">{`${appointment.doctorResponse.userResponse.lastName || ''} ${appointment.doctorResponse.userResponse.firstName || ''} ${appointment.doctorResponse.userResponse.middleName || ''}`}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{specialties[appointment.doctorResponse.speciality]}</h6>
                                        <p className="card-text">
                                            Дата: {appointment.date}<br />
                                            Время: {formatTime(appointment.startTime, appointment.doctorResponse.appointmentDuration)}<br />
                                            Кабинет: {appointment.doctorResponse.room}<br />
                                            Статус: {appointmentStatuses[appointment.status]}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AppointmentsPage;

