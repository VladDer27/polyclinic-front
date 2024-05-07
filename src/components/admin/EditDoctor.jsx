import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Header from '../Header';
import Footer from '../Footer';
import { useParams, useNavigate } from 'react-router-dom';

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
        room: ''
    });
    const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
        document.title = "Изменение данных доктора";
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get(`/admin/doctor/edit/${doctorId}`);
                setDoctor({
                    lastName: response.data.user.lastName,
                    firstName: response.data.user.firstName,
                    middleName: response.data.user.middleName,
                    speciality: response.data.speciality,
                    login: response.data.user.login,
                    password: '',  // Password should not be prefilled
                    appointmentDuration: response.data.appointmentDuration,
                    room: response.data.room
                });
                // Fetch specialties from somewhere, assuming static for now
                setSpecialties(['Cardiology', 'Neurology', 'Pediatrics']);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };

        fetchDoctorData();
    }, [doctorId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDoctor(prevDoctor => ({
            ...prevDoctor,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/admin/doctor/edit/${doctorId}`, doctor);
            navigate('/admin/doctors'); // Navigate to doctor listing or dashboard on success
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
                    {['lastName', 'firstName', 'middleName', 'login', 'password', 'appointmentDuration', 'room'].map(field => (
                        <div className="mb-3" key={field}>
                            <label htmlFor={field} className="form-label">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                                type={field === 'password' ? 'password' : (field === 'login' ? 'email' : 'text')}
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
                            {specialties.map(specialty => (
                                <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                        </select>
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

export default EditDoctor;
