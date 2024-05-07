import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SchedulePage() {
    const [dates, setDates] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availabilityMap, setAvailabilityMap] = useState({});
    const [specialities, setSpecialities] = useState([]);
    const [tomorrow, setTomorrow] = useState('');

    const { week } = useParams();

    useEffect(() => {
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
        return dates.map(date => (
            <td key={date} className={`bg-opacity-25 ${availabilityMap[doctor.id][date] === 'AVAILABLE' ? 'bg-success' : availabilityMap[doctor.id][date] === 'BUSY' ? 'bg-danger' : ''}`}>
                {doctor.schedules.map(weekday => (
                    date.getDay() === weekday.getDay() && (
                        <a key={weekday.id} className="link text-decoration-none" href={date < new Date(tomorrow) ? '' : `/appointment/schedule/${doctor.id}/${date}`}>{`${weekday.workdayStart} - ${weekday.workdayEnd}`}</a>
                    )
                ))}
            </td>
        ));
    };

    return (
        <div className="container">
            <h2 className="mt-2">Расписание</h2>
            <div className="row">
                <div className="col-md-6">
                    <form>
                        <input type="hidden" name="week" value={week} />
                        <div className="input-group mb-3">
                            <select className="form-select" name="speciality" id="speciality">
                                <option value="" selected>Все специальности</option>
                                {specialities.map(speciality => (
                                    <option key={speciality} value={speciality}>{speciality}</option>
                                ))}
                            </select>
                            <button type="submit" className="btn btn-primary">Поиск</button>
                        </div>
                    </form>
                </div>
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
                                <td className="text-start">{`${doctor.user.lastName || ''} ${doctor.user.firstName || ''} ${doctor.user.middleName || ''}`}</td>
                                <td className="text-start">{doctor.speciality}</td>
                                {renderDoctorSchedule(doctor)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="col-12 text-center mb-4">
                {week === '0' ? (
                    <a className="col-2 btn btn-primary disabled">Предыдущая неделя</a>
                ) : (
                    <a href={`/appointment/schedule/${parseInt(week, 10) - 1}`} className="col-2 btn btn-primary">Предыдущая неделя</a>
                )}
                <a href={`/appointment/schedule/${parseInt(week, 10) + 1}`} className="col-2 btn btn-primary">Следующая неделя</a>
            </div>
        </div>
    );
}

export default SchedulePage;
