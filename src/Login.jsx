import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from './supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;
			toast.success('Login successful!');

			// Redirect to the page the user was trying to access, or to home if there's no stored location
			const from = location.state?.from?.pathname || "/";
			navigate(from, { replace: true });
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<ToastContainer />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8"
			>
				<h1 className="text-3xl font-normal mb-6 text-center text-white">Login</h1>
				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label htmlFor="email" className="block mb-2 font-light text-white">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 border rounded bg-gray-700 text-white"
							required
						/>
					</div>
					<div>
						<label htmlFor="password" className="block mb-2 font-light text-white">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border rounded bg-gray-700 text-white"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
					>
						Login
					</button>
				</form>
				<p className="mt-4 text-center font-light text-white">
					Don't have an account?{" "}
					<Link to="/signup" className="text-blue-400 hover:underline">
						Sign up
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default Login;