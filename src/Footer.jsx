import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center">
					<div className="mb-4">
						<Link to="/" className="text-2xl font-normal">
							VisionaryAI
						</Link>
					</div>
					<div className="flex space-x-4 mb-4">
						<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
							<Link
								to="/donation"
								className="hover:text-blue-400 transition duration-300"
							>
								Support Us
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
							<Link
								to="/app-download"
								className="hover:text-blue-400 transition duration-300"
							>
								Download App
							</Link>
						</motion.div>
					</div>
					<div className="text-center text-sm">
						<p>&copy; 2024 VisionaryAI. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;