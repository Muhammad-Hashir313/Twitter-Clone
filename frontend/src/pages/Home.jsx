import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Loader from "../components/Loader";
import LeftSidebar from "./left sidebar/LeftSidebar";
// import RightSidebar from './right sidebar/RightSidebar'
import TweetForm from "../components/TweetForm";
import TweetItem from "../components/TweetItem";
import { getAllTweets, resetTweets, createTweet } from '../features/tweets/tweetSlice'

const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector(state => state.auth)
    const error = useSelector(state => state.auth.isError)
    const { tweets, isError, isLoading, message } = useSelector(state => state.tweets);

    useEffect(() => {
        if (isError || error) {
            toast.error(message);
        }

        if (!user) {
            navigate("/login");
        }

        dispatch(getAllTweets());

        return () => {
            dispatch(resetTweets());
        };
    }, [user, navigate, isError, message, dispatch]);

    const getDate = (creation) => {
        if (!creation) return "Unknown";
        const date = new Date(creation);
        if (isNaN(date)) return "Invalid";
        return format(date, 'MMMM yyyy');
    };

    const [activeTab, setActiveTab] = useState("For You");

    const handleCreatePost = (post) => {
        dispatch(createTweet(post)).then(() => {
            dispatch(getAllTweets())
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-black">
            <LeftSidebar />
            {/* <RightSidebar /> */}

            {/* Main Content Container */}
            <div className="ml-80 min-h-screen">
                {/* Header with Tabs */}
                <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
                    <div className="flex h-14">
                        <button
                            className={`flex-1 flex items-center justify-center font-semibold text-base transition-all duration-200 hover:bg-gray-900/50 relative group ${activeTab === "For You" ? "text-white" : "text-gray-500 hover:text-gray-300"
                                }`}
                            onClick={() => setActiveTab("For You")}
                        >
                            <span className="relative">
                                For you
                                {activeTab === "For You" && (
                                    <div className="absolute -bottom-3.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
                                )}
                                {activeTab !== "For You" && (
                                    <div className="absolute -bottom-3.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-transparent group-hover:bg-gray-600 transition-colors duration-200 rounded-full"></div>
                                )}
                            </span>
                        </button>

                        <button
                            className={`flex-1 flex items-center justify-center font-semibold text-base transition-all duration-200 hover:bg-gray-900/50 relative group ${activeTab === "Following" ? "text-white" : "text-gray-500 hover:text-gray-300"
                                }`}
                            onClick={() => setActiveTab("Following")}
                        >
                            <span className="relative">
                                Following
                                {activeTab === "Following" && (
                                    <div className="absolute -bottom-3.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
                                )}
                                {activeTab !== "Following" && (
                                    <div className="absolute -bottom-3.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-transparent group-hover:bg-gray-600 transition-colors duration-200 rounded-full"></div>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-2xl">
                    {activeTab === 'For You' ? (
                        <div>
                            {/* Tweet Form */}
                            <div className="border-b border-gray-800">
                                <TweetForm onCreatePost={handleCreatePost} />
                            </div>

                            {/* Tweets Feed */}
                            <div className="divide-y divide-gray-800">
                                {tweets.length > 0 ? (
                                    tweets.map((tweet) => (
                                        <div
                                            key={tweet.ID}
                                            className="hover:bg-gray-950/50 transition-colors duration-200"
                                        >
                                            <TweetItem
                                                tweet={tweet}
                                                user={tweet.NAME}
                                                date={getDate(tweet.CREATED_AT)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-4 text-center h-96">
                                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">No tweets yet</h3>
                                            <p className="text-gray-500 text-sm">When people you follow tweet, you'll see them here.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 space-y-4">
                            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white">Welcome to your timeline</h2>
                                <p className="text-gray-500">Follow accounts to see their latest tweets here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;