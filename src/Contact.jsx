import React from "react";

const Contact = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-normal mb-6">Contact Us</h1>
			<div className="max-w-md mx-auto">
				<form className="space-y-4">
					<div>
						<label htmlFor="name" className="block mb-2 font-light">
							Name
						</label>
						<input
							type="text"
							id="name"
							className="w-full p-2 border rounded bg-gray-800 text-white font-light"
							placeholder="Your Name"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block mb-2 font-light">
							Email
						</label>
						<input
							type="email"
							id="email"
							className="w-full p-2 border rounded bg-gray-800 text-white font-light"
							placeholder="your@email.com"
						/>
					</div>
					<div>
						<label htmlFor="message" className="block mb-2 font-light">
							Message
						</label>
						<textarea
							id="message"
							rows="4"
							className="w-full p-2 border rounded bg-gray-800 text-white font-light"
							placeholder="Your message here..."
						></textarea>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 font-light"
					>
						Send Message
					</button>
				</form>
			</div>
		</div>
	);
};

export default Contact;
