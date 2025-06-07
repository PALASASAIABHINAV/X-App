import { useEffect, useState } from "react";

import CreatePost from "./CreatePost";
import Posts from "../common/Posts";
import { usePostStore } from "../../store/postStore";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	const { fetchPosts } = usePostStore();

	useEffect(() => {
		const loadPosts = async () => {
			try {
				await fetchPosts(feedType);
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			}
		};

		loadPosts();
	}, [feedType, fetchPosts]);

	const feedTypes = [
		{ id: "forYou", label: "For you" },
		{ id: "following", label: "Following" }
	];

	const renderFeedTabs = () => (
		<div className="flex w-full border-b border-gray-700">
			{feedTypes.map(({ id, label }) => (
				<div
					key={id}
					className="flex justify-center flex-1 p-3 hover:bg-lightGray transition duration-300 cursor-pointer relative"
					onClick={() => setFeedType(id)}
				>
					{label}
					{feedType === id && (
						<div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
					)}
				</div>
			))}
		</div>
	);

	return (
		<div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
			{/* Header */}
			{renderFeedTabs()}

			{/* Create Post Input */}
			<CreatePost />

			{/* Posts Feed */}
			<Posts feedType={feedType} />
		</div>
	);
};

export default HomePage;