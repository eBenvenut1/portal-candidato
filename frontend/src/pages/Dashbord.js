import './Dashboard.css'

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCandidatos } from "../slices/UserSlice";
import { handleNotify } from '../slices/UserSlice';


const Dashboard = () => {
    const dispatch = useDispatch();

    const { candidatos, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getCandidatos());
    }, [dispatch]);


    const handleNotifyDash = (email) => {
        console.log("1. Email no Dashboard:", email);
        console.log("2. Tipo do email:", typeof email);
        dispatch(handleNotify({ email }));
    };





    return (
        <div className="dashboard">
            <h2>Lista de Candidatos</h2>

            {loading && <p>Carregando candidatos...</p>}
            {error && <p style={{ color: "red" }}>Erro ao carregar candidatos.</p>}

            {!loading && candidatos?.data && (
                <ul>
                    
                    {candidatos.data.map((candidato) => (

                        <li key={candidato.id} className='candidato-card'>
                            <strong>{candidato.fullName}</strong> - {candidato.email}
                            <br />
                            Código: {candidato.id}
                            <br />
                            Habilidades: {candidato.habilidade}
                            <br />
                            Formação: {candidato.formacao}
                            <br />
                            Telefone: {candidato.telefone}
                            <br />
                            Endereço: {candidato.endereco} | CEP: {candidato.cep}
                            <hr />
                            <button onClick={() => handleNotifyDash(candidato.email)}>
                                Notificar por e-mail
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
