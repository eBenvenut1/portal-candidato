export const api = "http://localhost:3333/api";


export const requestConfig = (method, data = null, token = null, multipart = false) => {
  

  let config = {
    method,
    headers: {},
  };

  // Autenticação
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // PROBLEMA PODE ESTAR AQUI! 
  // Verifique a lógica desta condição
  if (method === "DELETE" || data === null) {
    
    // nada além do método e headers
  }
  else {
    
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(data);
    
  }

  
  return config;
};