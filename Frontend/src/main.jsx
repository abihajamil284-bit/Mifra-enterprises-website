import { StrictMode, useEffect, useState } from 'react'
import './App.css'
import './admin-pages.css'
import './dashboard.css'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Login from './pages/login.jsx'
import Admin from './pages/admin.jsx'
import Message from './pages/messages.jsx'
import Products from './pages/products.jsx'
import Services from './pages/services.jsx'
import Requests from './pages/requests.jsx'
import Settings from './pages/settings.jsx'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return unsubscribe
  }, [])

  if (user === undefined) {
    return <div>Checking authentication...</div>
  }

  return user ? children : <Navigate to="/admin/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Navigate to="/admin/login" replace />}/>
         <Route path="/admin/login" element={<Login/>}/>
         <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
         <Route path="/admin/products" element={<ProtectedRoute><Products/></ProtectedRoute>}/>
         <Route path="/admin/services" element={<ProtectedRoute><Services/></ProtectedRoute>}/>
         <Route path="/admin/requests" element={<ProtectedRoute><Requests/></ProtectedRoute>}/>
         <Route path="/admin/messages" element={<ProtectedRoute><Message/></ProtectedRoute>}/>
         <Route path="/admin/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
         <Route path="/admin/*" element={<ProtectedRoute><Navigate to="/admin" replace /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
