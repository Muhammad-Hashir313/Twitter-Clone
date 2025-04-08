import { useEffect, useState } from "react";
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart, FaUser, FaTrash } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { deleteTweet, getTweets, getLikes, likeTweet, unlikeTweet } from '../features/tweets/tweetSlice'


const TweetItem = ({ tweet, date }) => {
    const dispatch = useDispatch()
    const { isError, message } = useSelector(state => state.tweets)
    const user = useSelector(state => state.auth.user)

    const [likesCount, setLikesCount] = useState(0)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        const fetchLikes = async () => {
            const res = await dispatch(getLikes(tweet.ID)).unwrap()
            console.log(res);

            setLikesCount(res.likes)
        }

        fetchLikes()

    }, [dispatch, tweet.ID])

    const toggle = () => {

    }

    return (
        <div className="hover:bg-white/10 transition cursor-pointer w-160.5 h-full relative top-3">
            <div className="h-2"></div>
            <div className="border-b border-white/20 flex gap-3">
                {/* Profile Picture */}
                <div className="relative left-1">
                    <FaUser size={22} />
                </div>

                {/* Tweet Content */}
                <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{tweet.NAME}</span>
                            <span className="text-gray-400">@{tweet.NAME} · {date}</span>
                        </div>
                        {tweet.NAME == user.name && <span onClick={() => dispatch(deleteTweet(tweet.ID)).then(() => dispatch(getTweets()))} className="flex gap-1 hover:text-blue-400 cursor-pointer relative -left-2">
                            <FaTrash size={10} />
                        </span>}
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
                            <FaRegHeart /><span>{likesCount}</span>
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
