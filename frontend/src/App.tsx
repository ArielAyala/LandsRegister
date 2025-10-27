import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import PropertiesList from './pages/PropertiesList'
import PropertyForm from './pages/PropertyForm'
import PropertyDetails from './pages/PropertyDetails'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><div style={{ padding: 12 }}><h1>Welcome to Land Register</h1><p><Link to="/properties">View properties</Link></p></div></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><PropertiesList /></ProtectedRoute>} />
        <Route path="/properties/new" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
        <Route path="/properties/:id/edit" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
