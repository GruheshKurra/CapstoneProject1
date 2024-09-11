import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from './supabaseClient';

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

    if (isLoading) return <div className="text-white text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

    return (
        <div className="container mx-auto mt-8 p-4 text-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-normal mb-8 text-center"
            >
                {modelName}
            </motion.h1>
            <div className="max-w-3xl mx-auto">
                {url ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                        <iframe
                            src={url}
                            width="100%"
                            height="600px"
                            style={{ border: "none" }}
                            title={`Gradio ${modelName} Interface`}
                            onLoad={handleLoad}
                            onError={handleError}
                        />
                    </motion.div>
                ) : (
                    <div className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4 text-center">
                        <p className="text-red-500">No URL provided for {modelName}.</p>
                        <p className="mt-2">Please set the URL in the Manage URLs page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModelPage;