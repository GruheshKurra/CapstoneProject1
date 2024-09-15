import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon,
    XMarkIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const ManageURLs = ({ onUrlsUpdate }) => {
    const [models, setModels] = useState([]);
    const [newModelName, setNewModelName] = useState('');
    const [newModelUrl, setNewModelUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('model_urls')
                .select('*')
                .order('name');

            if (error) throw error;
            setModels(data || []);
        } catch (error) {
            console.error('Error fetching models:', error);
            setError(error.message);
            toast.error('Failed to fetch models');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, id, field) => {
        setModels(prevModels => prevModels.map(model =>
            model.id === id ? { ...model, [field]: e.target.value } : model
        ));
    };

    const handleUpdateModel = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const modelToUpdate = models.find(model => model.id === id);
            const { error } = await supabase
                .from('model_urls')
                .update({ name: modelToUpdate.name, url: modelToUpdate.url })
                .eq('id', id);

            if (error) throw error;

            toast.success('Model updated successfully');
            if (onUrlsUpdate) onUrlsUpdate();
            setEditingId(null);
        } catch (error) {
            console.error('Error updating model:', error);
            setError(error.message);
            toast.error('Failed to update model');
        } finally {
            setIsLoading(false);
            fetchModels();
        }
    };

    const handleAddNewModel = async (e) => {
        e.preventDefault();
        if (!newModelName || !newModelUrl) {
            toast.error('Both model name and URL are required');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('model_urls')
                .insert({ name: newModelName, url: newModelUrl })
                .select();

            if (error) throw error;

            toast.success('New model added successfully');
            setNewModelName('');
            setNewModelUrl('');
            fetchModels();
        } catch (error) {
            console.error('Error adding new model:', error);
            setError(error.message);
            toast.error('Failed to add new model');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteModel = async (id) => {
        if (!window.confirm('Are you sure you want to delete this model?')) return;

        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('model_urls')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Model deleted successfully');
            fetchModels();
        } catch (error) {
            console.error('Error deleting model:', error);
            setError(error.message);
            toast.error('Failed to delete model');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-semibold mb-6 text-white text-center"
            >
                Manage Model URLs
            </motion.h2>
            <div className="max-w-4xl mx-auto">
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center mb-4"
                        >
                            <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                <motion.div layout className="space-y-4">
                    {models.map((model) => (
                        <motion.div
                            key={model.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-800 p-4 rounded-lg shadow-lg"
                        >
                            {editingId === model.id ? (
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="text"
                                        value={model.name}
                                        onChange={(e) => handleInputChange(e, model.id, 'name')}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="Model Name"
                                    />
                                    <input
                                        type="url"
                                        value={model.url}
                                        onChange={(e) => handleInputChange(e, model.id, 'url')}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="Model URL"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => handleUpdateModel(model.id)}
                                            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <CheckIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                                        <p className="text-sm text-gray-400">{model.url}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingId(model.id)}
                                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteModel(model.id)}
                                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                <motion.form
                    onSubmit={handleAddNewModel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h3 className="text-xl font-semibold mb-4 text-white">Add New Model</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Model Name
                            </label>
                            <input
                                type="text"
                                value={newModelName}
                                onChange={(e) => setNewModelName(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Enter model name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Model URL
                            </label>
                            <input
                                type="url"
                                value={newModelUrl}
                                onChange={(e) => setNewModelUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Enter model URL"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm flex items-center justify-center"
                            disabled={isLoading}
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add New Model
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default ManageURLs;