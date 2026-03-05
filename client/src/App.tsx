import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#3c3836',
            color: '#ebdbb2',
            border: '1px solid #504945',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#b8bb26',
              secondary: '#3c3836',
            },
          },
          error: {
            iconTheme: {
              primary: '#fb4934',
              secondary: '#3c3836',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App