import { api, requestConfig } from "../utils/config";

const profile = async (data, token) => {
  const config = requestConfig("GET", data, token); 

    try {
        const res = await fetch(api + "users/profile", config)
        .then((res) => res.json())
        .catch((err) => err)

        return res;
    } catch (error) {
        console.log(error)
        throw error; 
    }
};

//Search Candidatos
const searchCandidatos = async(query, token) =>{
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/user/search?q=" + query, config)
        .then((res) => res.json())
        .catch((err) => err)

        return res;
        
    } catch (error) {
        console.log(error)
    }
}



//Send  a notify by email
const handleNotify = async (email, token) => {
    
    
    const config = requestConfig("POST", { email }, token);
    

    try {
        const res = await fetch(api + "/send-meeting-email", config);
        
        
        
        const responseText = await res.text();
        
        
        // Tenta fazer parse do JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            
            data = { error: "Response não é JSON válido", raw: responseText };
        }
        
        
        return data;
    } catch (error) {
        
        throw error;
    }
};


const updateCandidato = async (userData, token) => {
    // Envolver os dados em authUser para combinar com o que o backend espera
    const payload = { authUser: userData };
    const config = requestConfig("PUT", payload, token); 

    try {
        const res = await fetch(api + "/user/", config) // ✅ Rota está correta
        .then((res) => res.json())
        .catch((err) => err)

        return res;
    } catch (error) {
        console.log(error)
        throw error; 
    }
}


//Get all candidatos
const getCandidatos = async (token) => {
    const config = requestConfig("GET", null, token);

    try {
        const res = await fetch(api + "/dashboard/candidatos", config)
            .then((res) => res.json())
            .catch((err) => err);

        return res;
    } catch (error) {
        console.log(error);
    }
};



const userService = {
  profile,
  getCandidatos,
  handleNotify,
  searchCandidatos,
  updateCandidato,
};

export default userService;
