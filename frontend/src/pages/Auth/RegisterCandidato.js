import "./Auth.css";

// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Select from "react-select"


import { habilidadesOptions } from "../../utils/habilidades";

// Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { registerUser, resetAuth } from "../../slices/AuthSlice";

const RegisterUser = () => {
    const [full_name, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [habilidadeSelecionadas, setHabilidadeSelecionadas] = useState([]);
    const [formacao, setFormacao] = useState("")
    const [telefone, setTelefone] = useState("")

    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.auth);


    //Style da caixa de seleção
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: "#CCC",
            color: "#000",
            border: "1px solid #555",
            borderRadius: "2px",
            padding: "2px",
            marginBottom: "0.6em",
            boxShadow: "none",
            fontfamily: "Roboto"
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 5,
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#aaa",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#000",  // placeholder preto
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "#000",
        }),
        input: (provided) => ({
            ...provided,
            color: "#000",
        }),
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        const habilidadesString = habilidadeSelecionadas
            .map((item) => item.value)
            .join(", ");

        const user = {
            full_name,
            email,
            password,
            confirmPassword,
            habilidade: habilidadesString,
            formacao,
            telefone,
            cep,
            endereco,
        };

        dispatch(registerUser(user));
    };

    // Limpa estado do auth ao montar
    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    // Busca endereço ao preencher o CEP
    useEffect(() => {
        const fetchEndereco = async () => {
            if (cep.length === 8) {
                try {
                    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await res.json();

                    if (data.erro) {
                        setEndereco("CEP não encontrado");
                    } else {
                        setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
                    }
                } catch (err) {
                    setEndereco("Erro ao buscar endereço");
                    console.error("Erro ViaCEP:", err);
                }
            }
        };

        fetchEndereco();
    }, [cep]);

    return (
        <div id="register">
            <h2>Registro Candidato</h2>
            <p className="subtitle">Cadastre-se para ver as vagas.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome"
                    onChange={(e) => setFullName(e.target.value)}
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
                <Select
                    options={habilidadesOptions}
                    isMulti
                    value={habilidadeSelecionadas}
                    onChange={setHabilidadeSelecionadas}
                    placeholder="Selecione suas habilidades"
                    styles={customStyles}
                />

                <input
                    type="text"
                    placeholder="Formação"
                    onChange={(e) => setFormacao(e.target.value)}
                    value={formacao}
                />

                <input
                    type="text"
                    placeholder="Telefone"
                    onChange={(e) => setTelefone(e.target.value)}
                    value={telefone}
                />

                <input
                    type="text"
                    placeholder="CEP"
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                    value={cep}
                />
                <input
                    type="text"
                    placeholder="Endereço"
                    onChange={(e) => setEndereco(e.target.value)}
                    value={endereco}
                />
                
                {!loading && <input type="submit" value="Cadastrar" />}
                {loading && <input type="submit" disabled value="Aguarde..." />}
                {error && <Message msg={error} type="error" />}
            </form>
            <p>
                Já tem conta? <Link to="/login">Clique aqui</Link>
            </p>
            <p>
                Criar conta gestor? <Link to="/gestor/register">Clique aqui</Link>
            </p>
        </div>
    );
};

export default RegisterUser;
