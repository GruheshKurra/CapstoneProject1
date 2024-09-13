import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import {
	LightBulbIcon,
	CubeTransparentIcon,
	BeakerIcon,
	CloudArrowDownIcon,
	HeartIcon,
	PencilIcon,
	TrashIcon
} from "@heroicons/react/24/outline";

const FeatureCard = ({ feature, isAdmin, onEdit, onDelete }) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden"
	>
		<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
		<h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
		<p className="text-gray-400 mb-4">{feature.description}</p>
		<Link
			to={feature.link}
			className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
		>
			Try it out
		</Link>
		{isAdmin && (
			<div className="absolute top-2 right-2 space-x-2">
				<button
					onClick={() => onEdit(feature)}
					className="text-blue-400 hover:text-blue-300 transition duration-300"
				>
					<PencilIcon className="h-5 w-5" />
				</button>
				<button
					onClick={() => onDelete(feature)}
					className="text-red-400 hover:text-red-300 transition duration-300"
				>
					<TrashIcon className="h-5 w-5" />
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
					className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
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
		return <div className="text-center text-red-500">{error}</div>;
	}

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

			{isAdmin && !isAdding && !editingFeature && (
				<div className="mb-8 text-center">
					<button
						onClick={() => setIsAdding(true)}
						className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-lg inline-flex items-center"
					>
						<LightBulbIcon className="h-5 w-5 mr-2" />
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
				<div className="text-center text-white">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
					<p className="mt-2">Loading...</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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