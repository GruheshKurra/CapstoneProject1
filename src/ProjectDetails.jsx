import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

const EditForm = ({ detail, onCancel, onSave }) => {
	const [editedDetail, setEditedDetail] = useState({ ...detail });

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedDetail(prev => ({
			...prev,
			[name]: name === "tech_stack" ? value.split(",").map(item => item.trim()) : value
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(editedDetail);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				name="title"
				value={editedDetail.title}
				onChange={handleInputChange}
				className="w-full p-2 bg-gray-700 text-white rounded"
				required
			/>
			<textarea
				name="description"
				value={editedDetail.description}
				onChange={handleInputChange}
				className="w-full p-2 bg-gray-700 text-white rounded"
				required
			/>
			<input
				type="text"
				name="tech_stack"
				value={editedDetail.tech_stack.join(", ")}
				onChange={handleInputChange}
				className="w-full p-2 bg-gray-700 text-white rounded"
				placeholder="Comma-separated tech stack"
				required
			/>
			<div>
				<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
				<button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
			</div>
		</form>
	);
};

const ProjectDetails = () => {
	const [details, setDetails] = useState([]);
	const [presentations, setPresentations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [newDetail, setNewDetail] = useState({
		title: "",
		description: "",
		tech_stack: [],
	});
	const [newPresentation, setNewPresentation] = useState({
		title: "",
		link: "",
	});
	const { user } = useAuth();
	const isAdmin = user && user.email === "gruheshkurra2@gmail.com";
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);

	useEffect(() => {
		fetchProjectDetails();
		fetchPresentations();
	}, []);

	const fetchProjectDetails = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("project_details")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setDetails(data || []);
		} catch (error) {
			console.error("Error fetching project details:", error);
			toast.error("Failed to fetch project details");
		} finally {
			setLoading(false);
		}
	};

	const fetchPresentations = async () => {
		try {
			const { data, error } = await supabase
				.from("project_presentations")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setPresentations(data || []);
		} catch (error) {
			console.error("Error fetching presentations:", error);
			toast.error("Failed to fetch presentations");
		}
	};

	const handleNewDetailInputChange = (e) => {
		const { name, value } = e.target;
		setNewDetail(prev => ({
			...prev,
			[name]: name === "tech_stack" ? value.split(",").map(item => item.trim()) : value
		}));
	};

	const handlePresentationInputChange = (e) => {
		const { name, value } = e.target;
		setNewPresentation({ ...newPresentation, [name]: value });
	};

	const handleSubmitNewDetail = async (e) => {
		e.preventDefault();
		try {
			const { data, error } = await supabase
				.from("project_details")
				.insert([newDetail]);

			if (error) throw error;
			toast.success("New project detail added successfully");
			setNewDetail({ title: "", description: "", tech_stack: [] });
			fetchProjectDetails();
		} catch (error) {
			console.error("Error submitting new project detail:", error);
			toast.error("Failed to add new project detail");
		}
	};

	const handleUpdateDetail = async (updatedDetail) => {
		try {
			const { error } = await supabase
				.from("project_details")
				.update(updatedDetail)
				.eq("id", updatedDetail.id);

			if (error) throw error;
			toast.success("Project detail updated successfully");
			setEditingId(null);
			fetchProjectDetails();
		} catch (error) {
			console.error("Error updating project detail:", error);
			toast.error("Failed to update project detail");
		}
	};

	const handlePresentationSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data, error } = await supabase
				.from("project_presentations")
				.insert([newPresentation]);

			if (error) throw error;
			toast.success("New presentation added successfully");
			setNewPresentation({ title: "", link: "" });
			fetchPresentations();
		} catch (error) {
			console.error("Error submitting presentation:", error);
			toast.error("Failed to submit presentation");
		}
	};

	const handleDelete = async (id) => {
		try {
			const { error } = await supabase
				.from("project_details")
				.delete()
				.eq("id", id);

			if (error) throw error;
			toast.success("Project detail deleted successfully");
			fetchProjectDetails();
		} catch (error) {
			console.error("Error deleting project detail:", error);
			toast.error("Failed to delete project detail");
		}
		setDeleteConfirmation(null);
	};

	const handlePresentationDelete = async (id) => {
		try {
			const { error } = await supabase
				.from("project_presentations")
				.delete()
				.eq("id", id);

			if (error) throw error;
			toast.success("Presentation deleted successfully");
			fetchPresentations();
		} catch (error) {
			console.error("Error deleting presentation:", error);
			toast.error("Failed to delete presentation");
		}
		setDeleteConfirmation(null);
	};

	const ProjectDetailCard = ({ detail }) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col justify-between"
		>
			{editingId === detail.id ? (
				<EditForm
					detail={detail}
					onCancel={() => setEditingId(null)}
					onSave={handleUpdateDetail}
				/>
			) : (
				<>
					<div>
						<h2 className="text-2xl font-normal mb-4">{detail.title}</h2>
						<p className="mb-4 font-light">{detail.description}</p>
						<h3 className="text-lg font-normal mb-2">Tech Stack:</h3>
						<ul className="list-disc list-inside font-light mb-4">
							{detail.tech_stack.map((tech, index) => (
								<li key={index}>{tech}</li>
							))}
						</ul>
					</div>
					{isAdmin && (
						<div className="mt-4">
							<button onClick={() => setEditingId(detail.id)} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</button>
							<button onClick={() => setDeleteConfirmation({ type: 'detail', id: detail.id, title: detail.title })} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
						</div>
					)}
				</>
			)}
		</motion.div>
	);

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-normal mb-8 text-center"
			>
				Project Details
			</motion.h1>

			{isAdmin && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8"
				>
					<h2 className="text-2xl font-normal mb-4">Add New Project Detail</h2>
					<form onSubmit={handleSubmitNewDetail} className="space-y-4">
						<input
							type="text"
							name="title"
							value={newDetail.title}
							onChange={handleNewDetailInputChange}
							placeholder="Title"
							className="w-full p-2 bg-gray-700 text-white rounded"
							required
						/>
						<textarea
							name="description"
							value={newDetail.description}
							onChange={handleNewDetailInputChange}
							placeholder="Description"
							className="w-full p-2 bg-gray-700 text-white rounded"
							required
						/>
						<input
							type="text"
							name="tech_stack"
							value={newDetail.tech_stack.join(", ")}
							onChange={handleNewDetailInputChange}
							placeholder="Comma-separated tech stack"
							className="w-full p-2 bg-gray-700 text-white rounded"
							required
						/>
						<button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Project Detail</button>
					</form>
				</motion.div>
			)}

			{loading ? (
				<p className="text-center">Loading project details...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{details.map((detail) => (
						<ProjectDetailCard
							key={detail.id}
							detail={detail}
						/>
					))}
				</div>
			)}

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="mt-12 text-center"
			>
				<h2 className="text-2xl font-normal mb-4">Overall Architecture</h2>
				<p className="mb-4 font-light">
					Our project is built on a React frontend, with each AI model running
					in a separate Jupyter notebook environment. The models are exposed
					through Gradio interfaces, which are embedded in our React components.
					This architecture allows for easy development and deployment of AI
					models while providing a unified, user-friendly interface.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				className="mt-12"
			>
				<h2 className="text-2xl font-normal mb-4 text-center">Project Presentations</h2>
				<div className="flex flex-wrap justify-center gap-4">
					{presentations.map((presentation) => (
						<div key={presentation.id} className="relative">
							<a
								href={presentation.link}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 inline-block"
							>
								{presentation.title}
							</a>
							{isAdmin && (
								<button
									onClick={() => setDeleteConfirmation({ type: 'presentation', id: presentation.id, title: presentation.title })}
									className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
								>
									&times;
								</button>
							)}
						</div>
					))}
				</div>
				{isAdmin && (
					<form onSubmit={handlePresentationSubmit} className="mt-6 flex flex-col items-center">
						<input
							type="text"
							name="title"
							value={newPresentation.title}
							onChange={handlePresentationInputChange}
							placeholder="Presentation Title"
							className="w-full max-w-md p-2 mb-2 bg-gray-700 text-white rounded"
							required
						/>
						<input
							type="url"
							name="link"
							value={newPresentation.link}
							onChange={handlePresentationInputChange}
							placeholder="Presentation Link"
							className="w-full max-w-md p-2 mb-2 bg-gray-700 text-white rounded"
							required
						/>
						<button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Presentation</button>
					</form>
				)}
			</motion.div>

			<AnimatePresence>
				{deleteConfirmation && (
					<DeleteConfirmationModal
						itemName={deleteConfirmation.title}
						onConfirm={() => {
							if (deleteConfirmation.type === 'detail') {
								handleDelete(deleteConfirmation.id);
							} else {
								handlePresentationDelete(deleteConfirmation.id);
							}
						}}
						onCancel={() => setDeleteConfirmation(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProjectDetails;