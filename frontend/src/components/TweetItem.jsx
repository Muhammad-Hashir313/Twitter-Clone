import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import {
    FaRegComment,
    FaRetweet,
    FaRegHeart,
    FaHeart,
    FaUser,
    FaTrash,
    FaClock,
    FaCheckCircle
} from "react-icons/fa";
import { FiShare, FiMoreHorizontal } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteTweet,
    getLikes,
    likeTweet,
    unlikeTweet,
    getComments,
    addComment,
    deleteComment,
    getAllTweets
} from '../features/tweets/tweetSlice';
import { useLocation } from "react-router-dom";

const TweetItem = ({ tweet, user, date }) => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.auth.user)
    const location = useLocation();

    // LIKES
    const tweet_id = parseInt(tweet.ID)
    const tweetLikes = useSelector(state => state.tweets.tweetLikes[tweet_id]) || {};
    const { likes = 0, liked = false } = tweetLikes;

    // COMMENTS
    const tweetComments = useSelector(state => state.tweets.comments[tweet_id]) || [];
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
        dispatch(getLikes(tweet_id));
        dispatch(getComments(tweet_id));
    }, [dispatch, tweet_id]);

    const toggle = () => {
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 300);

        if (liked) {
            dispatch(unlikeTweet(tweet_id)).then(() => dispatch(getLikes(tweet_id)));
        } else {
            dispatch(likeTweet(tweet_id)).then(() => dispatch(getLikes(tweet_id)));
        }
    };

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            dispatch(addComment({ tweetId: tweet_id, content: commentText }))
                .then(() => {
                    dispatch(getComments(tweet_id));
                    setCommentText('');
                });
        }
    };

    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment({ tweetId: tweet_id, commentId }))
            .then(() => dispatch(getComments(tweet_id)));
    };

    const handleDeleteTweet = () => {
        dispatch(deleteTweet(tweet_id)).then(() => dispatch(getAllTweets()));
    };

    return (
        <article className="group relative">
            {/* Hover gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <div className="
                relative border-b border-gray-800/50 
                hover:border-gray-700/50 transition-all duration-300
                backdrop-blur-sm
            ">
                <div className="flex gap-4 w-full">
                    <div className="w-4"></div> {/* Spacer */}

                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative">
                        <div className="relative group/avatar">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-800 group-hover/avatar:ring-blue-500/50 transition-all duration-300">
                                <FaUser className="text-white text-lg" />
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Connection line for threading */}
                        <div className="absolute top-14 left-6 w-0.5 bg-gradient-to-b from-gray-700 to-transparent h-full opacity-30"></div>
                    </div>

                    {/* Tweet Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <Link to={`/profile/${user?.toLowerCase()}`} className="hover:underline">
                                    <span className="font-bold text-white hover:text-blue-400 transition-colors">
                                        {user}
                                    </span>
                                </Link>
                                <FaCheckCircle className="text-blue-500 text-sm flex-shrink-0" />
                                <span className="text-gray-500 text-sm">@{user}</span>
                                <span className="text-gray-600">·</span>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <FaClock className="text-xs" />
                                    <span>{date}</span>
                                </div>
                            </div>

                            {/* Actions menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800/50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <FiMoreHorizontal className="text-gray-500" />
                                </button>

                                {showActions && (
                                    <div className="absolute right-0 top-8 bg-black border border-gray-700 rounded-xl shadow-xl z-50 min-w-[160px]">
                                        {(tweet.NAME === loggedInUser.name || location.pathname === "/profile") && (
                                            <button
                                                onClick={handleDeleteTweet}
                                                className="w-full flex items-center gap-3 hover:bg-red-500/10 text-red-400 h-12 border-b border-gray-800 last:border-b-0"
                                            >
                                                <div className="w-4"></div>
                                                <FaTrash className="text-sm" />
                                                <span className="text-sm">Delete</span>
                                            </button>
                                        )}
                                        <button className="w-full flex items-center gap-3 hover:bg-gray-800/50 text-gray-300 h-12">
                                            <div className="w-4"></div>
                                            <FiShare className="text-sm" />
                                            <span className="text-sm">Copy link</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tweet Text */}
                        {tweet.TEXT && (
                            <div className="text-white text-lg leading-relaxed">
                                <p>{tweet.TEXT}</p>
                            </div>
                        )}

                        {/* Tweet Image */}
                        {tweet.IMAGE && (
                            <div className="rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <img
                                    src={tweet.IMAGE}
                                    alt="Tweet image"
                                    className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}

                        {/* Tweet Actions */}
                        <div className="flex items-center justify-between text-gray-500 text-sm max-w-md">
                            <button
                                className="flex items-center gap-2 hover:text-blue-400 transition-colors group/btn rounded-full hover:bg-blue-500/10 h-8 min-w-[60px] justify-center"
                                onClick={() => setShowComments(!showComments)}
                            >
                                <FaRegComment className="group-hover/btn:scale-110 transition-transform" />
                                <span className="font-medium">{tweetComments.length}</span>
                            </button>

                            <button className="flex items-center gap-2 hover:text-green-400 transition-colors group/btn rounded-full hover:bg-green-500/10 h-8 min-w-[60px] justify-center">
                                <FaRetweet className="group-hover/btn:scale-110 transition-transform" />
                                <span className="font-medium">0</span>
                            </button>

                            <button
                                className={`flex items-center gap-2 transition-all group/btn rounded-full h-8 min-w-[60px] justify-center ${liked ? 'text-red-500 hover:bg-red-500/10' : 'hover:text-red-400 hover:bg-red-500/10'
                                    }`}
                                onClick={toggle}
                            >
                                {liked ? (
                                    <FaHeart className={`group-hover/btn:scale-110 transition-transform ${isLikeAnimating ? 'animate-bounce' : ''}`} />
                                ) : (
                                    <FaRegHeart className="group-hover/btn:scale-110 transition-transform" />
                                )}
                                <span className="font-medium">{likes}</span>
                            </button>

                            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group/btn rounded-full hover:bg-blue-500/10 h-8 w-8 justify-center">
                                <FiShare className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Comment Section */}
                        {showComments && (
                            <div className="border-l-2 border-gray-800/50 space-y-4">
                                <div className="w-4"></div> {/* Spacer */}

                                {/* Add Comment */}
                                <div className="flex gap-3 items-start">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaUser className="text-white text-xs" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl h-12 text-white outline-none focus:border-blue-500/50 focus:bg-gray-900/80 transition-all duration-200"
                                                placeholder="Tweet your reply..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleCommentSubmit}
                                                disabled={!commentText.trim()}
                                                className={`
                                                    h-9 rounded-full font-medium text-sm transition-all duration-200
                                                    ${commentText.trim() ?
                                                        'bg-blue-500 hover:bg-blue-600 text-white min-w-[80px] hover:scale-105' :
                                                        'bg-gray-700 text-gray-400 cursor-not-allowed min-w-[80px]'
                                                    }
                                                `}
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* List Comments */}
                                <div className="space-y-3">
                                    {tweetComments.map(comment => (
                                        <div
                                            key={comment.COMMENT_ID}
                                            className="flex gap-3 group/comment rounded-xl hover:bg-gray-900/30 transition-colors duration-200"
                                        >
                                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaUser className="text-white text-xs" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/profile/${comment.NAME ? comment.NAME.toLowerCase() : 'user'}`}
                                                        className="font-semibold text-white hover:text-blue-400 transition-colors text-sm"
                                                    >
                                                        @{comment.NAME || "user"}
                                                    </Link>
                                                    <span className="text-gray-600 text-xs">just now</span>
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed">{comment.CONTENT}</p>
                                                {user.ID === comment.USER_ID && (
                                                    <button
                                                        className="text-red-400 text-xs hover:text-red-300 transition-colors opacity-0 group-hover/comment:opacity-100"
                                                        onClick={() => handleDeleteComment(comment.COMMENT_ID)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-4"></div> {/* Spacer */}
                </div>
                <div className="h-4"></div> {/* Bottom spacer */}
            </div>
        </article>
    );
};

export default TweetItem;