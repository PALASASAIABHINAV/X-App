import { FaHeart, FaRegComment, FaTrash, FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { usePostStore } from "../../store/postStore";
import toast from "react-hot-toast";

const Post = ({ post, feedType }) => {
  const [comment, setComment] = useState("");
  const { user } = useAuthStore();
  const { deletePost, isLoading, likePost, commentPost } = usePostStore();
  const postOwner = post.user;
  const isLiked = post.likes.includes(user._id);
  const isMyPost = user._id === postOwner._id;

  // Format post creation time
  const formattedDate = (() => {
    const now = new Date();
    const created = new Date(post.createdAt);
    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  })();

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await deletePost(post._id, feedType);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await commentPost(post._id, comment, feedType);
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleLikePost = async () => {
    try {
      await likePost(post._id, feedType);
      toast.success(isLiked ? "Post unliked successfully" : "Post liked successfully");
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
      toast.error("Failed to update like status");
    }
  };

  const renderComments = () => (
    <div className="flex flex-col gap-3 max-h-60 overflow-auto">
      {post.comments.length === 0 ? (
        <p className="text-sm text-slate-500">
          No comments yet 🤔 Be the first one 😉
        </p>
      ) : (
        post.comments.map((comment) => (
          <div key={comment._id} className="flex gap-2 items-start">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={comment.user.profileImg || "/avatar-placeholder.png"} alt="user avatar" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold">{comment.user.fullname}</span>
                <span className="text-gray-700 text-sm">@{comment.user.username}</span>
              </div>
              <div className="text-sm">{comment.text}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link to={`/profile/${postOwner.username}`} className="w-8 rounded-full overflow-hidden">
          <img src={postOwner.profileImg || "/avatar-placeholder.png"} alt="user avatar" />
        </Link>
      </div>

      <div className="flex flex-col flex-1">
        {/* Post Header */}
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullname}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />
            </span>
          )}
        </div>

        {/* Post Content */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="post content"
            />
          )}
        </div>

        {/* Post Actions */}
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            {/* Comments */}
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => document.getElementById(`comments_modal${post._id}`).showModal()}
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>

            {/* Comments Modal */}
            <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                {renderComments()}
                <form className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2" onSubmit={handlePostComment}>
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : "Post"}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>

            {/* Repost */}
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
            </div>

            {/* Like */}
            <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
              {isLiked ? (
                <FaHeart className="w-4 h-4 cursor-pointer text-red-500" />
              ) : (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              )}
              <span className={`text-sm ${isLiked ? "text-red-500" : "text-slate-500 group-hover:text-pink-500"}`}>
                {post.likes.length}
              </span>
            </div>
          </div>

          {/* Bookmark */}
          <div className="flex w-1/3 justify-end gap-2 items-center">
            <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
