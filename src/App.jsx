import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* Add 'pb-5' (Padding Bottom) and 'mb-5' to the container.
                   This creates empty space at the bottom of the page so the 
                   fixed Footer doesn't cover your content.
                */}
                <div className="bg-light min-vh-100 font-sans pb-5 mb-5">
                    
                    {/* Navbar shows on every page (controlled by internal logic) */}
                    <Navbar />
                    
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
                        <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>

                    {/* Footer shows on every page (controlled by internal logic) */}
                    <Footer />
                    
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;