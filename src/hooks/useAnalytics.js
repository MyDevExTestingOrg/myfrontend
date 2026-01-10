import { useState, useEffect } from 'react';
import { fetchCTOMetrics } from '../services/analytics.js';

export const useAnalytics = (userId, selectedOrg , focusedProject) => { 
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchMetrics = async () => {
        const url = `http://localhost:3000/api/v1/analytics/cto/${userId}?org=${selectedOrg}&project=${focusedProject}`;
        const res = await axios.get(url);
        setMetrics(res.data);
    };

    useEffect(() => {
        let isMounted = true;
        if (userId) {
            setLoading(true);
            fetchCTOMetrics(userId, selectedOrg)
                .then(data => {
                    if (isMounted) {
                        setMetrics(data);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.error("Hook Error:", err);
                    if (isMounted) setLoading(false);
                });
        }
        return () => { isMounted = false; };
    }, [userId, selectedOrg]); 

    return { metrics, loading };
};