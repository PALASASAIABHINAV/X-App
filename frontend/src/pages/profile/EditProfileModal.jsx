import { useState, useEffect } from "react";
import { usePostStore } from "../../store/postStore";
import toast from "react-hot-toast";

const EditProfileModal = () => {
	const { updateProfile, profile } = usePostStore();
	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		currentPassword: "",
		newPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (profile) {
			setFormData(prev => ({
				...prev,
				fullname: profile.fullname || "",
				username: profile.username || "",
				email: profile.email || "",
				bio: profile.bio || "",
				link: profile.link || "",
				currentPassword: "",
				newPassword: "",
			}));
		}
	}, [profile]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validate password fields
			if (formData.newPassword && !formData.currentPassword) {
				toast.error("Please enter your current password");
				setIsLoading(false);
				return;
			}

			if (formData.currentPassword && !formData.newPassword) {
				toast.error("Please enter a new password");
				setIsLoading(false);
				return;
			}

			if (formData.newPassword && formData.newPassword.length < 6) {
				toast.error("New password must be at least 6 characters long");
				setIsLoading(false);
				return;
			}

			const updateData = {
				fullname: formData.fullname.trim(),
				username: formData.username,
				email: formData.email,
				bio: formData.bio.trim(),
				link: formData.link.trim(),
			};

			// Only include password fields if they are both filled
			if (formData.currentPassword && formData.newPassword) {
				updateData.currentPassword = formData.currentPassword;
				updateData.newPassword = formData.newPassword;
			}

			await updateProfile(updateData);
			document.getElementById("edit_profile_modal").close();
			toast.success("Profile updated successfully");
			
			// Reset password fields
			setFormData(prev => ({
				...prev,
				currentPassword: "",
				newPassword: "",
			}));
		} catch (error) {
			console.error("Failed to update profile:", error);
			toast.error(error.response?.data?.message || "Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<button
				className="btn btn-outline rounded-full btn-sm hover:bg-gray-800 transition-colors duration-200"
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>

			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box border rounded-md border-gray-700 shadow-md max-w-2xl">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-bold text-xl">Update Profile</h3>
						<button 
							onClick={() => document.getElementById("edit_profile_modal").close()}
							className="btn btn-ghost btn-sm btn-circle"
						>
							✕
						</button>
					</div>

					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div className="flex flex-wrap gap-4">
							<div className="flex-1 min-w-[250px]">
								<label className="label">
									<span className="label-text">Full Name</span>
								</label>
								<input
									type="text"
									placeholder="Enter your full name"
									className="input input-bordered w-full"
									value={formData.fullname}
									name="fullname"
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="flex-1 min-w-[250px]">
								<label className="label">
									<span className="label-text">Username</span>
								</label>
								<input
									type="text"
									placeholder="Username"
									className="input input-bordered w-full bg-gray-100"
									value={formData.username}
									name="username"
									readOnly
									disabled
								/>
							</div>
						</div>

						<div className="flex flex-wrap gap-4">
							<div className="flex-1 min-w-[250px]">
								<label className="label">
									<span className="label-text">Email</span>
								</label>
								<input
									type="email"
									placeholder="Email"
									className="input input-bordered w-full bg-gray-100"
									value={formData.email}
									name="email"
									readOnly
									disabled
								/>
							</div>
							<div className="flex-1 min-w-[250px]">
								<label className="label">
									<span className="label-text">Bio</span>
								</label>
								<textarea
									placeholder="Tell us about yourself"
									className="textarea textarea-bordered w-full h-24 resize-none"
									value={formData.bio}
									name="bio"
									onChange={handleInputChange}
									maxLength={160}
								/>
							</div>
						</div>

						<div className="flex-1 min-w-[250px]">
							<label className="label">
								<span className="label-text">Website</span>
							</label>
							<input
								type="url"
								placeholder="https://your-website.com"
								className="input input-bordered w-full"
								value={formData.link}
								name="link"
								onChange={handleInputChange}
							/>
						</div>

						{/* Password Change Section */}
						<div className="border-t border-gray-700 pt-4 mt-4">
							<h4 className="font-semibold mb-4">Change Password</h4>
							<div className="flex flex-wrap gap-4">
								<div className="flex-1 min-w-[250px]">
									<label className="label">
										<span className="label-text">Current Password</span>
									</label>
									<input
										type="password"
										placeholder="Enter current password"
										className="input input-bordered w-full"
										value={formData.currentPassword}
										name="currentPassword"
										onChange={handleInputChange}
									/>
								</div>
								<div className="flex-1 min-w-[250px]">
									<label className="label">
										<span className="label-text">New Password</span>
									</label>
									<input
										type="password"
										placeholder="Enter new password"
										className="input input-bordered w-full"
										value={formData.newPassword}
										name="newPassword"
										onChange={handleInputChange}
										minLength={6}
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-2 mt-2">
							<button 
								type="button"
								className="btn btn-ghost rounded-full"
								onClick={() => {
									document.getElementById("edit_profile_modal").close();
									setFormData(prev => ({
										...prev,
										currentPassword: "",
										newPassword: "",
									}));
								}}
							>
								Cancel
							</button>
							<button 
								type="submit" 
								className="btn btn-primary rounded-full text-white"
								disabled={isLoading}
							>
								{isLoading ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									"Update Profile"
								)}
							</button>
						</div>
					</form>
				</div>

				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;