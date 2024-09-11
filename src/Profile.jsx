import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function getProfile() {
            setLoading(true);
            const { data, error } = await supabase.auth.getSession();

            if (mounted) {
                if (error) {
                    console.error('Error fetching session:', error.message);
                } else if (data?.session) {
                    setSession(data.session);
                }
                setLoading(false);
            }
        }

        getProfile();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Please log in to view this page.</div>;
    }

    return (
        <div className="container mx-auto mt-8 p-4">
            <h1 className="text-2xl font-normal mb-4">Profile</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="email">
                        Email
                    </label>
                    <p className="text-gray-700" id="email">{session.user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;