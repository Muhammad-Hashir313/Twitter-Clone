import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import { format } from 'date-fns'
import LeftSidebar from './LeftSidebar'
// import RightSidebar from '../right sidebar/RightSidebar'
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

        if (name.toLowerCase() == user.name.toLowerCase()) {
            navigate('/profile')
        } else {
            dispatch(getUserProfile(name))
        }

        if (anotherUser?.userData?.ID) {
            dispatch(getFollowers(anotherUser?.userData?.ID))
            dispatch(getFollowing(anotherUser?.userData?.ID))
        }

    }, [dispatch, name, user.name, navigate, isError, message, anotherUser?.userData?.ID]);

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

    return (
        <div className='bg-black text-white'>
            <LeftSidebar />
            {/* <RightSidebar /> */}
            <div>
                {/* Sticky Header */}
                <div className="sticky top-0 left-80 w-160.5 backdrop-blur-lg flex items-center bg-black/50 border-b border-white/20">
                    <Link to="/home">
                        <div className="flex items-center justify-center hover:bg-white/20 w-10 h-10 rounded-full cursor-pointer">
                            <FaArrowLeft size={20} />
                        </div>
                    </Link>
                    <h1 className="text-xl font-semibold ml-4">{anotherUser?.userData?.NAME}</h1>
                </div>

                {/* Profile Photo */}
                <div className="relative left-80">
                    <div className="bg-gray-800 h-50 w-160.5"></div> {/*coverphoto*/}
                    <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                        <FaUser className='text-white w-28 h-28 rounded-full border-4 border-black bg-gray-950' />
                    </div>
                </div>

                <div className='relative left-205 top-3'>
                    <button
                        onClick={handleFollow}
                        className={`border w-30 h-8 cursor-pointer rounded-full
                        ${follow ? ("border-gray-500 hover:bg-white/10") : ("border-blue-500 bg-blue-700 hover:bg-blue-500")}`}>
                        {
                            follow ? 'Unfollow' : 'Follow'
                        }
                    </button>
                </div>

                {/* User Info */}
                <div className='relative left-85 top-10'>
                    <div className="flex justify-between items-center">
                        <div>
                            {anotherUser?.userData && (
                                <>
                                    <h1 className="text-2xl font-bold">{anotherUser?.userData?.NAME}</h1>
                                    <p className="text-gray-400">@{anotherUser?.userData?.NAME}</p>
                                    <p className="text-gray-400 mt-1">📅 Joined {getDate(anotherUser?.userData?.CREATED_AT)}</p>
                                </>
                            )}

                        </div>
                    </div>

                    {/* Follow Info */}
                    <div className="flex gap-4">
                        <p className="text-gray-400 cursor-pointer hover:underline">
                            <span className='text-white font-bold '>{following.following}</span> Following
                        </p>
                        <p className="text-gray-400 cursor-pointer hover:underline">
                            <span className="text-white font-bold">{followers.followers}</span> Followers
                        </p>
                    </div>
                </div>

                {/* Posts Part */}
                <ul className='relative grid grid-cols-5 left-80 top-12 w-160.5 text-center'>
                    <li className={`cursor-pointer h-13 flex flex-col justify-center font-bold hover:bg-white/10 ${activeTab === 'Posts' ? 'text-white' : "text-gray-500"}`}
                        onClick={() => setActiveTab('Posts')}>Posts</li>
                    {activeTab === "Posts" && (
                        <div className="absolute bottom-0 left-9 w-70 flex">
                            <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                    width: "20%",
                                    transform: `translateX(${["Posts", "Replies", "Articles", "Media", "Likes"].indexOf(activeTab) * 100}%)`,
                                }}
                            ></div>
                        </div>
                    )}

                    <li className={`cursor-pointer h-13 flex flex-col justify-center font-bold hover:bg-white/10 ${activeTab === 'Replies' ? 'text-white' : "text-gray-500"}`}
                        onClick={() => setActiveTab('Replies')}>Replies</li>
                    {activeTab === "Replies" && (
                        <div className="absolute bottom-0 left-27 w-70 flex">
                            <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                    width: "20%",
                                    transform: `translateX(${["Posts", "Replies", "Articles", "Media", "Likes"].indexOf(activeTab) * 100}%)`,
                                }}
                            ></div>
                        </div>
                    )}

                    <li className={`cursor-pointer h-13 flex flex-col justify-center font-bold hover:bg-white/10 ${activeTab === 'Articles' ? 'text-white' : "text-gray-500"}`}
                        onClick={() => setActiveTab('Articles')}>Articles</li>
                    {activeTab === "Articles" && (
                        <div className="absolute bottom-0 left-45 w-70 flex">
                            <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                    width: "20%",
                                    transform: `translateX(${["Posts", "Replies", "Articles", "Media", "Likes"].indexOf(activeTab) * 100}%)`,
                                }}
                            ></div>
                        </div>
                    )}

                    <li className={`cursor-pointer h-13 flex flex-col justify-center font-bold hover:bg-white/10 ${activeTab === 'Media' ? 'text-white' : "text-gray-500"}`}
                        onClick={() => setActiveTab('Media')}>Media</li>
                    {activeTab === "Media" && (
                        <div className="absolute bottom-0 left-65 w-68 flex">
                            <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                    width: "20%",
                                    transform: `translateX(${["Posts", "Replies", "Articles", "Media", "Likes"].indexOf(activeTab) * 100}%)`,
                                }}
                            ></div>
                        </div>
                    )}

                    <li className={`cursor-pointer h-13 flex flex-col justify-center font-bold hover:bg-white/10 ${activeTab === 'Likes' ? 'text-white' : "text-gray-500"}`}
                        onClick={() => setActiveTab('Likes')}>Likes</li>
                    {activeTab === "Likes" && (
                        <div className="absolute bottom-0 left-82 w-70 flex">
                            <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                    width: "20%",
                                    transform: `translateX(${["Posts", "Replies", "Articles", "Media", "Likes"].indexOf(activeTab) * 100}%)`,
                                }}
                            ></div>
                        </div>
                    )}
                    <div className='border-b border-white/20 w-160.5'></div>
                </ul>

                {/* Tweets */}
                <div className='relative left-80 top-9'>
                    {anotherUser?.totalResult?.length > 0 ? (
                        anotherUser.totalResult.map((tweet, index) => (
                            <div key={index}>
                                <TweetItem tweet={tweet} user={tweet.NAME} date={getDate(tweet.TWEET_CREATED_AT)} />
                            </div>
                        ))
                    ) : (<h1 className='relative top-4 left-1.5'>Nothing to show</h1>)}
                </div>
            </div>
        </div >
    )
}

export default UserProfile