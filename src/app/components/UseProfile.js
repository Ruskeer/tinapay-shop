"use client";
import { useEffect, useState } from "react";

export function useProfile() {
    const [data, setData] = useState(null); // start as null instead of '' - cleaner for object data
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch('/api/profile').then(response => {
            response.json().then(data => {
            
                setData(data); // save the WHOLE profile object, not just admin
                setLoading(false);
            })
        })
    }, []);
    return {loading, data};
}