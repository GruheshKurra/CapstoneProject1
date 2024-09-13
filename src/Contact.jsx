import React, { useState } from "react";
import { toast } from "react-toastify";

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
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-normal mb-6">Contact Us</h1>
			<div className="max-w-md mx-auto">
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block mb-2 font-light">
							Name
						</label>
						<input
							type="text"
							name="name"
							id="name"
							className="w-full p-2 border rounded bg-gray-800 text-white font-light"
							placeholder="Your Name"
							required
						/>
					</div>
					<div>
						<label htmlFor="email" className="block mb-2 font-light">
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="w-full p-2 border rounded bg-gray-800 text-white font-light"
							placeholder="your@email.com"
							required
						/>
					</div>
					<div>
						<label htmlFor="message" className="block mb-2 font-light">
							Message
						</label>
						<textarea
							name="message"
							id="message"
							rows="4"
							className="w-full p-2 border rounded bg-gray-800 text-white font-light"
							placeholder="Your message here..."
							required
						></textarea>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 font-light disabled:opacity-50"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Sending..." : "Send Message"}
					</button>
				</form>
				{result && <p className="mt-4 text-center font-light">{result}</p>}
			</div>
		</div>
	);
};

export default Contact;