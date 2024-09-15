import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	LightBulbIcon,
	CloudArrowDownIcon,
	HeartIcon,
} from "@heroicons/react/24/outline";

const FeatureCard = ({ feature }) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden h-full flex flex-col"
	>
		<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
		<h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
		<p className="text-gray-400 mb-4 flex-grow">{feature.description}</p>
		<Link
			to={feature.link}
			className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 mt-auto"
		>
			Try it out
		</Link>
	</motion.div>
);

const Home = () => {
	const features = [
		{
			id: 1,
			title: "ChatWithPDF",
			description: "Interact with PDF documents using natural language queries. Extract information, summarize content, and get answers from your documents effortlessly.",
			link: "/models/ChatWithPDF"
		},
		{
			id: 2,
			title: "DeepFake Image Detection",
			description: "Detect artificially manipulated or generated images with high accuracy. Protect yourself from misinformation and ensure the authenticity of visual content.",
			link: "/models/DeepFake Image Detection"
		},
		{
			id: 3,
			title: "Image Classification",
			description: "Categorize images into predefined classes with high accuracy. Automate image sorting and gain insights from visual data across various domains.",
			link: "/models/Image Classification"
		},
		{
			id: 4,
			title: "Image Generation",
			description: "Create unique, high-quality images from textual descriptions. Bring your ideas to life and explore new creative possibilities with AI-powered image synthesis.",
			link: "/models/Image Generation"
		},
		{
			id: 5,
			title: "Object Detection",
			description: "Identify and locate multiple objects within images. Enhance security systems, automate inventory management, and improve visual analysis in various applications.",
			link: "/models/Object Detection"
		},
		{
			id: 6,
			title: "Website Generator",
			description: "Generate functional website layouts and components using AI. Streamline web development processes and quickly prototype designs with intelligent automation.",
			link: "/models/Website Generator"
		}
	];

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-5xl font-normal mb-6 text-center text-white"
			>
				Welcome to VisionaryAI
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="text-xl mb-12 text-center text-gray-300"
			>
				Explore our cutting-edge AI models for image processing and natural language understanding
			</motion.p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{features.map((feature, index) => (
					<motion.div
						key={feature.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className="h-full"
					>
						<FeatureCard feature={feature} />
					</motion.div>
				))}
			</div>

			<div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="bg-gray-800 p-6 rounded-lg shadow-lg"
				>
					<div className="flex items-center mb-4">
						<CloudArrowDownIcon className="h-8 w-8 text-blue-500 mr-2" />
						<h2 className="text-2xl font-semibold text-white">Download Our App</h2>
					</div>
					<p className="text-gray-300 mb-4">
						Experience VisionaryAI on the go! Our mobile app brings the power of AI to your fingertips.
					</p>
					<Link
						to="/app-download"
						className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
					>
						Get the App
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="bg-gray-800 p-6 rounded-lg shadow-lg"
				>
					<div className="flex items-center mb-4">
						<HeartIcon className="h-8 w-8 text-red-500 mr-2" />
						<h2 className="text-2xl font-semibold text-white">Support Our Project</h2>
					</div>
					<p className="text-gray-300 mb-4">
						Help us continue developing innovative AI solutions. Your support makes a difference!
					</p>
					<Link
						to="/donation"
						className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
					>
						Support Us
					</Link>
				</motion.div>
			</div>
		</div>
	);
};

export default Home;