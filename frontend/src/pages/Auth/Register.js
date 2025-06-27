import "./Auth.css";

// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

// Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { register, resetAuth } from "../../slices/AuthSlice";

const Register = () => {
  const [full_name, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      full_name,
      email,
      password,
      confirmPassword,
    };

    console.log(user);

    dispatch(register(user));
  };

  // Clean all auth states
  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  return (
    <div id="register">
      <h2>Registro Gestor</h2>
      <p className="subtitle">Cadastre-se para ver os candidatos.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setfullName(e.target.value)}
          value={full_name}
        />
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        {console.log(error)}
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" disabled value="Aguarde..." />}
        {error && <Message msg={error} type="error" />}
       
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui</Link>
      </p>
    </div>
  );
};

export default Register;