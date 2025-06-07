import XSvg from "../../components/svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useAuthStore } from "../../store/authStore";
import { FaUserFriends } from "react-icons/fa";

const Sidebar = () => {
	const { logout, user } = useAuthStore();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const navItems = [
		{
			path: '/',
			icon: <MdHomeFilled className="w-6 h-6 lg:w-7 lg:h-7" />,
			label: 'Home'
		},
		{
			path: '/notifications',
			icon: <IoNotifications className="w-5 h-5 lg:w-6 lg:h-6" />,
			label: 'Notifications'
		},
		{
			path: '/find-friends',
			icon: <FaUserFriends className="w-5 h-5 lg:w-6 lg:h-6" />,
			label: 'Friends'
		},
		{
			path: `/profile/${user?.username}`,
			icon: <FaUser className="w-5 h-5 lg:w-6 lg:h-6" />,
			label: 'Profile'
		}
	];

	const renderNavItem = ({ path, icon, label }) => (
		<li className="flex justify-center md:justify-start" key={path}>
			<Link
				to={path}
				className="flex items-center gap-3 py-2 px-3 hover:bg-stone-900 transition-all rounded-full duration-300 w-full max-w-[160px]"
			>
				{icon}
				<span className="text-base lg:text-lg hidden md:inline">{label}</span>
			</Link>
		</li>
	);

	const renderUserProfile = () => {
		if (!user) return null;

		return (
			<Link
				to={`/profile/${user.username}`}
				className="mt-auto mb-6 flex items-center gap-3 px-3 py-2 hover:bg-[#181818] rounded-full transition-all duration-300"
			>
				<div className="avatar hidden md:inline-flex">
					<div className="w-8 lg:w-10 rounded-full">
						<img 
							src={user.profileImg || "/avatar-placeholder.png"} 
							alt={`${user.fullname}'s profile`}
						/>
					</div>
				</div>
				<div className="flex justify-between items-center w-full">
					<div className="hidden md:block overflow-hidden">
						<p className="text-white font-bold text-sm truncate w-24 lg:w-32">
							{user.fullname}
						</p>
						<p className="text-slate-500 text-sm truncate">
							@{user.username}
						</p>
					</div>
					<BiLogOut
						className="w-5 h-5 cursor-pointer ml-2"
						onClick={(e) => {
							e.preventDefault();
							handleLogout();
						}}
					/>
				</div>
			</Link>
		);
	};

	return (
		<div className="w-16 sm:w-20 md:w-24 lg:w-56 xl:w-64">
			<div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700">
				<Link to="/" className="flex justify-center md:justify-start px-2 pt-2">
					<XSvg className="w-10 h-10 md:w-12 md:h-12 fill-white rounded-full hover:bg-stone-900" />
				</Link>

				<ul className="flex flex-col gap-3 mt-6">
					{navItems.map(renderNavItem)}
				</ul>

				{renderUserProfile()}
			</div>
		</div>
	);
};

export default Sidebar;
