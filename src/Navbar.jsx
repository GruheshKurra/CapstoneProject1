import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify-custom.css';
import {
	Bars3Icon,
	XMarkIcon,
	ChevronDownIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ urls }) => {
	const { user, signOut } = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isModelsOpen, setIsModelsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsModelsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const NavLink = ({ to, children, mobile }) => (
		<Link
			to={to}
			className={`${mobile
				? "block px-3 py-2 rounded-md text-base font-light"
				: "px-3 py-2 rounded-md text-sm font-light"
				} text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300`}
			onClick={() => setIsOpen(false)} // Close mobile menu when link is clicked
		>
			{children}
		</Link>
	);

	const ModelsDropdown = ({ mobile }) => (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => {
					setIsModelsOpen(!isModelsOpen);
					if (mobile) setIsOpen(false); // Close mobile menu when dropdown is clicked
				}}
				className={`${mobile
					? "block w-full text-left px-3 py-2 rounded-md text-base font-light"
					: "px-3 py-2 rounded-md text-sm font-light"
					} text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300 flex items-center`}
			>
				Models
				<ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform duration-300 ${isModelsOpen ? 'rotate-180' : ''}`} />
			</button>
			<AnimatePresence>
				{isModelsOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className={`${mobile ? "mt-2" : "absolute left-0"
							} z-10 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5`}
					>
						<div
							className="py-1 flex flex-col"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="models-menu"
						>
							{urls.map((model) => (
								<NavLink key={model.id} to={`/models/${model.name}`} mobile={mobile}>
									{model.name}
								</NavLink>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);

	const handleLogout = async () => {
		try {
			await signOut();
			setShowDropdown(false);
			navigate('/');
			toast.info('Logged out successfully!');
		} catch (error) {
			toast.error('Error logging out: ' + error.message);
		}
	};

	return (
		<nav className="bg-gray-800 p-4">
			<ToastContainer limit={1} />
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Link to="/" className="text-white text-2xl font-normal">
							VisionaryAI
						</Link>
					</motion.div>

					<div className="hidden md:flex items-center justify-center flex-1">
						<div className="flex items-baseline space-x-4">
							<NavLink to="/">Home</NavLink>
							{user && <ModelsDropdown />}
							<NavLink to="/about">About</NavLink>
							<NavLink to="/team">Team</NavLink>
							<NavLink to="/contact">Contact</NavLink>
							<NavLink to="/project-details">Project Details</NavLink>
							{user && user.email === 'gruheshkurra2@gmail.com' && (
								<NavLink to="/manage-urls">Manage URLs</NavLink>
							)}
						</div>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						{!user ? (
							<>
								<Link
									to="/login"
									className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Login
								</Link>
								<Link
									to="/signup"
									className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Sign Up
								</Link>
							</>
						) : (
							<div className="relative">
								<button
									onClick={() => setShowDropdown(!showDropdown)}
									className="text-white flex items-center hover:text-gray-300"
								>
									<UserCircleIcon className="h-6 w-6 mr-2" />
									Profile
								</button>
								<AnimatePresence>
									{showDropdown && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.2 }}
											className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1"
										>
											<Link
												to="/profile"
												className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
											>
												Profile
											</Link>
											<Link
												to="/cloud-storage"
												className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
											>
												Cloud Storage
											</Link>
											<Link
												to="/chat-history"
												className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
											>
												Chat History
											</Link>
											<button
												onClick={handleLogout}
												className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
											>
												Logout
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
					</div>

					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							type="button"
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
						>
							<span className="sr-only">Open main menu</span>
							{isOpen ? (
								<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
							) : (
								<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
							)}
						</button>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="md:hidden"
					>
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							<NavLink to="/" mobile>
								Home
							</NavLink>
							{user && <ModelsDropdown mobile />}
							<NavLink to="/about" mobile>
								About
							</NavLink>
							<NavLink to="/team" mobile>
								Team
							</NavLink>
							<NavLink to="/contact" mobile>
								Contact
							</NavLink>
							<NavLink to="/project-details" mobile>
								Project Details
							</NavLink>
							{user && user.email === 'gruheshkurra2@gmail.com' && (
								<NavLink to="/manage-urls" mobile>Manage URLs</NavLink>
							)}
						</div>
						<div className="pt-4 pb-3 border-t border-gray-700">
							<div className="flex items-center px-5">
								{!user ? (
									<>
										<Link
											to="/login"
											className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
										>
											Login
										</Link>
										<Link
											to="/signup"
											className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-500"
										>
											Sign Up
										</Link>
									</>
								) : (
									<div className="flex flex-col">
										<Link
											to="/profile"
											className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
										>
											Profile
										</Link>
										<Link
											to="/cloud-storage"
											className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
										>
											Cloud Storage
										</Link>
										<Link
											to="/chat-history"
											className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
										>
											Chat History
										</Link>
										<button
											onClick={handleLogout}
											className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
										>
											Logout
										</button>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;