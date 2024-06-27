import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserDetailsMutation } from '../app/apiauth';

function Protected({ Component }) {
    const navigate = useNavigate();
    const { id } = useParams(); // This will capture the :id parameter if present
    const [userdetails, setUserdetails] = useState('');
    const [data, userdata] = useUserDetailsMutation();

    useEffect(() => {
        const userdetail = async () => {
            try {
                const newdata = await data();
                console.log('API response:', newdata); // Log the entire response

                if (newdata.error === "invalid user" || newdata.data.userrole !== "admin") {
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    setUserdetails(newdata.data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        userdetail();
    }, [data, navigate]);

    return <Component user={userdetails} id={id} />;
}

export default Protected;
