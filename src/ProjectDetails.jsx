import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import {
	LightBulbIcon,
	CodeBracketIcon,
	CpuChipIcon,
	PencilIcon,
	TrashIcon,
	PlusIcon
} from "@heroicons/react/24/outline";

const ProjectDetails = () => {
	const [details, setDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingItem, setEditingItem] = useState(null);
	const [isAdding, setIsAdding] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const { user } = useAuth();

	const isAdmin = user && user.email === "gruheshkurra2@gmail.com";

	useEffect(() => {
		fetchProjectDetails();
	}, []);

	const fetchProjectDetails = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("project_details")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setDetails(data || []);
		} catch (error) {
			console.error("Error fetching project details:", error);
			setError("Failed to fetch project details. Please try again later.");
			toast.error("Failed to fetch project details");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddOrUpdateDetail = async (detailData) => {
		try {
			if (detailData.id) {
				const { error } = await supabase
					.from("project_details")
					.update(detailData)
					.eq("id", detailData.id);
				if (error) throw error;
				toast.success("Detail updated successfully");
			} else {
				const { error } = await supabase
					.from("project_details")
					.insert(detailData);
				if (error) throw error;
				toast.success("Detail added successfully");
			}
			fetchProjectDetails();
			setEditingItem(null);
			setIsAdding(false);
		} catch (error) {
			console.error("Error adding/updating detail:", error);
			toast.error(detailData.id ? "Failed to update detail" : "Failed to add detail");
		}
	};

	const handleDeleteDetail = async (id) => {
		try {
			const { error } = await supabase
				.from("project_details")
				.delete()
				.eq("id", id);
			if (error) throw error;
			toast.success("Detail deleted successfully");
			fetchProjectDetails();
		} catch (error) {
			console.error("Error deleting detail:", error);
			toast.error("Failed to delete detail");
		}
		setDeleteConfirmation(null);
	};

	const DetailCard = ({ detail, isAdmin, onEdit, onDelete }) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
		>
			<h3 className="text-xl font-semibold mb-2 text-white">{detail.title}</h3>
			<p className="text-gray-300 mb-4">{detail.content}</p>
			{isAdmin && (
				<div className="flex justify-end space-x-2">
					<button
						onClick={() => onEdit(detail)}
						className="text-blue-400 hover:text-blue-300 transition duration-300"
					>
						<PencilIcon className="h-5 w-5" />
					</button>
					<button
						onClick={() => onDelete(detail)}
						className="text-red-400 hover:text-red-300 transition duration-300"
					>
						<TrashIcon className="h-5 w-5" />
					</button>
				</div>
			)}
		</motion.div>
	);

	const DetailForm = ({ detail, onSubmit, onCancel }) => {
		const [title, setTitle] = useState(detail?.title || "");
		const [content, setContent] = useState(detail?.content || "");

		const handleSubmit = (e) => {
			e.preventDefault();
			onSubmit({ id: detail?.id, title, content });
		};

		return (
			<form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
				<div className="mb-4">
					<label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
						Title
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
						Content
					</label>
					<textarea
						id="content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full p-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
						rows={4}
						required
					/>
				</div>
				<div className="flex justify-end space-x-2">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
					>
						{detail ? "Update" : "Add"} Detail
					</button>
				</div>
			</form>
		);
	};

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

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
				{isLoading ? (
					<div className="text-center text-white">Loading...</div>
				) : (
					details.map((detail) => (
						<DetailCard
							key={detail.id}
							detail={detail}
							isAdmin={isAdmin}
							onEdit={setEditingItem}
							onDelete={() => setDeleteConfirmation(detail)}
						/>
					))
				)}
				{isAdmin && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mt-4"
					>
						{isAdding || editingItem ? (
							<DetailForm
								detail={editingItem}
								onSubmit={handleAddOrUpdateDetail}
								onCancel={() => {
									setIsAdding(false);
									setEditingItem(null);
								}}
							/>
						) : (
							<button
								onClick={() => setIsAdding(true)}
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
							>
								<PlusIcon className="h-5 w-5 mr-2" />
								Add New Feature
							</button>
						)}
					</motion.div>
				)}
			</section>

			<section className="mb-12">
				<h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
					<CodeBracketIcon className="h-6 w-6 mr-2 text-green-400" />
					Technical Details
				</h2>
				<ul className="list-disc list-inside text-gray-300 space-y-2">
					<li>Frontend: React with Tailwind CSS for responsive design</li>
					<li>Backend: Supabase for authentication and database management</li>
					<li>AI Models: Integrated via API calls to specialized model endpoints</li>
					<li>Deployment: Hosted on cloud infrastructure for scalability</li>
				</ul>
			</section>

			<AnimatePresence>
				{deleteConfirmation && (
					<DeleteConfirmationModal
						itemName={deleteConfirmation.title}
						onConfirm={() => handleDeleteDetail(deleteConfirmation.id)}
						onCancel={() => setDeleteConfirmation(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProjectDetails;