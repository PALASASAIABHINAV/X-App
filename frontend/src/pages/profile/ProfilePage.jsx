import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../common/Posts";
import ProfileHeaderSkeleton from "../skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { usePostStore } from "../../store/postStore";
import { useAuthStore } from "../../store/authStore";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const { username } = useParams();
  const { user: userOfAuthenticated } = useAuthStore();

  const {
    profile: user,
    isLoading,
    userProfile,
    followUser,
    fetchUserPosts,
    updateProfileImages,
    posts
  } = usePostStore();

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const isMyProfile = username === userOfAuthenticated.username;

  useEffect(() => {
    userProfile(username);
    if (username) {
      fetchUserPosts(username); // fetch only that user's posts
    }
  }, [username]);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState(null); // 'profile' or 'cover'
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setImageType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpdate = async () => {
    if (!selectedImage || !imageType) {
      toast.error("Please select an image to update");
      return;
    }

    try {
      setIsUpdating(true);
      const updateData = {
        fullname: user.fullname,
        email: user.email,
        bio: user.bio,
        link: user.link,
        [imageType === 'profile' ? 'profileImg' : 'coverImg']: selectedImage
      };

      await updateProfileImages(updateData);
      
      // Clear the selected image
      setSelectedImage(null);
      setImageType(null);
      
      // Refresh the profile data
      await userProfile(username);
    } catch (error) {
      console.error("Failed to update image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {isLoading && <ProfileHeaderSkeleton />}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullname}</p>
                  <span className="text-sm text-slate-500">
                    {posts?.length||0} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={selectedImage && imageType === 'cover' ? selectedImage : user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'cover')}
                />
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'profile')}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={selectedImage && imageType === 'profile' ? selectedImage : user?.profileImg || "/avatar-placeholder.png"}
                      alt="profile"
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={async () => {
                      await followUser(user._id); // make this return new profile or isFollowing
                      if (user?.followers?.includes(userOfAuthenticated?._id)) {
                        toast.success("UnFollowed successfully");
                      } else {
                        toast.success("Followed successfully");
                      }

                      await userProfile(username);
                    }}
                  >
                    {user?.followers?.includes(userOfAuthenticated?._id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
                {selectedImage && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={handleImageUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      Joined{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div className="flex justify-center flex-1 p-3  relative">
                  Posts
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                </div>
              </div>
            </>
          )}

          <Posts />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
