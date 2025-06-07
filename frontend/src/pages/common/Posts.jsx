import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { usePostStore } from "../../store/postStore";

const Posts = ({ feedType }) => {
	const { posts, isLoading } = usePostStore();

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				await usePostStore.getState().fetchPosts(feedType);
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			}
		};

		fetchPosts();
	}, [feedType]);

	const renderLoadingState = () => (
		<div className="flex flex-col justify-center">
			<PostSkeleton />
			<PostSkeleton />
			<PostSkeleton />
		</div>
	);

	const renderEmptyState = () => (
		<p className="text-center my-4">No posts in this tab. Switch 👻</p>
	);

	const renderPosts = () => (
		<div>
			{posts.map((post) => (
				<Post 
					key={post._id} 
					post={post} 
					feedType={feedType} 
				/>
			))}
		</div>
	);

	return (
		<>
			{isLoading && renderLoadingState()}
			{!isLoading && posts?.length === 0 && renderEmptyState()}
			{!isLoading && posts && renderPosts()}
		</>
	);
};

export default Posts;