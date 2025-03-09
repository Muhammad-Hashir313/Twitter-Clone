import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTweets, resetTweets } from "../features/tweets/tweetSlice";
import Loader from "../components/Loader";
import LeftSidebar from "./left sidebar/LeftSidebar";
import TweetForm from "../components/TweetForm";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { tweets, isError, isLoading, message } = useSelector((state) => state.tweets);

    const [activeTab, setActiveTab] = useState("For You");

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (!user) {
            navigate("/login");
        }

        dispatch(getTweets());

        return () => {
            dispatch(resetTweets());
        };
    }, [user, navigate, isError, message, dispatch]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <LeftSidebar />
            <div className="relative h-13 left-80 flex border-b border-white/20  w-160 text-white">
                <div
                    className={`flex flex-col w-1/2 text-center py-3 font-bold relative cursor-pointer hover:bg-white/10 ${activeTab === "For You" ? "text-white" : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("For You")}
                >
                    For you
                    {activeTab === "For You" && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-500 rounded-full"></div>
                    )}
                </div>
                <div
                    className={`w-1/2 text-center py-3 font-bold relative cursor-pointer hover:bg-white/10 ${activeTab === "Following" ? "text-white" : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("Following")}
                >
                    Following
                    {activeTab === "Following" && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-500 rounded-full"></div>
                    )}
                </div>
            </div>
            {activeTab === 'For You' ? (<TweetForm />) : (
                <div className='text-white'>
                    <h1>Following</h1>
                </div>
            )}
        </>
    );
};

export default Home;
