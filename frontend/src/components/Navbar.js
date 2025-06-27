import "./Navbar.css"

//components
import { NavLink, Link } from "react-router-dom"
import { BsSearch, BsHouseDoorFill, BsFillPersonFill} from 'react-icons/bs'

//hooks

import { useAuth } from "../hooks/useAuth"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"


//Redux
import {logout, resetAuth} from '../slices/AuthSlice'
import { useState } from "react"



const Navbar = () => {

    const { auth } = useAuth()
    

    const [query, setQuery] = useState("")

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(resetAuth())

        navigate("/login")
    }

    const handleSearch = (e) => {
        e.preventDefault()

        if(query){
            return navigate(`/search?q=${query}`)
        }
    }

    return (
        <nav id="nav">
            <Link to="/dashboard">Portal<span>Candidatos</span></Link>
            <form id="search-form" onSubmit={handleSearch}>
                <BsSearch />
                <input type="text" placeholder="Pesquisar" onChange={(e) => setQuery(e.target.value)}/>
            </form>
            <ul id="nav-links">
                {auth ? (
                    <>
                        <li>
                            <NavLink to="/dashboard">
                                <BsHouseDoorFill />
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/profile">
                                <BsFillPersonFill/>
                            </NavLink>
                        </li>
                        <li>
                            <span onClick={handleLogout}>
                                Sair
                            </span>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/login">
                                Entrar
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/users/register">
                                Cadastrar
                            </NavLink>
                        </li>
                    </>
                )}


            </ul>
        </nav>
    )
}

export default Navbar