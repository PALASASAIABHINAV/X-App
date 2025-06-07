import { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";
import { usePostStore } from "../../store/postStore";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const imgRef = useRef(null);

	const { user } = useAuthStore();
	const { createPost, error, isLoading } = usePostStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!text.trim() && !img) {
			toast.error("Please add some text or an image");
			return;
		}

		try {
			await createPost({ text, image: img });
			setText("");
			setImg(null);
			if (imgRef.current) {
				imgRef.current.value = null;
			}
			toast.success("Post created successfully");
		} catch (error) {
			console.error("Failed to create post:", error);
			toast.error("Failed to create post");
		}
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size should be less than 5MB");
			return;
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			setImg(reader.result);
		};
		reader.onerror = () => {
			toast.error("Failed to read image file");
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = () => {
		setImg(null);
		if (imgRef.current) {
			imgRef.current.value = null;
		}
	};

	const onEmojiClick = (emojiObject) => {
		setText(prevText => prevText + emojiObject.emoji);
		setShowEmojiPicker(false);
	};

	const renderImagePreview = () => {
		if (!img) return null;

		return (
			<div className="relative w-72 mx-auto">
				<IoCloseSharp
					className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
					onClick={handleRemoveImage}
				/>
				<img 
					src={img} 
					className="w-full mx-auto h-72 object-contain rounded" 
					alt="Post preview"
				/>
			</div>
		);
	};

	return (
		<div className="flex p-4 items-start gap-4 border-b border-gray-700">
			<div className="avatar">
				<div className="w-8 rounded-full">
					<img 
						src={user.profileImg || "/avatar-placeholder.png"} 
						alt={`${user.fullname}'s profile`}
					/>
				</div>
			</div>

			<form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
				<textarea
					className="textarea w-full p-0 text-lg resize-none pt-2 border-none focus:outline-none border-gray-800"
					placeholder="  What is happening?!"
					value={text}
					onChange={(e) => setText(e.target.value)}
					maxLength={500}
				/>

				{renderImagePreview()}

				<div className="flex justify-between border-t py-2 border-t-gray-700">
					<div className="flex gap-1 items-center relative">
						<CiImageOn
							className="fill-primary w-6 h-6 cursor-pointer"
							onClick={() => imgRef.current?.click()}
						/>
						<BsEmojiSmileFill 
							className="fill-primary w-5 h-5 cursor-pointer" 
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						/>
						{showEmojiPicker && (
							<div className="absolute top-10 left-0 z-50">
								<EmojiPicker
									onEmojiClick={onEmojiClick}
									theme="dark"
									width={350}
									height={400}
								/>
							</div>
						)}
					</div>

					<input 
						type="file" 
						accept="image/*" 
						hidden 
						ref={imgRef} 
						onChange={handleImgChange}
					/>

					<button 
						className="btn btn-primary rounded-full btn-sm text-white px-4"
						disabled={isLoading || (!text.trim() && !img)}
					>
						{isLoading ? "Posting..." : "Post"}
					</button>
				</div>

				{error && (
					<div className="text-red-500 text-sm mt-1">
						{error}
					</div>
				)}
			</form>
		</div>
	);
};

export default CreatePost;