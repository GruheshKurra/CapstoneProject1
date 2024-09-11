import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Signup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();
	const { signUp } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		if (password !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}

		try {
			const { error } = await signUp({ email, password });
			if (error) throw error;
			setSuccess(true);
			// We don't navigate immediately, to allow the user to read the success message
			setTimeout(() => navigate('/login', { replace: true }), 5000);
		} catch (error) {
			setError(error.message);
		}
	};

	if (success) {
		return (
			<div className="max-w-md mx-auto mt-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
				<strong className="font-normal">Success!</strong>
				<span className="block sm:inline"> Your account has been created. Please check your email to confirm your registration.</span>
				<p className="mt-2">You will be redirected to the login page in a few seconds.</p>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto mt-8">
			<form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label className="block text-gray-300 text-sm font-normal mb-2" htmlFor="email">
						Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-300 text-sm font-normal mb-2" htmlFor="password">
						Password
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="password"
						type="password"
						placeholder="******************"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="mb-6">
					<label className="block text-gray-300 text-sm font-normal mb-2" htmlFor="confirm-password">
						Confirm Password
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="confirm-password"
						type="password"
						placeholder="******************"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
				<div className="flex items-center justify-between">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Sign Up
					</button>
				</div>
			</form>
		</div>
	);
};

export default Signup;