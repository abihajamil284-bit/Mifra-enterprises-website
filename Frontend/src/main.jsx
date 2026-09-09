import { StrictMode } from 'react'
import './App.css'
import ReactDOM from 'react-dom/client'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/login.jsx'
import Admin from './pages/admin.jsx'
import Message from './pages/messages.jsx'
import Products from './pages/products.jsx'
import Services from './pages/services.jsx'
import Requests from './pages/requests.jsx'
import Settings from './pages/settings.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login/>}/>        
         <Route path="/admin" element={<Admin/>}/>
         <Route path="/admin/products" element={<Products/>}/>
         <Route path="/admin/services" element={<Services/>}/>
         <Route path="/admin/requests" element={<Requests/>}/>
         <Route path="/admin/messages" element={<Message/>}/>
         <Route path="/admin/settings" element={<Settings/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
