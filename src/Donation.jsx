import React from 'react';
import { motion } from 'framer-motion';

const Donation = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-normal mb-8 text-center text-white"
            >
                Support VisionaryAI
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
            >
                <p className="text-lg mb-6 text-center text-white">
                    Your support helps us continue developing cutting-edge AI models and keeping them accessible to everyone.
                </p>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-white">How to Support Us</h2>
                        <p className="text-gray-300">
                            We appreciate any form of support. Here are some ways you can contribute:
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">1. Spread the Word</h3>
                        <p className="text-gray-300">
                            Share our project with your network. The more people know about VisionaryAI, the better!
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">2. Contribute to Our Project</h3>
                        <p className="text-gray-300">
                            If you're a developer, consider contributing to our open-source projects on GitHub.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">3. Provide Feedback</h3>
                        <p className="text-gray-300">
                            Your insights are valuable. Let us know how we can improve our AI models or user experience.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">4. Financial Support</h3>
                        <p className="text-gray-300">
                            For those interested in making a financial contribution, please contact us directly at
                            <a href="mailto:support@visionaryai.com" className="text-blue-400 hover:underline"> akagruheshkurra@gmail.com </a>
                            for more information on how to donate.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Donation;