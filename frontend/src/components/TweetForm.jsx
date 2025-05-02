import { useState, useEffect } from "react";
// import { toast } from 'react-toastify'
import { useDispatch } from "react-redux";
import { createTweet, getAllTweets } from '../features/tweets/tweetSlice'
import { FaTimes, FaImage, FaSmile, FaCalendarAlt, FaMapMarkerAlt, FaPlusCircle } from "react-icons/fa";

const TweetForm = ({ showPopup, setShowPopup, onCreatePost }) => {
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const handlePost = (e) => {
        onCreatePost(text)

        setText('')
    }

    // useEffect(() => {
    //     window.location.reload()
    // }, [dispatch])

    return (
        <div className="flex flex-col items-center w-320">
            <div className={`flex flex-col gap-2 w-150 bg-black text-white rounded-lg`}>
                <div className="flex flex-col gap-5">
                    <div className={`${showPopup && "h-10"} flex justify-between items-center`}>
                        {showPopup && (<FaTimes onClick={() => setShowPopup(false)} className="cursor-pointer text-gray-400 hover:text-white" />)}
                    </div>
                    <div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <textarea
                                className="w-full bg-transparent outline-none text-lg placeholder-gray-500 resize-none"
                                placeholder="What is happening?!"
                                rows={3}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center border-t border-gray-700 h-13">
                        <div className="flex gap-3 text-blue-500">
                            <FaImage className="cursor-pointer" />
                            <FaPlusCircle className="cursor-pointer" />
                            <FaSmile className="cursor-pointer" />
                            <FaCalendarAlt className="cursor-pointer" />
                            <FaMapMarkerAlt className="cursor-pointer" />
                        </div>
                        <button
                            className={`w-16 h-9 rounded-full text-white ${!text.trim() ? " bg-gray-500" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"}`}
                            disabled={!text.trim()}
                            onClick={handlePost}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default TweetForm