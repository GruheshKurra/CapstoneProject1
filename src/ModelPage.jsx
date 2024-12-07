import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from './supabaseClient';
import { ExclamationTriangleIcon, ArrowPathIcon, BeakerIcon } from '@heroicons/react/24/outline';

const ModelPage = () => {
    const { modelName } = useParams();
    const [url, setUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchModelUrl();
    }, [modelName]);

    const fetchModelUrl = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('model_urls')
                .select('url')
                .eq('name', modelName)
                .single();

            if (error) throw error;
            if (data) {
                setUrl(data.url);
            } else {
                setError("Model not found");
            }
        } catch (error) {
            console.error('Error fetching model URL:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
        setError(null);
    };

    const handleError = () => {
        setIsLoading(false);
        setError(`Failed to load the ${modelName} interface. Please check the URL.`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {modelName}
                    </h1>
                    <p className="mt-3 text-xl text-gray-300">
                        Experience the power of AI at your fingertips
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <LoadingState key="loading" />
                    ) : error ? (
                        <ErrorState key="error" error={error} onRetry={fetchModelUrl} />
                    ) : (
                        <ContentState key="content" url={url} modelName={modelName} onLoad={handleLoad} onError={handleError} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const LoadingState = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-96 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl"
    >
        <div className="w-24 h-24 relative">
            <motion.div
                className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            <BeakerIcon className="w-16 h-16 text-blue-400 absolute inset-0 m-auto" />
        </div>
        <p className="mt-6 text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Initializing Model
        </p>
    </motion.div>
);

const ErrorState = ({ error, onRetry }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-96 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
    >
        <ExclamationTriangleIcon className="w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-2xl font-normal text-red-400 mb-4">Oops! Something went wrong</h2>
        <p className="text-center text-gray-300 mb-6">{error}</p>
        <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
        >
            Try Again
        </button>
    </motion.div>
);

const ContentState = ({ url, modelName, onLoad, onError }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
    >
        {url ? (
            <div className="h-screen max-h-[800px]">
                <iframe
                    src={url}
                    className="w-full h-full border-0 rounded-lg"
                    title={`${modelName} Interface`}
                    onLoad={onLoad}
                    onError={onError}
                />
            </div>
        ) : (
            <div className="p-12 text-center">
                <ExclamationTriangleIcon className="w-20 h-20 text-yellow-500 mb-6 mx-auto" />
                <h2 className="text-2xl font-normal text-yellow-400 mb-4">Model URL Not Found</h2>
                <p className="text-gray-300">
                    The URL for {modelName} is not available. Please configure it in the Manage URLs page.
                </p>
            </div>
        )}
    </motion.div>
);

export default ModelPage;
