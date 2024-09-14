import React from "react";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const teamMembers = [
	{
		name: "Karthik",
		role: "",
		bio: "",
		imageUrl: "/karthik.jpg"
	},
	{
		name: "Sathwik",
		role: "",
		bio: "",
		imageUrl: "/sathwik.jpg"
	},
	{
		name: "Sushma",
		role: "",
		bio: "",
		imageUrl: "/sushma.jpg"
	}
];

const MemberCard = ({ member }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden"
	>
		<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
		<div className="flex items-center justify-center mb-4">
			{member.imageUrl ? (
				<img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover" />
			) : (
				<UserCircleIcon className="w-32 h-32 text-gray-400" />
			)}
		</div>
		<h3 className="text-xl font-semibold mb-2 text-white text-center">{member.name}</h3>
		<p className="text-gray-400 mb-2 text-center">{member.role}</p>
		<p className="text-gray-300 text-center">{member.bio}</p>
	</motion.div>
);

const Team = () => {
	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-semibold mb-12 text-center text-white"
			>
				Meet Our Team
			</motion.h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{teamMembers.map((member, index) => (
					<MemberCard key={index} member={member} />
				))}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				className="mt-16 text-center"
			>
				<h2 className="text-2xl font-semibold mb-4 text-white">Join Our Team</h2>
				<p className="text-gray-300 max-w-2xl mx-auto">
					We're always looking for talented individuals passionate about AI and innovation.
					If you're excited about pushing the boundaries of technology and want to work on
					challenging projects, we'd love to hear from you!
				</p>
				<a
					href="/contact"
					className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
				>
					Get in Touch
				</a>
			</motion.div>
		</div>
	);
};

export default Team;