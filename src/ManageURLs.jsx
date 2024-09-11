import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ManageURLs = ({ onUrlsUpdate }) => {
    const [models, setModels] = useState([]);
    const [newModelName, setNewModelName] = useState('');
    const [newModelUrl, setNewModelUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

            console.log("Fetched data:", data);
            setModels(data || []);
        } catch (error) {
            console.error('Error fetching models:', error);
            setError(error.message);
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

            console.log('Model updated successfully');
            if (onUrlsUpdate) onUrlsUpdate();
        } catch (error) {
            console.error('Error updating model:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
            fetchModels();
        }
    };

    const handleAddNewModel = async (e) => {
        e.preventDefault();
        if (!newModelName || !newModelUrl) {
            setError('Both model name and URL are required');
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

            console.log('New model added:', data);
            setNewModelName('');
            setNewModelUrl('');
            fetchModels();
        } catch (error) {
            console.error('Error adding new model:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteModel = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('model_urls')
                .delete()
                .eq('id', id);

            if (error) throw error;

            console.log('Model deleted successfully');
            fetchModels();
        } catch (error) {
            console.error('Error deleting model:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-normal mb-5 text-white text-center">Manage Model URLs</h2>
            <div className="max-w-md mx-auto">
                {models.length > 0 ? (
                    <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                        {models.map((model) => (
                            <div key={model.id} className="border-b border-gray-700 pb-4 mb-4">
                                <input
                                    type="text"
                                    value={model.name}
                                    onChange={(e) => handleInputChange(e, model.id, 'name')}
                                    className="w-full px-3 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Model Name"
                                />
                                <input
                                    type="url"
                                    value={model.url}
                                    onChange={(e) => handleInputChange(e, model.id, 'url')}
                                    className="w-full px-3 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Model URL"
                                />
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleUpdateModel(model.id)}
                                        className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDeleteModel(model.id)}
                                        className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white text-center mb-4">No models found. Add a new model below.</p>
                )}

                <form onSubmit={handleAddNewModel} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-white">Add New Model</h3>
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
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
                        disabled={isLoading}
                    >
                        Add New Model
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageURLs;