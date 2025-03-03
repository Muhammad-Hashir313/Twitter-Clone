import WhiteLogo from '../../x-logo/WhiteLogo.png'
import { Link } from 'react-router-dom'

const Startup = () => {

    return (
        <>
            <div className="flex h-screen items-center justify-center">

                <section className="w-1/2 flex justify-center">
                    <img src={WhiteLogo} alt="Logo" className="w-70" />
                </section>

                <section className="text-white w-1/2 flex flex-col gap-18">
                    <div className="flex flex-col gap-20">
                        <h1 className="text-7xl font-bold">Happening now</h1>
                        <div className="flex flex-col gap-8">
                            <h4 className="text-3xl font-bold">Join today.</h4>
                            <div className="flex flex-col gap-2">
                                <Link to='/register'>
                                    <button className="mb-20 w-3/8 h-10 bg-blue-500 p-3 text-white rounded-full hover:bg-blue-600 cursor-pointer">
                                        Create an account
                                    </button>
                                </Link>
                                <p className="w-80 text-xs text-gray-500">By signing up, you agree to the <span className="text-blue-500">Terms of Service</span> and <span className="text-blue-500">Privacy Policy</span>, including <span className="text-blue-500">Cookie Use.</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-xl">Already have an account?</p>
                        <Link to='/login'>
                            <button className="w-3/8 h-10 bg-transparent p-3 text-blue-500 rounded-full border  cursor-pointer hover:bg-blue-500/10">
                                Sign in
                            </button>
                        </Link >
                    </div>
                </section >
            </div >
        </>
    )
}

export default Startup