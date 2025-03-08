import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getTweets, resetTweets } from '../features/tweets/tweetSlice'
import Loader from '../components/Loader'
import LeftSidebar from './left sidebar/LeftSidebar'
// import RightSidebar from './right sidebar/RightSidebar'

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { tweets, isError, isLoading, message } = useSelector((state) => state.tweets)

    useEffect(() => {
        if (isError) {
            console.log(message)
        }

        if (!user) {
            navigate('/login')
        }

        dispatch(getTweets())

        return () => {
            dispatch(resetTweets())
        }

    }, [user, navigate, isError, message, dispatch])

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <>
            <LeftSidebar />
            {/* <RightSidebar /> */}
        </>
    )
}

export default Home