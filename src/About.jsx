import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import {
	PencilIcon,
	TrashIcon,
	PlusIcon
} from "@heroicons/react/24/outline";

const ContentCard = ({ item, isAdmin, onEdit, onDelete }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden mb-6"
	>
		<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
		<h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
		<p className="text-gray-300 mb-4">{item.content}</p>
		{isAdmin && (
			<div className="absolute top-2 right-2 space-x-2">
				<button
					onClick={() => onEdit(item)}
					className="text-blue-400 hover:text-blue-300 transition duration-300"
					title="Edit"
				>
					<PencilIcon className="h-5 w-5" />
				</button>
				<button
					onClick={() => onDelete(item)}
					className="text-red-400 hover:text-red-300 transition duration-300"
					title="Delete"
				>
					<TrashIcon className="h-5 w-5" />
				</button>
			</div>
		)}
	</motion.div>
);

const ContentForm = ({ item, onSubmit, onCancel }) => {
	const [title, setTitle] = useState(item?.title || "");
	const [content, setContent] = useState(item?.content || "");
	const [orderIndex, setOrderIndex] = useState(item?.order_index || 0);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ id: item?.id, title, content, order_index: orderIndex });
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
			<div className="mb-4">
				<label htmlFor="orderIndex" className="block text-sm font-medium text-gray-300 mb-2">
					Order Index
				</label>
				<input
					type="number"
					id="orderIndex"
					value={orderIndex}
					onChange={(e) => setOrderIndex(parseInt(e.target.value))}
					className="w-full p-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
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
					{item ? "Update" : "Add"} Content
				</button>
			</div>
		</form>
	);
};

const About = () => {
	const [content, setContent] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingItem, setEditingItem] = useState(null);
	const [isAdding, setIsAdding] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const { user } = useAuth();

	const isAdmin = user && user.email === "gruheshkurra2@gmail.com";

	useEffect(() => {
		fetchContent();
	}, []);

	const fetchContent = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("about_content")
				.select("*")
				.order("order_index");

			if (error) throw error;
			setContent(data || []);
		} catch (error) {
			console.error("Error fetching about content:", error);
			setError("Failed to fetch content. Please try again later.");
			toast.error("Failed to fetch content");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddOrUpdateContent = async (contentData) => {
		try {
			if (contentData.id) {
				const { error } = await supabase
					.from("about_content")
					.update(contentData)
					.eq("id", contentData.id);
				if (error) throw error;
				toast.success("Content updated successfully");
			} else {
				const { error } = await supabase
					.from("about_content")
					.insert(contentData);
				if (error) throw error;
				toast.success("Content added successfully");
			}
			fetchContent();
			setEditingItem(null);
			setIsAdding(false);
		} catch (error) {
			console.error("Error adding/updating content:", error);
			toast.error(contentData.id ? "Failed to update content" : "Failed to add content");
		}
	};

	const handleDeleteContent = async (id) => {
		try {
			const { error } = await supabase
				.from("about_content")
				.delete()
				.eq("id", id);
			if (error) throw error;
			toast.success("Content deleted successfully");
			fetchContent();
		} catch (error) {
			console.error("Error deleting content:", error);
			toast.error("Failed to delete content");
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
				className="text-4xl font-semibold mb-8 text-center text-white"
			>
				About VisionaryAI
			</motion.h1>

			{isLoading ? (
				<div className="text-center text-white">Loading...</div>
			) : (
				<div className="space-y-6">
					{content.map((item) => (
						<ContentCard
							key={item.id}
							item={item}
							isAdmin={isAdmin}
							onEdit={setEditingItem}
							onDelete={() => setDeleteConfirmation(item)}
						/>
					))}
				</div>
			)}

			{isAdmin && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mt-8"
				>
					{isAdding || editingItem ? (
						<ContentForm
							item={editingItem}
							onSubmit={handleAddOrUpdateContent}
							onCancel={() => {
								setIsAdding(false);
								setEditingItem(null);
							}}
						/>
					) : (
						<button
							onClick={() => setIsAdding(true)}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center mx-auto"
						>
							<PlusIcon className="h-5 w-5 mr-2" />
							Add New Content
						</button>
					)}
				</motion.div>
			)}

			<AnimatePresence>
				{deleteConfirmation && (
					<DeleteConfirmationModal
						itemName={deleteConfirmation.title}
						onConfirm={() => handleDeleteContent(deleteConfirmation.id)}
						onCancel={() => setDeleteConfirmation(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default About;