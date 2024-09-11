import React from 'react';
import { motion } from 'framer-motion';

const DeleteConfirmationModal = ({ itemName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full"
        >
            <h3 className="text-xl font-semibold mb-4 text-white">Confirm Deletion</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to permanently delete "{itemName}"?</p>
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

export default DeleteConfirmationModal;