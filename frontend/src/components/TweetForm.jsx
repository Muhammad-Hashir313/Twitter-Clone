import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTweet, getAllTweets } from '../features/tweets/tweetSlice'
import { FaTimes, FaImage, FaSmile, FaCalendarAlt, FaMapMarkerAlt, FaPlusCircle, FaUser } from "react-icons/fa";

const TweetForm = ({ showPopup, setShowPopup, onCreatePost }) => {
    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isHovered, setIsHovered] = useState(false)
    const dispatch = useDispatch()

    const handlePost = async (e) => {
        const formData = new FormData()
        formData.append('text', text)
        if (image) formData.append('image', image)

        try {
            await onCreatePost(formData)
            setText('')
            setImage(null)
            setImagePreview(null)
        } catch (err) {
            console.error("Failed to post tweet:", err)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImage(null)
        setImagePreview(null)
    }

    return (
        <div className="flex justify-center items-start w-full">
            <div className={`
                relative w-full max-w-2xl
                bg-gradient-to-br from-gray-900 via-black to-gray-900
                border border-gray-800/50 rounded-2xl
                backdrop-blur-xl
                shadow-2xl shadow-blue-500/10
                transition-all duration-500 ease-out
                ${isHovered ? 'transform scale-[1.02] shadow-blue-500/20' : ''}
            `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-sm"></div>
                <div className="relative bg-black/80 rounded-2xl border border-gray-800/30">

                    {/* Header */}
                    <div className="flex items-center justify-between h-16 border-b border-gray-800/50">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-4"></div> {/* Spacer */}
                            <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                What's happening?
                            </h3>
                        </div>
                        {showPopup && (
                            <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-800/50 transition-colors cursor-pointer"
                                onClick={() => setShowPopup(false)}>
                                <FaTimes className="text-gray-400 hover:text-white transition-colors" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Main input area */}
                        <div className="flex gap-4 w-full">
                            <div className="w-4"></div> {/* Spacer */}

                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <FaUser className="text-white text-lg" />
                                </div>
                            </div>

                            {/* Text area */}
                            <div className="flex-1 space-y-4">
                                <textarea
                                    className="
                                        w-full bg-transparent outline-none 
                                        text-white text-xl placeholder-gray-500 
                                        resize-none leading-relaxed
                                        transition-all duration-300
                                        min-h-[120px]
                                    "
                                    placeholder="What's on your mind? Share something amazing..."
                                    rows={4}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    required
                                />

                                {/* Image preview */}
                                {imagePreview && (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <button
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                                        >
                                            <FaTimes className="text-white text-sm" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="w-4"></div> {/* Spacer */}
                        </div>

                        {/* Actions bar */}
                        <div className="flex items-center justify-between border-t border-gray-800/50 h-16">
                            <div className="flex items-center gap-6 w-full">
                                <div className="w-4"></div> {/* Spacer */}
                                <div className="w-12"></div> {/* Avatar space */}

                                <div className="flex items-center gap-4 text-blue-400">
                                    <label htmlFor="file-upload" className="cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500/10 transition-colors group-hover:scale-110 transform duration-200">
                                            <FaImage className="text-lg group-hover:text-blue-300" />
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500/10 transition-colors cursor-pointer hover:scale-110 transform duration-200">
                                        <FaPlusCircle className="text-lg hover:text-blue-300" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-500/10 transition-colors cursor-pointer hover:scale-110 transform duration-200">
                                        <FaSmile className="text-lg hover:text-yellow-400" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-500/10 transition-colors cursor-pointer hover:scale-110 transform duration-200">
                                        <FaCalendarAlt className="text-lg hover:text-green-400" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors cursor-pointer hover:scale-110 transform duration-200">
                                        <FaMapMarkerAlt className="text-lg hover:text-red-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Character count indicator */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-8 h-8">
                                    <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            fill="none"
                                            className="stroke-gray-700"
                                            strokeWidth="3"
                                        />
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            fill="none"
                                            className={`transition-all duration-300 ${text.length > 240 ? 'stroke-red-500' :
                                                text.length > 200 ? 'stroke-yellow-500' :
                                                    'stroke-blue-500'
                                                }`}
                                            strokeWidth="3"
                                            strokeDasharray={`${(text.length / 280) * 100} 100`}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                        {280 - text.length}
                                    </span>
                                </div>

                                <button
                                    className={`
                                        relative overflow-hidden
                                        min-w-[100px] h-10 rounded-full
                                        font-semibold text-white text-sm
                                        transition-all duration-300 transform
                                        ${!text.trim() && !image ?
                                            "bg-gray-700 cursor-not-allowed opacity-50" :
                                            "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                                        }
                                    `}
                                    disabled={!text.trim() && !image}
                                    onClick={handlePost}
                                >
                                    <span className="relative z-10">Share</span>
                                    {text.trim() || image ? (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                                    ) : null}
                                </button>
                                <div className="w-4"></div> {/* Spacer */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TweetForm