import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from "../features/auth/authSlice";
import Loader from '../components/Loader'
import WhiteLogo from "../../x-logo/WhiteLogo.png";

const Login = () => {
    const [isEmail, setIsEmail] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/home')
        }

        const timer = setTimeout(() => {
            dispatch(reset())
        }, 1000)

        return () => clearTimeout(timer)

    }, [user, isError, isSuccess, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSignIn = (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please enter all fields')
        } else {
            const userData = {
                email, password
            }

            dispatch(login(userData))
        }
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
            {/* Animated background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div
                className={`
                    relative z-10 w-full max-w-md
                    transform transition-all duration-500 ease-out
                    ${isHovered ? 'scale-105' : 'scale-100'}
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glassmorphism container */}
                <div className="relative">
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-sm"></div>

                    <div className="relative bg-black/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl">
                        {/* Close button */}
                        <div className="flex justify-start h-12 items-center">
                            <Link to='/'>
                                <button className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800/50 rounded-full transition-colors text-xl font-bold">
                                    ×
                                </button>
                            </Link>
                        </div>

                        {/* Content */}
                        <div className="relative left-7 flex flex-col items-center space-y-8 gap-6">
                            {/* Logo */}
                            <div className="flex flex-col items-center space-y-2 relative -left-7">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <img src={WhiteLogo} alt="X | Logo" className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Sign in to X
                                </h1>
                            </div>

                            {/* Form */}
                            <div className="flex flex-col w-full space-y-6 gap-5">
                                <div className="flex flex-col w-full max-w-sm mx-auto gap-2">
                                    {/* Email Input */}
                                    <div className="relative">
                                        <label
                                            className={`
                                                absolute left-4 transition-all duration-200 pointer-events-none
                                                ${isEmail || email
                                                    ? "text-xs top-2 text-blue-400 bg-black"
                                                    : "text-gray-400 top-4"
                                                }
                                            `}
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full h-14 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                                            onFocus={() => setIsEmail(true)}
                                            onBlur={() => setIsEmail(false)}
                                            onChange={onChange}
                                            value={email}
                                            required
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative">
                                        <label
                                            className={`
                                                absolute left-4 transition-all duration-200 pointer-events-none
                                                ${isPassword || password
                                                    ? "text-xs top-2 text-blue-400 bg-black"
                                                    : "text-gray-400 top-4"
                                                }
                                            `}
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="w-full h-14 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                                            onFocus={() => setIsPassword(true)}
                                            onBlur={() => setIsPassword(false)}
                                            value={password}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="w-full max-w-sm mx-auto flex flex-col gap-2">
                                    <button
                                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                                        onClick={onSignIn}
                                    >
                                        <span className="relative z-10">Sign in</span>
                                    </button>

                                    <button className="w-full h-12 border border-gray-600 text-gray-300 font-medium rounded-full hover:bg-gray-800/30 hover:border-gray-500 transition-all duration-200">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Sign up link */}
                                <div className="text-center relative -left-6">
                                    <p className="text-gray-400 text-sm">
                                        Don't have an account?{' '}
                                        <Link to={'/register'}>
                                            <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium transition-colors">
                                                Sign up
                                            </span>
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Bottom spacing */}
                            <div className="h-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;