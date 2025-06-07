import { Link } from "react-router-dom";
import { useEffect } from "react";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { usePostStore } from "../../store/postStore";

const RightPanel = () => {
  const { suggestUsers, suggestedUsers, isLoading, followUser } = usePostStore();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        await suggestUsers();
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleFollowUser = async (e, userId) => {
    e.preventDefault();
    try {
      await followUser(userId);
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  const renderEmptyState = () => (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <>
      <RightPanelSkeleton />
      <RightPanelSkeleton />
      <RightPanelSkeleton />
      <RightPanelSkeleton />
    </>
  );

  const renderUserList = () => (
    suggestedUsers?.map((user) => (
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center justify-between gap-4"
        key={user._id}
      >
        <div className="flex gap-2 items-center">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img 
                src={user.profileImg || "/avatar-placeholder.png"} 
                alt={`${user.fullname}'s profile`}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight truncate w-28">
              {user.fullname}
            </span>
            <span className="text-sm text-slate-500">
              @{user.username}
            </span>
          </div>
        </div>
        <div>
          <button
            className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
            onClick={(e) => handleFollowUser(e, user._id)}
          >
            {user.following.includes(user._id) ? "Unfollow" : "Follow"}
            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          </button>
        </div>
      </Link>
    ))
  );

  if (suggestedUsers.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading ? renderLoadingState() : renderUserList()}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
