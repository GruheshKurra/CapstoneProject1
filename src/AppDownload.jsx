import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const AppDownload = () => {
    const handleDownload = () => {
        const apkUrl = '../src/Assets/visionary.aab';
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'VisionaryAI.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const screenshots = [
        { name: 'login', title: 'Login Page' },
        { name: 'profile', title: 'User Profile' },
        { name: 'sidebar', title: 'Navigation Sidebar' },
        { name: 'home', title: 'Home Screen' },
        { name: 'modelslist', title: 'AI Models List' },
        { name: 'samplemodel', title: 'Sample AI Model' },
        { name: 'cloudstorage', title: 'Cloud Storage' },
        { name: 'team', title: 'Team Page' }
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-8 text-center text-white"
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
                <h2 className="text-2xl font-bold mb-8 text-center text-white">App Screenshots</h2>
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
                                src={`/src/Assets/${screenshot.name}.jpg`}
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
                <h2 className="text-2xl font-bold mb-4 text-white">System Requirements</h2>
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