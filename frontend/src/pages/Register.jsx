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

        if (isSuccess && user) {
            navigate('/home')
            setTimeout(() => dispatch(reset()), 1000); // Small delay to allow navigation
            return;
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
        <div className="flex justify-center items-center min-h-screen bg-[rgba(91,112,131,0.4)] text-white">
            <div className="w-140 h-140 bg-black rounded-lg shadow-lg">
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
                            <h2 className="text-2xl font-bold mb-6">Create an account</h2>
                            <div className="flex flex-col gap-2">
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isName || name
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        htmlFor='name'
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsName(true)}
                                        onBlur={() => setIsName(false)}
                                        value={name}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isEmail || email
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        htmlFor='email'
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
                                        value={email}
                                        onChange={onChange}
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
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isPassword2 || password2
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        htmlFor="password2"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password2"
                                        name="password2"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsPassword2(true)}
                                        onBlur={() => setIsPassword2(false)}
                                        value={password2}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-100 h-10 bg-white text-black font-bold py-2 rounded-full mb-3 cursor-pointer hover:bg-white/80" onClick={onSignUp}>
                                Sign up
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mt-4">
                            Already have an account? <Link to={'/login'}><span className="text-blue-500 cursor-pointer">Sign in</span></Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
