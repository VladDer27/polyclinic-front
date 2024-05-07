import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useParams, useNavigate } from 'react-router-dom';

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

function EditDoctor() {
    const { doctorId } = useParams();
    const navigate = useNavigate();

   
    const [doctor, setDoctor] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        speciality: '',
        login: '',
        password: '',
        appointmentDuration: '',
        room: '',
        doctorSchedule: {}
    });


    useEffect(() => {
        document.title = "Изменение данных доктора";
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get(`/admin/doctor/edit/${doctorId}`);
                const { userResponse, doctorScheduleResponseList, ...doctorData } = response.data;
                const schedule = doctorScheduleResponseList.reduce((acc, day) => ({
                    ...acc,
                    [day.dayOfWeek]: { start: day.workdayStart, end: day.workdayEnd }
                }), {});
                setDoctor({
                    ...userResponse,
                    ...doctorData,
                    speciality: specialties[doctorData.speciality],
                    doctorSchedule: schedule
                });
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };

        fetchDoctorData();
    }, [doctorId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name.includes('_start') || name.includes('_end')) {
            const [day, key] = name.split('_');
            setDoctor(prevDoctor => ({
                ...prevDoctor,
                doctorSchedule: {
                    ...prevDoctor.doctorSchedule,
                    [day]: { ...prevDoctor.doctorSchedule[day], [key]: value }
                }
            }));
        } else {
            setDoctor(prevDoctor => ({
                ...prevDoctor,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Constructing the URL with dynamic query parameters from the doctorSchedule
            const queryParams = new URLSearchParams();
            for (const [day, times] of Object.entries(doctor.doctorSchedule)) {
                if (times.start) {
                    queryParams.append(`${day}_start`, times.start);
                }
                if (times.end) {
                    queryParams.append(`${day}_end`, times.end);
                }
            }
    
            // Include other data as part of the request body if necessary
            const updatedDoctor = {
                lastName: doctor.lastName,
                firstName: doctor.firstName,
                middleName: doctor.middleName,
                speciality: Object.keys(specialties).find(key => specialties[key] === doctor.speciality),
                login: doctor.login,
                password: doctor.password, // Consider security implications
                appointmentDuration: doctor.appointmentDuration,
                room: doctor.room
            };
    
            // Combining the base URL, doctorId, and query parameters
            const url = `/admin/doctor/edit/${doctorId}?${queryParams.toString()}`;
            
            // Making the PUT request
            await axios.put(url, updatedDoctor);
            navigate('/admin'); // Navigate after successful update
        } catch (error) {
            console.error('Error updating doctor data:', error);
        }
    };
    

    return (
        <>
            <Header />
            <div className="container auth-form col-xl-4 col-lg-6 col-md-8 col-sm-11 my-5">
                <form className="m-4" onSubmit={handleSubmit}>
                    <h4 className="text-center">Изменить данные доктора</h4>
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
                                required={field !== 'middleName'}
                            />
                        </div>
                    ))}
                    <div className="mb-3">
                        <label htmlFor="speciality" className="form-label">Специальность</label>
                        <select className="form-select" id="speciality" name="speciality" value={doctor.speciality} onChange={handleChange}>
                            {Object.entries(specialties).map(([key, value]) => (
                                <option key={key} value={value}>{value}</option>
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
                        <div className="mb-3" key={key}>
                            <label className="form-label">{day}</label>
                            <div className="row">
                                <div className="col">
                                    <input type="time" className="form-control" name={`${key}_start`} value={doctor.doctorSchedule[key]?.start || ''} onChange={handleChange} />
                                </div>
                                <div className="col">
                                    <input type="time" className="form-control" name={`${key}_end`} value={doctor.doctorSchedule[key]?.end || ''} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col">
                        <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default EditDoctor;
