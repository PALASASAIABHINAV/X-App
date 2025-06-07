import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const FindFriends = () => {
    const { allUsers, isLoading, error, user } = useAuthStore();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [displayCount, setDisplayCount] = useState(6); // Initial display count

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://x-app-backend.vercel.app/api/users/getallusers', {
                    withCredentials: true
                });
                if (response.data) {
                    useAuthStore.setState({ allUsers: response.data });
                    setFilteredUsers(response.data.slice(0, displayCount)); // Show only first 6 users initially
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(allUsers.slice(0, displayCount)); // Show only first 6 users when no search
            return;
        }

        const filtered = allUsers.filter(user => 
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered); // Show all filtered results when searching
    }, [searchQuery, allUsers, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 6); // Load 6 more users
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-4">
                {error}
            </div>
        );
    }

    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Find Friends</h1>
                    <div className="flex items-center gap-2">
                        {/* Search Icon Button */}
                        <button
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
                        >
                            <FaSearch className="w-5 h-5" />
                        </button>
                        
                        {/* Animated Search Input */}
                        <div className={`relative transition-all duration-300 ease-in-out ${isSearchVisible ? 'w-64' : 'w-0'}`}>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full bg-gray-800 text-white px-4 py-2 rounded-full outline-none transition-all duration-300 ${
                                    isSearchVisible ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4">
                <div className="grid gap-4">
                    {filteredUsers.map((otherUser) => (
                        <Link 
                            key={otherUser._id} 
                            to={`/profile/${otherUser.username}`}
                            className="block hover:bg-gray-800/50 transition-colors duration-200 rounded-lg overflow-hidden"
                        >
                            <div className="relative">
                                {/* Cover Image */}
                                <div className="h-32 w-full">
                                    <img 
                                        src={otherUser.coverImg || "/cover.png"} 
                                        alt="cover"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Profile Section */}
                                <div className="p-4 bg-gray-800">
                                    <div className="flex items-start gap-4">
                                        {/* Profile Image */}
                                        <div className="relative -mt-12">
                                            <img 
                                                src={otherUser.profileImg || "/avatar-placeholder.png"} 
                                                alt={otherUser.fullname}
                                                className="w-20 h-20 rounded-full border-4 border-gray-800"
                                            />
                                        </div>
                                        
                                        {/* User Info */}
                                        <div className="flex-1">
                                            <h2 className="font-bold text-lg">{otherUser.fullname}</h2>
                                            <p className="text-gray-400">@{otherUser.username}</p>
                                            {otherUser.bio && (
                                                <p className="text-sm text-gray-300 mt-2">{otherUser.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More Button - Only show when not searching and there are more users */}
                {!searchQuery && allUsers.length > displayCount && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-200"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindFriends; 