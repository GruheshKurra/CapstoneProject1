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
		className="mb-6"
	>
		<h2 className="text-2xl font-normal mb-2">{item.title}</h2>
		<p className="font-light text-lg">{item.content}</p>
		{isAdmin && (
			<div className="mt-2">
				<button
					onClick={() => onEdit(item)}
					className="text-blue-400 hover:text-blue-300 mr-2"
				>
					Edit
				</button>
				<button
					onClick={() => onDelete(item)}
					className="text-red-400 hover:text-red-300"
				>
					Delete
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
		<form onSubmit={handleSubmit} className="mb-6">
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
				required
			/>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Content"
				className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
				required
				rows={4}
			/>
			<input
				type="number"
				value={orderIndex}
				onChange={(e) => setOrderIndex(parseInt(e.target.value))}
				placeholder="Order Index"
				className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
				required
			/>
			<div>
				<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
				<button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
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
		return <div className="text-center text-white">Error: {error}</div>;
	}

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-5xl font-normal mb-8 text-center"
			>
				About VisionaryAI
			</motion.h1>
			<div className="max-w-3xl mx-auto">
				{isAdmin && !isAdding && !editingItem && (
					<div className="mb-6">
						<button
							onClick={() => setIsAdding(true)}
							className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
						>
							Add New Content
						</button>
					</div>
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
					<div className="text-center text-white">Loading...</div>
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