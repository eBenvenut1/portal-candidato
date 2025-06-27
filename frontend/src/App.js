import './App.css';
//Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

//hooks
import { useAuth } from './hooks/useAuth'


//pages

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RegisterUser from './pages/Auth/RegisterCandidato';
import Dashboard from './pages/Dashbord';
import Search from './pages/Search/Search'
import EditProfile from './pages/EditProfile/EditProfile';




function App() {


  const { auth, loading, isGestor } = useAuth()
  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path='/gestor/register' element={!auth ? <Register /> : <Navigate to="/dashboard" />}></Route>
            <Route path='/users/register' element={!auth ? <RegisterUser /> : <Navigate to="/profile" />}></Route>
            <Route
              path='/login'
              element={
                !auth ? <Login /> :
                  !isGestor ? <Navigate to="/profile" /> :
                    <Navigate to="/dashboard" />
              }
            />
            <Route path='/profile' element={!auth ? <Navigate to="/login"/> : !isGestor ? <EditProfile/> : <Navigate to="/dashboard" /> }></Route>
            <Route path='/dashboard' element={!isGestor ? <Navigate to="/profile" /> : <Dashboard />}></Route>
              <Route path='/search' element={!auth ? <Navigate to="/login" /> : <Search />}></Route>
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
