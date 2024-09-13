import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Contact = () => {
	const [result, setResult] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setResult("Sending....");

		const formData = new FormData(event.target);
		formData.append("access_key", "096b39ef-672e-44a2-a629-68dc6c13ed35");

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formData
			});

			const data = await response.json();

			if (data.success) {
				setResult("Message sent successfully!");
				toast.success("Message sent successfully!");
				event.target.reset();
			} else {
				console.log("Error", data);
				setResult(data.message);
				toast.error(data.message || "Failed to send message. Please try again later.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setResult("An unexpected error occurred. Please try again later.");
			toast.error("An unexpected error occurred. Please try again later.");
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
				className="text-4xl font-normal mb-8 text-center text-white"
			>
				Contact Us
			</motion.h1>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8"
			>
				<form onSubmit={onSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							placeholder="Your Name"
							required
						/>
					</div>
					<div>
						<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							placeholder="your@email.com"
							required
						/>
					</div>
					<div>
						<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">
							Message
						</label>
						<textarea
							name="message"
							id="message"
							rows="4"
							className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none"
							placeholder="Your message here..."
							required
						></textarea>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<span className="flex items-center justify-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							</span>
						) : (
							"Send Message"
						)}
					</button>
				</form>
				{result && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="mt-4 text-center text-sm font-medium text-green-400"
					>
						{result}
					</motion.p>
				)}
			</motion.div>
		</div>
	);
};

export default Contact;