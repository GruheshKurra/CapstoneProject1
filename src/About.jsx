import React from "react";
import { motion } from "framer-motion";

const ContentCard = ({ item }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden mb-6"
	>
		<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
		<h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
		<p className="text-gray-300 mb-4">{item.content}</p>
	</motion.div>
);

const About = () => {
	const content = [
		{
			id: 1,
			title: "Our Mission",
			content: "At VisionaryAI, our mission is to democratize access to cutting-edge AI technologies. We believe in the power of artificial intelligence to transform industries, solve complex problems, and enhance human capabilities. Our platform brings together state-of-the-art AI models, making them accessible and user-friendly for developers, researchers, and businesses alike."
		},
		{
			id: 2,
			title: "Our Technology",
			content: "VisionaryAI leverages the latest advancements in machine learning and deep learning. Our suite of AI models covers a wide range of applications, from natural language processing to computer vision. We continuously update and refine our models to ensure they remain at the forefront of AI capabilities, providing our users with the most powerful and accurate tools available."
		},
		{
			id: 3,
			title: "Our Commitment",
			content: "We are committed to ethical AI development and usage. VisionaryAI prioritizes data privacy, fairness, and transparency in all our operations. We strive to create AI solutions that are not only powerful but also responsible and beneficial to society. Our team works tirelessly to address potential biases and ensure our AI models are safe and reliable."
		},
		{
			id: 4,
			title: "Our Vision",
			content: "Looking to the future, we envision a world where AI augments human intelligence, enabling us to tackle global challenges and push the boundaries of innovation. VisionaryAI aims to be at the forefront of this AI revolution, continually expanding our capabilities and exploring new frontiers in artificial intelligence. We're excited about the possibilities that lie ahead and invite you to join us on this transformative journey."
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
				About VisionaryAI
			</motion.h1>

			<div className="space-y-6">
				{content.map((item) => (
					<ContentCard key={item.id} item={item} />
				))}
			</div>
		</div>
	);
};

export default About;