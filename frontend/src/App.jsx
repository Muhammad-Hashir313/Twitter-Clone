import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { io } from 'socket.io-client'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Startup from './pages/Startup'
import Loader from './components/Loader'
import Profile from './pages/left sidebar/Profile'
import Notifications from './pages/left sidebar/Notifications'
import Explore from './pages/left sidebar/Explore'
import TweetForm from './components/TweetForm'
import UserProfile from './pages/left sidebar/UserProfile'
import { useSelector } from 'react-redux'
import Message from './pages/left sidebar/Message'
import socket from './components/Socket'
import MessageList from './components/MessageList'

function App() {
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    if (!user || !user.id) return;

    socket.connect();

    socket.emit('registerUser', user.id);
    console.log('Sent registerUser with ID:', user.id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  //location.apthname

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Startup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/loader' element={<Loader />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/post' element={<TweetForm />} />
          <Route path='/profile/:name' element={<UserProfile />} />
          <Route path='/message' element={<Message />} />
          <Route path='/messages/:receiverId' element={<Message />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
