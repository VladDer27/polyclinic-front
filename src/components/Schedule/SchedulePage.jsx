import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

function SchedulePage() {
    const [dates, setDates] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availabilityMap, setAvailabilityMap] = useState({});
    const [specialities, setSpecialities] = useState([]);
    const [tomorrow, setTomorrow] = useState('');
    const [selectedSpeciality, setSelectedSpeciality] = useState('');

    const { week } = useParams();

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

    const handleSpecialityChange = (event) => {
        setSelectedSpeciality(event.target.value);
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`/appointment/schedule?week=${week}&speciality=${selectedSpeciality}`);
            setDates(response.data.dates);
            setDoctors(response.data.doctors);
            setAvailabilityMap(response.data.availabilityMap);
            setTomorrow(response.data.tomorrow);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    useEffect(() => {
        document.title = "Расписание";
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`/appointment/schedule?week=${week}`);
                setDates(response.data.dates);
                setDoctors(response.data.doctors);
                setAvailabilityMap(response.data.availabilityMap);
                setSpecialities(response.data.specialities);
                setTomorrow(response.data.tomorrow);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        fetchSchedule();
    }, [week]);

    const renderWeekdays = () => {
        const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        return weekdays.map((weekday, index) => (
            <th key={index}>{weekday}</th>
        ));
    };

    const renderDoctorSchedule = (doctor) => {
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    return dates.map(date => {
        const availability = availabilityMap[doctor.id][date];
        const isAvailable = availability === 'AVAILABLE';
        const isNotInSchedule = availability === 'NOT_IN_SCHEDULE';

        return (
            <td key={date} className={`bg-opacity-25 ${isAvailable ? 'bg-success' : isNotInSchedule ? 'bg-danger' : ''}`}>
                {isAvailable && (
                    doctor.doctorScheduleResponse.map(schedule => {
                        console.log(schedule.dayOfWeek.toUpperCase(), weekdays[new Date(date).getDay()]);
                        if (schedule.dayOfWeek.toUpperCase() === weekdays[new Date(date).getDay()]) {
                            return (
                                <a key={schedule.id} className="link text-decoration-none" href={new Date(date) >= new Date(tomorrow) ? `/appointment/schedule/${doctor.id}/${date}` : null}>
                                    {`${schedule.workdayStart.slice(0, 5)} - ${schedule.workdayEnd.slice(0, 5)}`}
                                </a>
                            );
                        } else {
                            return null;
                        }
                    })
                )}
            </td>
        );
    });
};


    
    

    const goToPreviousWeek = () => {
        const previousWeek = parseInt(week, 10) - 1;
        window.location.href = `/appointment/schedule/${previousWeek}`;
    };

    const goToNextWeek = () => {
        const nextWeek = parseInt(week, 10) + 1;
        window.location.href = `/appointment/schedule/${nextWeek}`;
    };

    return (
        <>
            <div>
            <Header />
            <div className="container">
                <h2 className="mt-2">Расписание</h2>
                <div className="row">
                    <div className="col-md-6">
                        <form onSubmit={handleSearch}>
                            <input type="hidden" name="week" value={week} />
                            <div className="input-group mb-3">
                                <select className="form-select" name="speciality" id="speciality" value={selectedSpeciality} onChange={handleSpecialityChange}>
                                    <option value="">Все специальности</option>
                                    {specialities.map(speciality => (
                                        <option key={speciality} value={speciality}>{specialties[speciality]}</option>
                                    ))}
                                </select>
                                <button type="submit" className="btn btn-primary">Поиск</button>
                            </div>
                        </form>
                    </div>
                    <div className="col">
                        <table className="table table-bordered border-dark text-center bg-light">
                            <thead>
                                <tr>
                                    <th className="align-middle" rowSpan="2">ФИО Врача</th>
                                    <th className="align-middle" rowSpan="2">Специальность</th>
                                    {renderWeekdays()}
                                </tr>
                                <tr>
                                    {dates.map(date => (
                                        <th key={date}>{date}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td className="text-start">{`${doctor.userResponse.lastName || ''} ${doctor.userResponse.firstName || ''} ${doctor.userResponse.middleName || ''}`}</td>
                                        <td className="text-start">{specialties[doctor.speciality]}</td>
                                        {renderDoctorSchedule(doctor)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 text-center mb-4">
                        <button style={{marginRight: '10px'}} onClick={goToPreviousWeek} className="col-2 btn btn-primary" disabled={week === '0'}>Предыдущая неделя</button>
                        <button onClick={goToNextWeek} className="col-2 btn btn-primary">Следующая неделя</button>
                    </div>
                </div>
            </div>
            <Footer />
            </div>
        </>
    );
}

export default SchedulePage;
