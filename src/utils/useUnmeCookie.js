import { useEffect, useState } from 'react';

const useUnmeCookie = () => {
    const [unmeValue, setUnmeValue] = useState('');

    useEffect(() => {
        const cookieValue = getCookie('unme');
        // console.log("🚀 ~ useEffect ~ cookieValue:", cookieValue)
        setUnmeValue(cookieValue);
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';')[0];
        }
        return null; 
    };

    return unmeValue;
};

export default useUnmeCookie;