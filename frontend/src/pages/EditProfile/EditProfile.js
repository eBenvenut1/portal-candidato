import './EditProfile.css';

// hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select"
import { habilidadesOptions } from "../../utils/habilidades";

// redux
import { Profile, resetUser, updateCandidato } from '../../slices/UserSlice';

// components
import Message from '../../components/Message';

const EditProfile = () => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cep, setCep] = useState('');
    const [habilidadeSelecionadas, setHabilidadeSelecionadas] = useState([]);
    const [formacao, setFormacao] = useState('');
    const [telefone, setTelefone] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const { profile, message, error, loading } = useSelector((state) => state.user);

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

    useEffect(() => {
        dispatch(Profile());
    }, [dispatch]);

    useEffect(() => {

        console.log('=== DEBUG PROFILE COMPLETO ===');
        console.log('profile:', profile);
        console.log('profile.formacao:', profile.formacao);
        console.log('profile.Formacao:', profile.Formacao);
        console.log('Todas as keys do profile:', Object.keys(profile));

        if (profile && Object.keys(profile).length > 0) {
            setFullName(profile.full_name || '');
            setEmail(profile.email || '');
            setEndereco(profile.endereco || '');
            setCep(profile.cep || '');

            // ✅ CORREÇÃO: Converter string para array de objetos
            if (profile.habilidade && typeof profile.habilidade === 'string') {
                const habilidadesArray = profile.habilidade
                    .split(', ')
                    .map(hab => {
                        // Encontrar a opção correspondente em habilidadesOptions
                        const opcao = habilidadesOptions.find(opt =>
                            opt.label.toLowerCase() === hab.toLowerCase()
                        );
                        return opcao || { value: hab.toLowerCase(), label: hab };
                    });
                setHabilidadeSelecionadas(habilidadesArray);
            } else if (Array.isArray(profile.habilidade)) {
                // Se já vier como array (caso futuro)
                setHabilidadeSelecionadas(profile.habilidade);
            } else {
                setHabilidadeSelecionadas([]);
            }

            setFormacao(profile.formacao || ''); 
            setTelefone(profile.telefone || '');
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('habilidadeSelecionadas:', habilidadeSelecionadas)
        console.log('É array?', Array.isArray(habilidadeSelecionadas))
        console.log('Tipo:', typeof habilidadeSelecionadas)

        // ✅ Verificação segura para evitar erro de .map()
        const habilidadesString = Array.isArray(habilidadeSelecionadas)
            ? habilidadeSelecionadas.map((item) => item.value).join(", ")
            : '';

        console.log('=== DEBUG VARIÁVEIS ===')
        console.log('fullName:', fullName)
        console.log('email:', email)
        console.log('endereco:', endereco)
        console.log('cep:', cep)
        console.log('habilidadesString:', habilidadesString)
        console.log('formacao:', formacao)
        console.log('telefone:', telefone)

        const userData = {
            fullName,
            email,
            endereco,
            cep,
            habilidade: habilidadesString,
            formacao,
            telefone
        };

        if (password) {
            userData.password = password;
        }

        console.log('userData final:', userData)

        try {
           const result = await dispatch(updateCandidato(userData)).unwrap();

            // Opcional: recarregar o perfil para mostrar dados atualizados
            if(result){}

            setTimeout(() => {
                dispatch(resetUser());
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

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
        <div id="edit-profile">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome completo"
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    disabled
                    value={email || ''}
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
                    onChange={(e) => setCep(e.target.value)}
                    value={cep}
                />
                <input
                    type="text"
                    placeholder="Endereço"
                    onChange={(e) => setEndereco(e.target.value)}
                    value={endereco}
                />
                <input
                    type="password"
                    placeholder="Nova senha (opcional)"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />

                {!loading && <input type="submit" value="Atualizar" />}
                {loading && <input type="submit" disabled value="Aguarde..." />}

                {error && <Message msg={error} type="error" />}
                {message && <Message msg={message} type="success" />}
            </form>
        </div>
    );
};

export default EditProfile;