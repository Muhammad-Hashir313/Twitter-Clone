import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Loader from "../components/Loader";
import LeftSidebar from "./left sidebar/LeftSidebar";
// import RightSidebar from './right sidebar/RightSidebar'
import TweetForm from "../components/TweetForm";
import TweetItem from "../components/TweetItem";
import { getAllTweets, resetTweets } from '../features/tweets/tweetSlice'

const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector(state => state.auth)
    const { tweets, isError, isLoading, message } = useSelector(state => state.tweets);

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (!user) {
            navigate("/login");
        }

        dispatch(getAllTweets());

        return () => {
            dispatch(resetTweets());
        };
    }, [user, navigate, isError, message, dispatch]);

    const date = new Date(user.createdAt)
    const formattedDate = format(date, 'd MMMM yyyy')

    const [activeTab, setActiveTab] = useState("For You");

    if (isLoading) {
        return <Loader />
    }

    return (
        <>
            <LeftSidebar />
            {/* <RightSidebar /> */}
            <div className="relative h-13 left-80 flex border-b border-white/20  w-159 text-white">
                <div
                    className={`flex flex-col w-1/2 text-center justify-center font-bold relative cursor-pointer hover:bg-white/10 ${activeTab === "For You" ? "text-white" : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("For You")}
                >
                    For you
                    {activeTab === "For You" && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-500 rounded-full"></div>
                    )}
                </div>
                <div
                    className={`flex flex-col w-1/2 text-center justify-center font-bold relative cursor-pointer hover:bg-white/10 ${activeTab === "Following" ? "text-white" : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("Following")}
                >
                    Following
                    {activeTab === "Following" && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-500 rounded-full"></div>
                    )}
                </div>
            </div>
            {activeTab === 'For You' ? (
                <>
                    <TweetForm />
                    {/* Tweets */}
                    <div className='relative left-80 text-white'>
                        {
                            tweets.map((tweet) => (
                                <TweetItem tweet={tweet} date={formattedDate} key={tweet.ID} />
                            ))
                        }
                    </div>
                </>
            ) : (
                <div className='text-white'>
                    <h1>Following</h1>
                </div>
            )}
        </>
    );
};

export default Home;
