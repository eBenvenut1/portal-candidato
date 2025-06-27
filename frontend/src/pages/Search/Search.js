import "./Search.css";

// hooks
import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleNotify } from "../../slices/UserSlice";

// Redux
import { searchCandidatos } from "../../slices/UserSlice";

const SearchCandidatos = () => {
    const query = useQuery();
    const search = query.get("q");

    const dispatch = useDispatch();

    const { candidatos, loading } = useSelector((state) => state.user);


    const handleNotifyDash = (email) => {
        console.log("1. Email no Dashboard:", email);
        console.log("2. Tipo do email:", typeof email);
        dispatch(handleNotify({ email }));
    };



    useEffect(() => {
        if (search) {
            dispatch(searchCandidatos(search));
        }
    }, [dispatch, search]);

    return (
        <div className="search-candidatos">
            <h2>Buscando por: "{search}"</h2>
            {loading && <p>Carregando candidatos...</p>}

            {Array.isArray(candidatos?.data) && candidatos.data.length > 0 ? (
                candidatos.data.map((candidato) => (
                    <div key={candidato.id} className="candidato-card">
                        <strong>{candidato.fullName}</strong> - {candidato.email}
                        <br />
                        Habilidade: {candidato.habilidade}
                        <br />
                        Formação: {candidato.formacao}
                        <br/>
                        Telefone: {candidato.telefone}
                        <br/>
                        Endereço: {candidato.endereco} | CEP: {candidato.cep}
                        <br />
                        <button className="btn" onClick={() => handleNotifyDash(candidato.email)}>
                            Notificar por e-mail
                        </button>
                    </div>
                ))
            ) : (
                !loading && <p>Nenhum candidato encontrado...</p>
            )}

        </div>
    );
};

export default SearchCandidatos;
