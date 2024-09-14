import React from 'react';
import { motion } from "framer-motion";
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { UserCircleIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';

const Profile = () => {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Signed out successfully');
        } catch (error) {
            toast.error('Error signing out');
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8"
            >
                <h1 className="text-3xl font-bold text-white mb-6">User Profile</h1>

                <div className="mb-8 flex items-center">
                    <UserCircleIcon className="w-24 h-24 text-gray-400 mr-4" />
                    <div>
                        <h2 className="text-xl font-semibold text-white">Your Account</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Account Management</h3>
                    <div className="space-y-4">
                        <div className="flex items-center text-gray-300">
                            <EnvelopeIcon className="h-5 w-5 mr-2" />
                            <span>Change Email</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <KeyIcon className="h-5 w-5 mr-2" />
                            <span>Change Password</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;