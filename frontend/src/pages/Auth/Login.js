import "./Auth.css"

//components
import { Link } from "react-router-dom"
import Message from "../../components/Message"



//hooks
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

//Redux
import { login, resetAuth } from '../../slices/AuthSlice'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const { loading, error, message } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()

    const user = {
      email,
      password
    }

    dispatch(login(user))
  }

  //clean all auth states
  useEffect(() => {
    dispatch(resetAuth())
  }, [dispatch])

  return (
    <div id="login">
      <h2>Portal Candidatos</h2>
      <p className="subtitle">Faça login para acessar o portal.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email || ''} />
        <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ''} />
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" disabled value="Aguarde..." />}
        {error && <Message msg={message} type="error" />}
      </form>
      <p>Não tem uma conta? <Link to="/users/register">Clique Aqui!</Link></p>
    </div>
  )
}

export default Login