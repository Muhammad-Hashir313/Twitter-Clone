import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Startup from './pages/Startup'
import Loader from './components/Loader'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Startup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/loader' element={<Loader />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
