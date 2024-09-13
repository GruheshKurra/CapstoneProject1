import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

const ContentItem = ({ item, isAdmin, onEdit, onDelete }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay: item.order_index * 0.1 }}
		className="mb-12 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
	>
		<div className="p-6">
			<h2 className="text-2xl font-semibold mb-4 text-white">{item.title}</h2>
			<p className="text-gray-300 leading-relaxed">{item.content}</p>
			{isAdmin && (
				<div className="mt-4 flex justify-end space-x-2">
					<button
						onClick={() => onEdit(item)}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
					>
						Edit
					</button>
					<button
						onClick={() => onDelete(item)}
						className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
					>
						Delete
					</button>
				</div>
			)}
		</div>
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
					className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
				>
					Save
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
				className="text-5xl font-normal mb-12 text-center text-white"
			>
				About VisionaryAI
			</motion.h1>
			<div className="max-w-3xl mx-auto">
				{isAdmin && !isAdding && !editingItem && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-8"
					>
						<button
							onClick={() => setIsAdding(true)}
							className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-lg"
						>
							Add New Content
						</button>
					</motion.div>
				)}
				{isAdding && (
					<ContentForm
						onSubmit={handleAddOrUpdateContent}
						onCancel={() => setIsAdding(false)}
					/>
				)}
				{editingItem && (
					<ContentForm
						item={editingItem}
						onSubmit={handleAddOrUpdateContent}
						onCancel={() => setEditingItem(null)}
					/>
				)}
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : (
					content.map((item) => (
						<ContentItem
							key={item.id}
							item={item}
							isAdmin={isAdmin}
							onEdit={setEditingItem}
							onDelete={() => setDeleteConfirmation(item)}
						/>
					))
				)}
			</div>
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