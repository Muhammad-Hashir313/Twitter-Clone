import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaCalendarAlt } from 'react-icons/fa'
import { format } from 'date-fns'
import LeftSidebar from './LeftSidebar'
import { followUser, getUserProfile, unfollowUser, getFollowers, getFollowing } from '../../features/auth/authSlice'
import Loader from '../../components/Loader'
import TweetItem from '../../components/TweetItem'

const UserProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { name } = useParams()

    const { user, anotherUser, isLoading, isError, message, followers, following } = useSelector(state => state.auth)

    useEffect(() => {
        if (isError) {
            console.error(message)
        }

        if (name.toLowerCase() === user?.name?.toLowerCase()) {
            navigate('/profile')
        } else {
            dispatch(getUserProfile(name))
        }

        if (anotherUser?.userData?.ID) {
            dispatch(getFollowers(anotherUser?.userData?.ID))
            dispatch(getFollowing(anotherUser?.userData?.ID))
        }

    }, [dispatch, name, user?.name, navigate, isError, message, anotherUser?.userData?.ID]);

    const getDate = (creation) => {
        const date = new Date(creation);
        return format(date, 'MMMM yyyy');
    };

    const [activeTab, setActiveTab] = useState("Posts");
    const [follow, setFollow] = useState(false)

    useEffect(() => {
        if (anotherUser) {
            if (anotherUser.isFollowing !== undefined) {
                setFollow(anotherUser.isFollowing === 1);
            }
        }
    }, [anotherUser]);

    const getFollowDetails = () => {
        dispatch(getFollowers(anotherUser?.userData?.ID))
        dispatch(getFollowing(anotherUser?.userData?.ID))
    }

    const handleFollow = (e) => {
        e.preventDefault()

        if (follow) {
            dispatch(unfollowUser(anotherUser.userData.ID)).then(() => {
                dispatch(getUserProfile(name)).then(getFollowDetails);
            });
        } else {
            dispatch(followUser(anotherUser.userData.ID)).then(() => {
                dispatch(getUserProfile(name)).then(getFollowDetails);
            });
        }

        setFollow(!follow)
    }

    const tabs = ["Posts", "Replies", "Articles", "Media", "Likes"];

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-black flex">
            <LeftSidebar />

            {/* Main Content */}
            <div className="flex-1" style={{ paddingLeft: '320px' }}>
                <div className="min-h-screen w-full max-w-4xl">
                    {/* Sticky Header */}
                    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/20">
                        <div className="h-14 flex items-center">
                            <div className="w-4"></div> {/* Left spacer */}
                            <Link to="/home" className="flex items-center justify-center hover:bg-white/10 w-9 h-9 rounded-full transition-colors">
                                <FaArrowLeft size={18} className="text-white" />
                            </Link>
                            <div className="flex-1" style={{ marginLeft: '32px' }}>
                                <h1 className="text-xl font-bold text-white">{anotherUser?.userData?.NAME}</h1>
                                <p className="text-sm text-gray-500">{anotherUser?.totalResult?.length || 0} posts</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="relative">
                        {/* Cover Photo */}
                        <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-700 relative">
                            {/* Follow/Unfollow Button */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={handleFollow}
                                    className={`rounded-full font-semibold transition-all duration-200 h-9 ${follow
                                        ? 'border border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-400'
                                        : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                    style={{ paddingLeft: '24px', paddingRight: '24px' }}
                                >
                                    {follow ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        </div>

                        {/* Profile Picture - Positioned to not overlap */}
                        <div className="relative bg-black" style={{ height: '84px' }}>
                            <div className="absolute top-0 left-4" style={{ transform: 'translateY(-50%)' }}>
                                <div className="w-32 h-32 rounded-full border-4 border-black bg-gray-900 flex items-center justify-center">
                                    <FaUser className="text-gray-400 text-4xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info - No overlap with proper spacing */}
                    <div className="bg-black" style={{ paddingLeft: '16px', paddingRight: '16px', paddingBottom: '16px' }}>
                        {anotherUser?.userData && (
                            <>
                                <div style={{ marginBottom: '12px' }}>
                                    <h1 className="text-2xl font-bold text-white">{anotherUser.userData.NAME}</h1>
                                    <p className="text-gray-500">@{anotherUser.userData.NAME}</p>
                                </div>

                                <div className="flex items-center text-gray-500" style={{ marginBottom: '16px' }}>
                                    <FaCalendarAlt className="text-gray-500" size={14} />
                                    <span style={{ marginLeft: '8px' }}>Joined {getDate(anotherUser.userData.CREATED_AT)}</span>
                                </div>

                                {/* Follow Stats */}
                                <div className="flex" style={{ gap: '24px' }}>
                                    <div className="cursor-pointer hover:underline">
                                        <span className="text-white font-bold">{following?.following || 0}</span>
                                        <span className="text-gray-500" style={{ marginLeft: '4px' }}>Following</span>
                                    </div>
                                    <div className="cursor-pointer hover:underline">
                                        <span className="text-white font-bold">{followers?.followers || 0}</span>
                                        <span className="text-gray-500" style={{ marginLeft: '4px' }}>Followers</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-white/20">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`flex-1 text-center font-semibold transition-colors hover:bg-white/5 relative ${activeTab === tab
                                        ? 'text-white'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                    style={{ paddingTop: '16px', paddingBottom: '16px' }}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-1/2 w-12 h-1 bg-blue-500 rounded-full" style={{ transform: 'translateX(-50%)' }}></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="divide-y divide-gray-800/40">
                        {anotherUser?.totalResult?.length > 0 ? (
                            anotherUser.totalResult.map((tweet, index) => (
                                <div key={index} className="hover:bg-gray-950/50 transition-colors">
                                    <TweetItem
                                        tweet={tweet}
                                        user={tweet.NAME}
                                        date={getDate(tweet.TWEET_CREATED_AT)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center" style={{ marginBottom: '16px' }}>
                                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white" style={{ marginBottom: '8px' }}>Nothing to show</h3>
                                <p className="text-gray-500">This user hasn't posted anything yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    .flex-1[style*="paddingLeft"] {
                        padding-left: 260px !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .flex-1[style*="paddingLeft"] {
                        padding-left: 0 !important;
                        padding-top: 56px !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default UserProfile