import React from 'react'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import { format } from 'date-fns'
import LeftSidebar from './LeftSidebar'
import RightSidebar from '../right sidebar/RightSidebar'
import { Link } from 'react-router-dom'

const Profile = () => {
    const { user } = useSelector(state => state.auth)

    const date = new Date(user.createdAt)
    const formattedDate = format(date, 'MMMM yyyy')

    return (
        <div className='bg-black text-white'>
            <LeftSidebar />
            <RightSidebar />
            <div>
                {/* Sticky Header */}
                <div className="sticky top-0 left-80 w-160.5 backdrop-blur-lg flex items-center bg-black/50 border-b border-white/20">
                    <Link to="/home">
                        <div className="flex items-center justify-center hover:bg-white/20 w-10 h-10 rounded-full cursor-pointer">
                            <FaArrowLeft size={20} />
                        </div>
                    </Link>
                    <h1 className="text-xl font-semibold ml-4">{user.name}</h1>
                </div>

                {/* Profile Photo */}
                <div className="relative left-80">
                    <div className="bg-gray-800 h-50 w-160.5"></div> {/*coverphoto*/}
                    <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                        <FaUser className='text-white w-28 h-28 rounded-full border-4 border-black bg-gray-950' />
                    </div>
                </div>

                {/* User Info */}
                <div className='relative left-85 top-15'>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-gray-400">@{user.name}</p>
                            <p className="text-gray-400 mt-1">📅 Joined {formattedDate || "April 2022"}</p>
                        </div>
                        <button className="border border-gray-500 px-4 py-2 rounded-full hover:bg-white/10">
                            Edit profile
                        </button>
                    </div>

                    {/* Follow Info */}
                    <div className="flex gap-4 mt-3">
                        <p className="text-gray-400">
                            <span className="text-white font-bold">{user.following || 0}</span> Following
                        </p>
                        <p className="text-gray-400">
                            <span className="text-white font-bold">{user.followers || 0}</span> Followers
                        </p>
                    </div>
                    <div className='border-b border-white/20 w-160.5 relative -left-5 top-2'></div>
                </div>
            </div>
        </div>
    )
}

export default Profile