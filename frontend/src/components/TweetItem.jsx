import { useEffect } from "react";
import { FaRegComment, FaRetweet, FaRegHeart, FaUser } from "react-icons/fa";
import { FiShare } from "react-icons/fi";

const TweetItem = ({ user, tweet, date }) => {
    useEffect(() => {
        console.log(tweet)
    }, [])

    return (
        <div className="hover:bg-white/10 transition cursor-pointer w-160.5 h-full">
            <div className="border-b border-white/20 flex gap-3 relative top-3">
                {/* Profile Picture */}
                <div className="relative left-1">
                    <FaUser size={22} />
                </div>

                {/* Tweet Content */}
                <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{user.name}</span>
                        <span className="text-gray-400">@{user.name} · {date}</span>
                    </div>

                    {/* Tweet Text */}
                    <p className="text-white mt-1">{tweet.TEXT}</p>

                    {/* Tweet Actions */}
                    <div className="flex justify-between text-gray-500 text-sm w-4/5">
                        <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                            <FaRegComment /> <span>0</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer">
                            <FaRetweet /> <span>0</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-red-400 cursor-pointer">
                            <FaRegHeart /> <span>0</span>
                        </div>
                        <div className="hover:text-blue-400 cursor-pointer">
                            <FiShare />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetItem;
