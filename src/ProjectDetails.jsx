import React from "react";
import { motion } from "framer-motion";
import {
	LightBulbIcon,
	CodeBracketIcon,
	CpuChipIcon,
} from "@heroicons/react/24/outline";

const DetailCard = ({ detail }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
	>
		<h3 className="text-xl font-semibold mb-2 text-white">{detail.title}</h3>
		<p className="text-gray-300 mb-4">{detail.content}</p>
	</motion.div>
);

const ProjectDetails = () => {
	const keyFeatures = [
		{
			id: 1,
			title: "ChatWithPDF",
			content: "Our ChatWithPDF feature allows users to interact with PDF documents using natural language queries. This powerful tool enables quick information retrieval, summarization, and in-depth analysis of complex documents without manual searching."
		},
		{
			id: 2,
			title: "DeepFake Image Detection",
			content: "VisionaryAI's DeepFake Image Detection model uses advanced AI to analyze images and identify signs of artificial manipulation or generation. This technology is crucial in combating misinformation and preserving the integrity of visual media."
		},
		{
			id: 3,
			title: "Image Classification",
			content: "Our Image Classification model can accurately categorize images into predefined classes. This versatile tool has applications ranging from content moderation and organization to medical diagnosis support and industrial quality control."
		},
		{
			id: 4,
			title: "Image Generation",
			content: "The Image Generation model pushes the boundaries of AI creativity by creating unique, high-quality images from textual descriptions or prompts. This opens up new possibilities for artists, designers, and content creators."
		},
		{
			id: 5,
			title: "Object Detection",
			content: "Our Object Detection model not only identifies objects within images but also precisely locates them. This capability is essential for applications such as autonomous vehicles, surveillance systems, and robotics."
		},
		{
			id: 6,
			title: "Website Generator",
			content: "The Website Generator model represents a leap forward in web development automation. It can generate functional and aesthetically pleasing website layouts and components, streamlining the web development process."
		}
	];

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-semibold mb-8 text-center text-white"
			>
				VisionaryAI Project Details
			</motion.h1>

			<section className="mb-12">
				<h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
					<LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" />
					Project Overview
				</h2>
				<p className="text-gray-300 mb-4">
					VisionaryAI is an innovative project that leverages cutting-edge artificial intelligence
					technologies to solve complex problems in various domains. Our platform integrates
					multiple AI models, providing users with powerful tools for image processing, natural
					language understanding, and data analysis.
				</p>
			</section>

			<section className="mb-12">
				<h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
					<CpuChipIcon className="h-6 w-6 mr-2 text-blue-400" />
					Key Features
				</h2>
				{keyFeatures.map((detail) => (
					<DetailCard key={detail.id} detail={detail} />
				))}
			</section>

			<section className="mb-12">
				<h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
					<CodeBracketIcon className="h-6 w-6 mr-2 text-green-400" />
					Technical Details
				</h2>
				<ul className="list-disc list-inside text-gray-300 space-y-2">
					<li>Frontend: React with Tailwind CSS for responsive design</li>
					<li>Backend: Cloud Database for authentication and database management</li>
					<li>AI Models: Integrated via Gradio to React</li>
					<li>Deployment: Hosted on cloud infrastructure for scalability</li>
				</ul>
			</section>
		</div>
	);
};

export default ProjectDetails;