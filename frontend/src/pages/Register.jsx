import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from "../features/auth/authSlice";
import Loader from '../components/Loader'
import WhiteLogo from "../../x-logo/WhiteLogo.png";

const Register = () => {
    const [isEmail, setIsEmail] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPassword2, setIsPassword2] = useState(false);
    const [isName, setIsName] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/home')
        }

        return () => {
            dispatch(reset())
        };

    }, [isError, isSuccess, message, dispatch, user, navigate])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSignUp = (e) => {
        e.preventDefault()

        if (!name || !email || !password || !password2) {
            toast.error('Please enter all fields')
            return
        }
        if (password !== password2) {
            toast.error("Passwords don't match")
            return
        }

        const userData = {
            name,
            email,
            password
        }

        dispatch(register(userData))
    }

    if (isLoading) {
        return (<Loader />)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
            {/* Animated background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-pink-500/30 blur-sm"></div>

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
                        <div className="flex flex-col items-center space-y-6 gap-5">
                            {/* Logo */}
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                    <img src={WhiteLogo} alt="X | Logo" className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Create an account
                                </h1>
                            </div>

                            {/* Form */}
                            <div className="flex flex-col relative left-7 w-full gap-4">
                                <div className="flex flex-col w-full max-w-sm mx-auto space-y-3 gap-2">
                                    {/* Name Input */}
                                    <div className="relative">
                                        <label
                                            className={`
                                                absolute left-4 transition-all duration-200 pointer-events-none
                                                ${isName || name
                                                    ? "text-xs top-2 text-purple-400 bg-black"
                                                    : "text-gray-400 top-4"
                                                }
                                            `}
                                            htmlFor='name'
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="w-full h-14 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-gray-500"
                                            onFocus={() => setIsName(true)}
                                            onBlur={() => setIsName(false)}
                                            value={name}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="relative">
                                        <label
                                            className={`
                                                absolute left-4 transition-all duration-200 pointer-events-none
                                                ${isEmail || email
                                                    ? "text-xs top-2 text-purple-400 bg-black"
                                                    : "text-gray-400 top-4"
                                                }
                                            `}
                                            htmlFor='email'
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full h-14 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-gray-500"
                                            onFocus={() => setIsEmail(true)}
                                            onBlur={() => setIsEmail(false)}
                                            value={email}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative">
                                        <label
                                            className={`
                                                absolute left-4 transition-all duration-200 pointer-events-none
                                                ${isPassword || password
                                                    ? "text-xs top-2 text-purple-400 bg-black"
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
                                            className="w-full h-14 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-gray-500"
                                            onFocus={() => setIsPassword(true)}
                                            onBlur={() => setIsPassword(false)}
                                            value={password}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="relative">
                                        <label
                                            className={`
                                                absolute left-4 transition-all duration-200 pointer-events-none
                                                ${isPassword2 || password2
                                                    ? "text-xs top-2 text-purple-400 bg-black"
                                                    : "text-gray-400 top-4"
                                                }
                                            `}
                                            htmlFor="password2"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password2"
                                            name="password2"
                                            className="w-full h-14 bg-transparent border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-gray-500"
                                            onFocus={() => setIsPassword2(true)}
                                            onBlur={() => setIsPassword2(false)}
                                            value={password2}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Sign up button */}
                                <div className="w-full max-w-sm mx-auto">
                                    <button
                                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                                        onClick={onSignUp}
                                    >
                                        <span className="relative z-10">Sign up</span>
                                    </button>
                                </div>

                                {/* Sign in link */}
                                <div className="relative -left-5 text-center">
                                    <p className="text-gray-400 text-sm">
                                        Already have an account?{' '}
                                        <Link to={'/login'}>
                                            <span className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium transition-colors">
                                                Sign in
                                            </span>
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Bottom spacing */}
                            <div className="h-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;