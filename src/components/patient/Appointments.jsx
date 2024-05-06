import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const patientId = useParams().patientId;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/appointments/${patientId}`);
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.post('/appointment/cancel', { appointmentId, patientId });
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Failed to cancel appointment', error);
    }
  };

  return (
    <main className="container my-4">
      <h2 className="mb-3">Приемы</h2>
      {appointments.length === 0 && <div>У вас пока нет записей</div>}
      {appointments.map(appointment => (
        <div key={appointment.id} className={`col-md-12 col-lg-6 card mb-3 border-${appointment.status.toLowerCase()}`}>
          <div className={`card-body bg-${appointment.status.toLowerCase()} bg-opacity-10`}>
            <h5 className="card-title">{`${appointment.doctor.user.lastName} ${appointment.doctor.user.firstName} ${appointment.doctor.user.middleName}`}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{appointment.doctor.speciality}</h6>
            <p className="card-text">
              Дата: {new Date(appointment.date).toLocaleDateString('ru-RU')}<br />
              Время: {appointment.startTime} - {new Date(appointment.startTime).setMinutes(new Date(appointment.startTime).getMinutes() + appointment.doctor.appointmentDuration).toLocaleTimeString('ru-RU')}<br />
              Кабинет: {appointment.doctor.room}<br />
              Статус: {appointment.status}
            </p>
            {appointment.status === 'ACTIVE' && (
              <button onClick={() => cancelAppointment(appointment.id)} className="btn btn-outline-danger">
                Отменить прием
              </button>
            )}
          </div>
        </div>
      ))}
    </main>
  );
};

export default Appointments;
