import React from 'react';
import { Link } from 'react-router-dom';

const RestrictedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-normal mb-4">Access Restricted</h1>
            <p className="text-xl mb-8">Sorry, you don't have permission to access this page.</p>
            <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded"
            >
                Return to Home
            </Link>
        </div>
    );
};

export default RestrictedPage;