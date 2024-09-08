import React, {useEffect} from 'react';
import * as campus from '../utils/CampusClient';

const EmploymentSystem = () => {

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await campus.callApi('employment-system/auth', 'GET');
                const url = await response.json();
                window.location.href = url;
            } catch (error) {
                alert(error);
                console.error('Error fetching data:', error);
                // Handle the error, maybe show a message to the user
            }
        };

        fetchData();

    }, []);  // Empty dependency array means this will run once when the component mounts

    return (
        <div className="row">
            <div className="col-md-12">
                <h1>Система працевлаштування</h1>
                Очiкуйте переадресацiю...
            </div>
        </div>
    );
}

export default EmploymentSystem;
