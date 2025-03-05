import { useState } from "react";
import { Link } from "react-router-dom";
import WhiteLogo from "../../x-logo/WhiteLogo.png";

const Register = () => {
    const [isEmail, setIsEmail] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isName, setIsName] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [nameValue, setNameValue] = useState("");

    const onSignUp = (e) => {
        e.preventDefault()
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
                            <h2 className="text-2xl font-bold mb-6">Create an account</h2>
                            <div className="flex flex-col gap-3">
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isName || nameValue
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        for='name'
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsName(true)}
                                        onBlur={() => setIsName(false)}
                                        onChange={(e) => setNameValue(e.target.value)}
                                        value={nameValue}
                                        required
                                    />
                                </div>
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isEmail || emailValue
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        for='email'
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsEmail(true)}
                                        onBlur={() => setIsEmail(false)}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                        value={emailValue}
                                        required
                                    />
                                </div>
                                <div className="relative w-100">
                                    <label
                                        className={`absolute left-4 transition-all ${isPassword || passwordValue
                                            ? "text-xs -top-2 text-blue-500 bg-black px-1"
                                            : "text-gray-400 top-3"
                                            }`}
                                        for="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-100 h-13 bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onFocus={() => setIsPassword(true)}
                                        onBlur={() => setIsPassword(false)}
                                        onChange={(e) => setPasswordValue(e.target.value)}
                                        value={passwordValue}
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
