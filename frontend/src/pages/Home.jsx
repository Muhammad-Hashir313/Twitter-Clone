import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout, reset } from '../features/auth/authSlice'

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <>
            <div className="text-white">Home</div>
            <button className="text-white cursor-pointer" onClick={onLogout}>Logout</button>
        </>
    )
}

export default Home