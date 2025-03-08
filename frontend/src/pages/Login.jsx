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
        <div className="flex justify-center items-center min-h-screen bg-[rgba(91,112,131,0.4)] text-white">
            <div className="w-150 h-130 bg-black rounded-lg shadow-lg">
                <div>
                    <Link to='/'>
                        <button className="relative text-xl font-bold left-2 cursor-pointer">
                            x
                        </button>
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-10">
                    <div className="mb-6 flex flex-col items-center">
                        <img src={WhiteLogo} alt="X | Logo" className="w-8" />
                    </div>

                    <div className="flex flex-col gap-15">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold mb-6">Sign in to X</h2>
                            <div className="flex flex-col gap-3">
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isEmail || email
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsEmail(true)}
                                        onBlur={() => setIsEmail(false)}
                                        onChange={onChange}
                                        value={email}
                                        required
                                    />
                                </div>
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isPassword || password
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsPassword(true)}
                                        onBlur={() => setIsPassword(false)}
                                        value={password}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-100 h-10 bg-white text-black font-bold py-2 rounded-full mb-3 cursor-pointer hover:bg-white/80" onClick={onSignIn}>
                                Sign in
                            </button>
                            <button className="w-100 h-10 border border-gray-600 py-2 rounded-full cursor-pointer hover:bg-gray-500/10">
                                Forgot password?
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mt-4">
                            Don't have an account? <Link to={'/register'}><span className="text-blue-500 cursor-pointer">Sign up</span></Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
