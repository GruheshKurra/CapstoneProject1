import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
	EnvelopeIcon,
	PhoneIcon,
	MapPinIcon
} from "@heroicons/react/24/outline";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: ""
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevState => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formDataToSend = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			formDataToSend.append(key, value);
		});
		formDataToSend.append("access_key", "096b39ef-672e-44a2-a629-68dc6c13ed35");

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formDataToSend
			});

			const data = await response.json();

			if (data.success) {
				toast.success("Message sent successfully!");
				setFormData({ name: "", email: "", message: "" });
			} else {
				throw new Error(data.message || "Something went wrong");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error(error.message || "Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-semibold mb-8 text-center text-white"
			>
				Contact Us
			</motion.h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-gray-800 p-6 rounded-lg shadow-lg"
				>
					<h2 className="text-2xl font-semibold mb-4 text-white">Get in Touch</h2>
					<p className="text-gray-300 mb-6">
						We'd love to hear from you! Whether you have a question about our AI models,
						need technical support, or want to explore collaboration opportunities,
						our team is ready to assist you.
					</p>
					<div className="space-y-4">
						<div className="flex items-center text-gray-300">
							<EnvelopeIcon className="h-6 w-6 mr-2 text-blue-500" />
							<span>akagruheshkurra@gmail.com</span>
						</div>
						<div className="flex items-center text-gray-300">
							<PhoneIcon className="h-6 w-6 mr-2 text-blue-500" />
							<span>+91 8008258065</span>
						</div>
						<div className="flex items-center text-gray-300">
							<MapPinIcon className="h-6 w-6 mr-2 text-blue-500" />
							<span>Hyderabad, Miyapur</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="bg-gray-800 p-6 rounded-lg shadow-lg"
				>
					<h2 className="text-2xl font-semibold mb-4 text-white">Send Us a Message</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
								Message
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								required
								rows="4"
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							></textarea>
						</div>
						<div>
							<button
								type="submit"
								disabled={isSubmitting}
								className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
									}`}
							>
								{isSubmitting ? 'Sending...' : 'Send Message'}
							</button>
						</div>
					</form>
				</motion.div>
			</div>
		</div>
	);
};

export default Contact;