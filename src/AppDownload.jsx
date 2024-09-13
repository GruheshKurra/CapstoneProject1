import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { supabase } from './supabaseClient'; // Adjust this import based on where you've set up your Supabase client

const AppDownload = () => {
    const [screenshots, setScreenshots] = useState([]);
    const [apkUrl, setApkUrl] = useState('');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        const screenshotNames = ['login', 'profile', 'sidebar', 'home', 'modelslist', 'samplemodel', 'cloudstorage', 'team'];
        const screenshotPromises = screenshotNames.map(async (name) => {
            const { data, error } = await supabase
                .storage
                .from('assets')
                .getPublicUrl(`${name}.jpg`);

            if (error) {
                console.error(`Error fetching ${name}.jpg:`, error);
                return null;
            }

            return {
                name,
                title: name.charAt(0).toUpperCase() + name.slice(1),
                url: data.publicUrl
            };
        });

        const screenshotResults = await Promise.all(screenshotPromises);
        setScreenshots(screenshotResults.filter(screenshot => screenshot !== null));

        // Set the APK file URL from Google Drive
        setApkUrl('https://drive.google.com/file/d/1_1MJ2x5fIuFUK_VQNu63LzK7kiH99shQ/view?usp=sharing');
    };

    const handleDownload = () => {
        if (apkUrl) {
            window.location.href = apkUrl;
        } else {
            console.error('APK URL not available');
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-normal mb-8 text-center text-white"
            >
                Download VisionaryAI App
            </motion.h1>

            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">VisionaryAI Mobile</div>
                    <p className="mt-2 text-white">Experience the power of AI in your pocket. Our mobile app brings all the features of VisionaryAI to your smartphone, allowing you to harness AI capabilities on the go.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-6"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download APK
                    </motion.button>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-normal mb-8 text-center text-white">App Screenshots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {screenshots.map((screenshot, index) => (
                        <motion.div
                            key={screenshot.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                        >
                            <img
                                src={screenshot.url}
                                alt={screenshot.title}
                                className="w-full h-auto"
                            />
                            <div className="p-4">
                                <p className="text-white text-center">{screenshot.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-16 text-center"
            >
                <h2 className="text-2xl font-normal mb-4 text-white">System Requirements</h2>
                <ul className="text-gray-300 list-disc list-inside">
                    <li>Android 6.0 and above</li>
                    <li>2GB RAM or more</li>
                    <li>100MB free storage space</li>
                </ul>
            </motion.div>
        </div>
    );
};

export default AppDownload;
