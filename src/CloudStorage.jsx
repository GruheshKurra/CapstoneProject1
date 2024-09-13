import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import {
    CloudArrowUpIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    XMarkIcon,
    DocumentIcon,
    MusicalNoteIcon,
} from '@heroicons/react/24/outline';

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB in bytes

const CloudStorage = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const { user } = useAuth();
    const [usedStorage, setUsedStorage] = useState(0);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    useEffect(() => {
        if (user) {
            fetchFiles();
        }
    }, [user]);

    const fetchFiles = async () => {
        try {
            const { data, error } = await supabase.storage
                .from('user_files')
                .list(`${user.id}/`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            if (error) throw error;

            setFiles(data || []);
            calculateUsedStorage(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Failed to fetch files: ' + error.message);
        }
    };

    const calculateUsedStorage = (files) => {
        const totalSize = files.reduce((acc, file) => acc + file.metadata.size, 0);
        setUsedStorage(totalSize);
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
        if (usedStorage + totalSize > MAX_FILE_SIZE) {
            toast.error('Not enough storage space');
            return;
        }

        setUploading(true);
        for (const file of acceptedFiles) {
            try {
                const filePath = `${user.id}/${file.name}`;
                setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

                const { error } = await supabase.storage
                    .from('user_files')
                    .upload(filePath, file, {
                        onProgress: (progress) => {
                            setUploadProgress(prev => ({
                                ...prev,
                                [file.name]: (progress.loaded / progress.total) * 100
                            }));
                        }
                    });

                if (error) throw error;

                // Keep progress at 100% for a moment before clearing
                setTimeout(() => {
                    setUploadProgress(prev => {
                        const newProgress = { ...prev };
                        delete newProgress[file.name];
                        return newProgress;
                    });
                }, 1000);
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error(`Failed to upload ${file.name}: ${error.message}`);
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            }
        }
        setUploading(false);
        toast.success('Files uploaded successfully');
        fetchFiles();
    }, [user, usedStorage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleFileDownload = async (fileName) => {
        try {
            toast.info('Starting download...', { autoClose: 2000 });

            const { data, error } = await supabase.storage
                .from('user_files')
                .download(`${user.id}/${fileName}`);

            if (error) throw error;

            const blob = new Blob([data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('File downloaded successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file: ' + error.message);
        }
    };

    const handleFileDelete = async (fileName) => {
        try {
            const { error } = await supabase.storage
                .from('user_files')
                .remove([`${user.id}/${fileName}`]);

            if (error) throw error;

            toast.success('File deleted successfully');
            fetchFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file: ' + error.message);
        }
        setDeleteConfirmation(null);
    };

    const getFilePreview = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        const audioExtensions = ['mp3', 'wav', 'ogg'];

        if (imageExtensions.includes(extension)) {
            return (
                <img
                    src={supabase.storage.from('user_files').getPublicUrl(`${user.id}/${file.name}`).data.publicUrl}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded mb-2"
                />
            );
        } else if (audioExtensions.includes(extension)) {
            return <MusicalNoteIcon className="w-full h-32 text-blue-500" />;
        } else {
            return <DocumentIcon className="w-full h-32 text-gray-500" />;
        }
    };

    const UploadProgressBar = ({ progress }) => (
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center text-xs text-white"
                style={{ width: `${progress}%` }}
            >
                {progress.toFixed(0)}%
            </div>
        </div>
    );

    const LoadingOverlay = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-white text-2xl font-normal">Uploading...</div>
        </div>
    );

    const DeleteConfirmationModal = ({ fileName, onConfirm, onCancel }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full"
            >
                <h3 className="text-xl font-semibold mb-4 text-white">Confirm Deletion</h3>
                <p className="mb-6 text-gray-300">Are you sure you want to permanently delete "{fileName}"?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <h1 className="text-3xl font-normal mb-6 text-white">Your Cloud Storage</h1>
            <div className="mb-4">
                <p className="text-lg text-white">
                    Used Storage: {(usedStorage / 1024 / 1024).toFixed(2)} MB / 250 MB
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(usedStorage / MAX_FILE_SIZE) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div {...getRootProps()} className={`border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the files here ...</p>
                ) : (
                    <p className="text-gray-300">Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file) => (
                    <motion.div
                        key={file.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800 p-4 rounded-lg shadow flex flex-col justify-between"
                    >
                        <div>
                            {getFilePreview(file)}
                            <p className="text-sm text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.metadata.size / 1024 / 1024).toFixed(2)} MB</p>
                            {uploadProgress[file.name] !== undefined && (
                                <div className="mt-2">
                                    <UploadProgressBar progress={uploadProgress[file.name]} />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleFileDownload(file.name)}
                                className="text-blue-500 hover:text-blue-600"
                                disabled={uploadProgress[file.name] !== undefined}
                            >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setDeleteConfirmation(file.name)}
                                className="text-red-500 hover:text-red-600"
                                disabled={uploadProgress[file.name] !== undefined}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {deleteConfirmation && (
                    <DeleteConfirmationModal
                        fileName={deleteConfirmation}
                        onConfirm={() => handleFileDelete(deleteConfirmation)}
                        onCancel={() => setDeleteConfirmation(null)}
                    />
                )}
            </AnimatePresence>
            {uploading && <LoadingOverlay />}
        </div>
    );
};

export default CloudStorage;