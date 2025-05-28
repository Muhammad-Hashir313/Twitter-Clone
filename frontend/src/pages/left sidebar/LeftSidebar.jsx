import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice'
import { FaHome, FaSearch, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa'
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import WhiteLogo from '../../../x-logo/WhiteLogo.png'

const LeftSidebar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    }, [user, navigate])

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
        setIsMobileMenuOpen(false)
    }

    const isActive = (path) => location.pathname === path

    const navItems = [
        { path: '/home', icon: FaHome, label: 'Home' },
        { path: '/explore', icon: FaSearch, label: 'Explore' },
        { path: '/notifications', icon: IoIosNotifications, label: 'Notifications' },
        { path: '/message', icon: FaEnvelope, label: 'Messages' },
        { path: '/profile', icon: CgProfile, label: 'Profile' }
    ]

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            {/* Mobile Menu Button - Fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/20 h-14 flex items-center justify-between lg:hidden">
                <div className="flex items-center">
                    <div style={{ width: '16px' }}></div>
                    <Link to='/home'>
                        <img src={WhiteLogo} alt="X | Logo" className='w-6 h-6' />
                    </Link>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="text-white hover:bg-white/10 rounded-full transition-colors"
                    style={{ width: '40px', height: '40px' }}
                >
                    {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
                <div style={{ width: '16px' }}></div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileMenu}></div>
            )}

            {/* Desktop Sidebar */}
            <div className="fixed left-0 top-0 h-screen bg-black border-r border-white/20 z-50 hidden lg:flex flex-col" style={{ width: '320px' }}>
                {/* Logo Section */}
                <div className="flex items-center h-16 border-b border-white/10">
                    <div style={{ width: '48px' }}></div>
                    <Link to='/home'>
                        <img src={WhiteLogo} alt="X | Logo" className='w-8 h-8' />
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <div style={{ height: '24px' }}></div>
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <Link key={path} to={path}>
                                <div className={`
                                    h-14 rounded-full flex items-center gap-4 text-xl font-medium
                                    transition-all duration-200 cursor-pointer
                                    ${isActive(path)
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }
                                `} style={{ marginLeft: '12px', marginRight: '12px' }}>
                                    <div style={{ width: '24px' }}></div>
                                    <Icon size={24} />
                                    <span>{label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Post Button */}
                    <div style={{ height: '32px' }}></div>
                    <div style={{ marginLeft: '24px', marginRight: '24px' }}>
                        <Link to='/home'>
                            <button className="w-full h-12 bg-white text-black font-bold text-lg rounded-full hover:bg-white/90 transition-colors">
                                Post
                            </button>
                        </Link>
                    </div>
                </div>

                {/* User Section */}
                <div className="border-t border-white/10">
                    <div style={{ height: '16px' }}></div>
                    <div style={{ marginLeft: '12px', marginRight: '12px' }}>
                        <button
                            onClick={onLogout}
                            className='w-full h-12 text-white text-lg rounded-full hover:bg-white/5 transition-colors flex items-center gap-3'
                        >
                            <div style={{ width: '24px' }}></div>
                            <span>Logout</span>
                            {user && <span className="text-gray-400">({user.name})</span>}
                        </button>
                    </div>
                    <div style={{ height: '16px' }}></div>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            <div className={`
                fixed top-0 left-0 h-screen bg-black border-r border-white/20 z-50 
                transition-transform duration-300 ease-in-out lg:hidden flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `} style={{ width: '280px' }}>
                {/* Logo Section */}
                <div className="flex items-center h-16 border-b border-white/10">
                    <div style={{ width: '24px' }}></div>
                    <Link to='/home' onClick={closeMobileMenu}>
                        <img src={WhiteLogo} alt="X | Logo" className='w-8 h-8' />
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <div style={{ height: '24px' }}></div>
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <Link key={path} to={path} onClick={closeMobileMenu}>
                                <div className={`
                                    h-14 rounded-full flex items-center gap-4 text-xl font-medium
                                    transition-all duration-200 cursor-pointer
                                    ${isActive(path)
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }
                                `} style={{ marginLeft: '12px', marginRight: '12px' }}>
                                    <div style={{ width: '24px' }}></div>
                                    <Icon size={24} />
                                    <span>{label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Post Button */}
                    <div style={{ height: '32px' }}></div>
                    <div style={{ marginLeft: '24px', marginRight: '24px' }}>
                        <button
                            className="w-full h-12 bg-white text-black font-bold text-lg rounded-full hover:bg-white/90 transition-colors"
                            onClick={closeMobileMenu}
                        >
                            Post
                        </button>
                    </div>
                </div>

                {/* User Section */}
                <div className="border-t border-white/10">
                    <div style={{ height: '16px' }}></div>
                    <div style={{ marginLeft: '12px', marginRight: '12px' }}>
                        <button
                            onClick={onLogout}
                            className='w-full h-12 text-white text-lg rounded-full hover:bg-white/5 transition-colors flex items-center gap-3'
                        >
                            <div style={{ width: '24px' }}></div>
                            <span>Logout</span>
                            {user && <span className="text-gray-400">({user.name})</span>}
                        </button>
                    </div>
                    <div style={{ height: '16px' }}></div>
                </div>
            </div>
        </>
    );
};

export default LeftSidebar;