import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import SignUpPage from './components/SignUpPage'
import LoginPage from './components/LoginPage'
import Sidebar from './pages/common/Sidebar'
import RightPanel from './pages/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { useAuthStore } from './store/authStore'
import { Toaster } from 'react-hot-toast'
import FindFriends from './pages/FindFriends'

function App() {
  const { user, getUser ,isLoading ,isAuthenticated } = useAuthStore();
   useEffect(() => {
     getUser();
   }, [getUser]);
  

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    )
  }
  


  return (
    <div className='flex max-w-6xl mx-auto '>
      {isAuthenticated && user && <Sidebar />}
      <Routes>
       <Route path='/' element={
       isAuthenticated && user ? <HomePage /> : <Navigate to='/login' />
       } />
				<Route path='/signup' element={
         isAuthenticated && user ? <Navigate to='/' /> : <SignUpPage />
        } />
				<Route path='/login' element={
          isAuthenticated && user ? <Navigate to='/' /> : <LoginPage />
        } />
				<Route path='/notifications' element={
          isAuthenticated && user ? <NotificationPage /> : <Navigate to='/login' />
        } />
				<Route path='/profile/:username' element={
          isAuthenticated && user ? <ProfilePage /> : <Navigate to='/login' />
        } />
				<Route path='/find-friends' element={
          isAuthenticated && user ? <FindFriends /> : <Navigate to='/login' />
        } />
      </Routes>
      {isAuthenticated && user && <RightPanel />}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App
