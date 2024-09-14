import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
	FaGithub
} from "react-icons/fa";

const Footer = () => {
	const socialLinks = [
		{ icon: <FaFacebookF />, url: "https://facebook.com", name: "Facebook" },
		{ icon: <FaTwitter />, url: "https://twitter.com", name: "Twitter" },
		{ icon: <FaInstagram />, url: "https://instagram.com", name: "Instagram" },
		{ icon: <FaLinkedinIn />, url: "https://linkedin.com", name: "LinkedIn" },
		{ icon: <FaGithub />, url: "https://github.com", name: "GitHub" },
	];

	const footerLinks = [
		{ title: "Home", path: "/" },
		{ title: "About", path: "/about" },
		{ title: "Team", path: "/team" },
		{ title: "Contact", path: "/contact" },
		{ title: "Project Details", path: "/project-details" },
	];

	return (
		<footer className="bg-gray-900 text-white py-6">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center">
					<div className="mb-4">
						<Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
							VisionaryAI
						</Link>
					</div>
					<div className="flex space-x-4 mb-4">
						{socialLinks.map((link, index) => (
							<motion.a
								key={index}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-white transition-colors duration-300"
								whileHover={{ scale: 1.1, color: "#ffffff" }}
								whileTap={{ scale: 0.9 }}
								title={link.name}
							>
								{link.icon}
							</motion.a>
						))}
					</div>
					<div className="flex flex-wrap justify-center mb-4">
						{footerLinks.map((link, index) => (
							<Link
								key={index}
								to={link.path}
								className="text-sm text-gray-400 hover:text-white mx-2 my-1 transition-colors duration-300"
							>
								{link.title}
							</Link>
						))}
					</div>
					<div className="text-center text-sm text-gray-400">
						<p>&copy; {new Date().getFullYear()} VisionaryAI. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;