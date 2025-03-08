import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice'
import { FaHome, FaSearch } from 'react-icons/fa'
// import { MdOutlineExplore } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import WhiteLogo from '../../../x-logo/WhiteLogo.png'

const LeftSidebar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [])

    const { user } = useSelector(state => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/login')
    }

    return (
        <div className="fixed text-white w-80 h-full border-r-1 border-white/20">
            <div className='flex flex-col gap-40'>
                <div className='relative top-3 left-12 flex flex-col items-start gap-10'>
                    <Link to='/home'>
                        <img src={WhiteLogo} alt="X | Logo" className='w-7 relative left-3 top-1' />
                    </Link>
                    <div className="flex flex-col gap-2">
                        <Link to="/home">
                            <button className="flex items-center gap-4 font-semibold text-2xl w-35 h-12 cursor-pointer hover:bg-gray-800 rounded-full">
                                <span></span><FaHome size={22} /> Home
                            </button>
                        </Link>

                        <Link to="/explore">
                            <button className="flex items-center gap-4 font-semibold text-2xl w-38 h-12 cursor-pointer hover:bg-gray-800 rounded-full">
                                <span></span><FaSearch size={22} /> Explore
                            </button>
                        </Link>

                        <Link to="/notifications">
                            <button className="flex items-center gap-4 font-semibold text-2xl w-54 h-12 cursor-pointer hover:bg-gray-800 rounded-full">
                                <span></span><IoIosNotifications size={22} /> Notifications
                            </button>
                        </Link>

                        <Link to="/profile">
                            <button className="flex items-center gap-4 font-semibold text-2xl w-36 h-12 cursor-pointer hover:bg-gray-800 rounded-full">
                                <span></span><CgProfile size={22} /> Profile
                            </button>
                        </Link>
                    </div>

                    <button className="bg-white text-black font-bold text-lg rounded-full w-50 h-12 cursor-pointer hover:bg-white/90">
                        Post
                    </button>
                </div>
                <div className="relative left-15">
                    <button className='flex items-center gap-4 text-xl w-40 h-12 cursor-pointer hover:bg-gray-800 rounded-full' onClick={onLogout}><span></span>Logout {user ? user.name : null}</button>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar