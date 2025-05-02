import { useEffect, useState } from "react";
import {
    FaRegComment,
    FaRetweet,
    FaRegHeart,
    FaHeart,
    FaUser,
    FaTrash
} from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteTweet,
    getTweets,
    getLikes,
    likeTweet,
    unlikeTweet,
    getComments,
    addComment,
    deleteComment
} from '../features/tweets/tweetSlice';

const TweetItem = ({ tweet, user, date }) => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.auth.user)

    // LIKES
    const tweetLikes = useSelector(state => state.tweets.tweetLikes[tweet.ID]) || {};
    const { likes = 0, liked = false } = tweetLikes;

    // COMMENTS
    const tweetComments = useSelector(state => state.tweets.comments[tweet.ID]) || [];
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        dispatch(getLikes(tweet.ID));
        dispatch(getComments(tweet.ID));

    }, [dispatch, tweet.ID]);

    const toggle = () => {
        if (liked) {
            dispatch(unlikeTweet(tweet.ID)).then(() => dispatch(getLikes(tweet.ID)));
        } else {
            dispatch(likeTweet(tweet.ID)).then(() => dispatch(getLikes(tweet.ID)));
        }
    };

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            dispatch(addComment({ tweetId: tweet.ID, content: commentText }))
                .then(() => {
                    dispatch(getComments(tweet.ID));
                    setCommentText('');
                });
        }
    };

    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment({ tweetId: tweet.ID, commentId }))
            .then(() => dispatch(getComments(tweet.ID)));
    };

    return (
        <div className="hover:bg-white/10 transition cursor-pointer w-160.5 h-full relative top-3">
            <div className="h-2"></div>
            <div className="border-b border-white/20 flex gap-3 px-3 py-2">
                {/* Profile Picture */}
                <div className="relative left-1">
                    <FaUser size={22} />
                </div>

                {/* Tweet Content */}
                <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{user}</span>
                            <span className="text-gray-400">@{user} · {date}</span>
                        </div>
                        {tweet.NAME === loggedInUser.name && (
                            <span
                                onClick={() =>
                                    dispatch(deleteTweet(tweet.ID)).then(() => dispatch(getTweets()))
                                }
                                className="flex gap-1 hover:text-blue-400 cursor-pointer relative -left-2"
                            >
                                <FaTrash size={10} />
                            </span>
                        )}
                    </div>

                    {/* Tweet Text */}
                    <p className="text-white mt-1">{tweet.TEXT}</p>

                    {/* Tweet Actions */}
                    <div className="flex justify-between text-gray-500 text-sm w-4/5 mt-2">
                        <div
                            className="flex items-center gap-1 hover:text-blue-400 cursor-pointer"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <FaRegComment />
                            <span>{tweetComments.length}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer">
                            <FaRetweet /> <span>0</span>
                        </div>
                        <div
                            className="flex items-center gap-1 hover:text-red-400 cursor-pointer"
                            onClick={toggle}
                        >
                            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            <span>{likes}</span>
                        </div>
                        <div className="hover:text-blue-400 cursor-pointer">
                            <FiShare />
                        </div>
                    </div>

                    {/* Comment Section */}
                    {showComments && (
                        <div className="mt-4 space-y-2">
                            {/* Add Comment */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="bg-transparent border-b border-white/30 text-white flex-1 outline-none"
                                    placeholder="Reply to this tweet..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button
                                    onClick={handleCommentSubmit}
                                    className="text-blue-400 hover:underline"
                                >
                                    Reply
                                </button>
                            </div>

                            {/* List Comments */}
                            {tweetComments.map(comment => (
                                <div
                                    key={comment.COMMENT_ID}
                                    className="text-white text-sm ml-4 border-l border-white/20 pl-3 py-1 relative"
                                >
                                    <span className="font-semibold">@{comment.NAME || "user"} - </span> {comment.CONTENT}
                                    {user.ID === comment.USER_ID && (
                                        <button
                                            className="text-red-400 text-xs ml-2 hover:underline"
                                            onClick={() => handleDeleteComment(comment.COMMENT_ID)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TweetItem;
