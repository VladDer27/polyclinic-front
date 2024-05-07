import React, { useState } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

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

const daysOfWeek = {
    MONDAY: 'Понедельник',
    TUESDAY: 'Вторник',
    WEDNESDAY: 'Среда',
    THURSDAY: 'Четверг',
    FRIDAY: 'Пятница',
    SATURDAY: 'Суббота',
    SUNDAY: 'Воскресенье'
};

function AddDoctor() {
    const navigate = useNavigate();
    document.title = "Изменение данных доктора";
    const [doctor, setDoctor] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        speciality: '',
        login: '',
        password: '',
        appointmentDuration: '',
        room: '',
        schedule: {}
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name.includes('_start') || name.includes('_end')) {
            const [day, key] = name.split('_');
            setDoctor(prev => ({
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [day]: { ...prev.schedule[day], [key]: value }
                }
            }));
        } else {
            setDoctor(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const queryParams = new URLSearchParams();
            Object.entries(doctor.schedule).forEach(([day, { start, end }]) => {
                if (start) queryParams.append(`${day}_start`, start);
                if (end) queryParams.append(`${day}_end`, end);
            });

            const newDoctorData = {
                ...doctor,
                speciality: doctor.speciality
            };

            const url = `/admin/doctor/new?${queryParams.toString()}`;
            await axios.post(url, newDoctorData);
            navigate('/admin'); // Navigate after successful addition
        } catch (error) {
            console.error('Failed to add new doctor:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="container auth-form col-xl-4 col-lg-6 col-md-8 col-sm-11 my-5">
                <form className="m-4" onSubmit={handleSubmit}>
                    <h4 className="text-center">Добавить доктора</h4>
                    {['lastName', 'firstName', 'middleName', 'login', 'password'].map(field => (
                        <div className="mb-3" key={field}>
                            <label htmlFor={field} className="form-label">{{
                                lastName: 'Фамилия',
                                firstName: 'Имя',
                                middleName: 'Отчество',
                                login: 'Электронная почта',
                                password: 'Пароль'
                            }[field]}</label>
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                className="form-control"
                                id={field}
                                name={field}
                                value={doctor[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className="mb-3">
                        <label htmlFor="speciality" className="form-label">Специальность</label>
                        <select className="form-select" id="speciality" name="speciality" value={doctor.speciality} onChange={handleChange}>
                            {Object.keys(specialties).map(key => (
                                <option key={key} value={key}>{specialties[key]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="appointmentDuration" className="form-label">Время на прием (минуты)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="appointmentDuration"
                            name="appointmentDuration"
                            value={doctor.appointmentDuration}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="room" className="form-label">Кабинет</label>
                        <input
                            type="number"
                            className="form-control"
                            id="room"
                            name="room"
                            value={doctor.room}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {Object.entries(daysOfWeek).map(([key, day]) => (
                        <div key={key} className="mb-3">
                            <label className="form-label">{day}</label>
                            <div className="row">
                                <div className="col">
                                    <input type="time" className="form-control" name={`${key}_start`} value={doctor.schedule[key]?.start || ''} onChange={handleChange} />
                                </div>
                                <div className="col">
                                    <input type="time" className="form-control" name={`${key}_end`} value={doctor.schedule[key]?.end || ''} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col">
                        <button type="submit" className="btn btn-primary">Добавить доктора</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default AddDoctor;
