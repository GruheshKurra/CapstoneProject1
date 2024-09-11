import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

const FeatureCard = ({ feature, isAdmin, onEdit, onDelete }) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg relative"
	>
		<h3 className="text-xl font-normal mb-2">{feature.title}</h3>
		<p className="text-gray-400 mb-4 font-light">{feature.description}</p>
		<Link
			to={feature.link}
			className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
		>
			Try it out
		</Link>
		{isAdmin && (
			<div className="absolute top-2 right-2 space-x-2">
				<button
					onClick={() => onEdit(feature)}
					className="text-blue-400 hover:text-blue-300"
				>
					Edit
				</button>
				<button
					onClick={() => onDelete(feature)}
					className="text-red-400 hover:text-red-300"
				>
					Delete
				</button>
			</div>
		)}
	</motion.div>
);

const FeatureForm = ({ feature, onSubmit, onCancel, modelUrls }) => {
	const [title, setTitle] = useState(feature?.title || "");
	const [description, setDescription] = useState(feature?.description || "");
	const [link, setLink] = useState(feature?.link || "");

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ id: feature?.id, title, description, link });
	};

	return (
		<form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
				required
			/>
			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
				className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
				required
			/>
			<select
				value={link}
				onChange={(e) => setLink(e.target.value)}
				className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
				required
			>
				<option value="">Select a model</option>
				{modelUrls.map((model) => (
					<option key={model.id} value={`/models/${model.name}`}>
						{model.name}
					</option>
				))}
			</select>
			<div className="flex justify-end space-x-2">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 bg-gray-600 text-white rounded"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					{feature ? "Update" : "Add"} Feature
				</button>
			</div>
		</form>
	);
};

const Home = () => {
	const [features, setFeatures] = useState([]);
	const [modelUrls, setModelUrls] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingFeature, setEditingFeature] = useState(null);
	const [isAdding, setIsAdding] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const { user } = useAuth();

	const isAdmin = user && user.email === "gruheshkurra2@gmail.com";

	useEffect(() => {
		fetchFeatures();
		fetchModelUrls();
	}, []);

	const fetchFeatures = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("home_features")
				.select("*")
				.order("created_at", { ascending: true });

			if (error) throw error;
			setFeatures(data);
		} catch (error) {
			console.error("Error fetching features:", error);
			setError("Failed to fetch features. Please try again later.");
			toast.error("Failed to fetch features");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchModelUrls = async () => {
		try {
			const { data, error } = await supabase
				.from("model_urls")
				.select("*")
				.order("name");

			if (error) throw error;
			setModelUrls(data);
		} catch (error) {
			console.error("Error fetching model URLs:", error);
			toast.error("Failed to fetch model URLs");
		}
	};

	const handleAddOrUpdateFeature = async (featureData) => {
		try {
			if (featureData.id) {
				const { error } = await supabase
					.from("home_features")
					.update(featureData)
					.eq("id", featureData.id);
				if (error) throw error;
				toast.success("Feature updated successfully");
			} else {
				const { error } = await supabase
					.from("home_features")
					.insert(featureData);
				if (error) throw error;
				toast.success("Feature added successfully");
			}
			fetchFeatures();
			setEditingFeature(null);
			setIsAdding(false);
		} catch (error) {
			console.error("Error adding/updating feature:", error);
			toast.error(featureData.id ? "Failed to update feature" : "Failed to add feature");
		}
	};

	const handleDeleteFeature = async (feature) => {
		try {
			const { error } = await supabase
				.from("home_features")
				.delete()
				.eq("id", feature.id);
			if (error) throw error;
			toast.success("Feature deleted successfully");
			fetchFeatures();
		} catch (error) {
			console.error("Error deleting feature:", error);
			toast.error("Failed to delete feature");
		}
		setDeleteConfirmation(null);
	};

	if (error) {
		return <div className="text-center text-white">Error: {error}</div>;
	}

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-5xl font-normal mb-6 text-center"
			>
				Welcome to VisionaryAI
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="text-xl mb-12 text-center font-light"
			>
				Explore our cutting-edge AI models for image processing and natural
				language understanding
			</motion.p>
			{isAdmin && !isAdding && !editingFeature && (
				<div className="mb-8">
					<button
						onClick={() => setIsAdding(true)}
						className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
					>
						Add New Feature
					</button>
				</div>
			)}
			{isAdding && (
				<FeatureForm
					onSubmit={handleAddOrUpdateFeature}
					onCancel={() => setIsAdding(false)}
					modelUrls={modelUrls}
				/>
			)}
			{editingFeature && (
				<FeatureForm
					feature={editingFeature}
					onSubmit={handleAddOrUpdateFeature}
					onCancel={() => setEditingFeature(null)}
					modelUrls={modelUrls}
				/>
			)}
			{isLoading ? (
				<div className="text-center text-white">Loading...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<FeatureCard
								feature={feature}
								isAdmin={isAdmin}
								onEdit={setEditingFeature}
								onDelete={() => setDeleteConfirmation(feature)}
							/>
						</motion.div>
					))}
				</div>
			)}
			<AnimatePresence>
				{deleteConfirmation && (
					<DeleteConfirmationModal
						itemName={deleteConfirmation.title}
						onConfirm={() => handleDeleteFeature(deleteConfirmation)}
						onCancel={() => setDeleteConfirmation(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Home;