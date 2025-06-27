import { api, requestConfig } from "../utils/config";

// Trata resposta de erro genérica e de validação
const handleErrors = async (res) => {
  const data = await res.json();

  // Mensagem padrão do backend
  throw new Error(data.message || "Erro inesperado");
};

const register = async (userData) => {
  const config = requestConfig("POST", userData);

  const res = await fetch(api + "/gestor/register", config);
  if (!res.ok) return handleErrors(res);

  const data = await res.json();
  return data.data;
};

const registerUser = async (userData) => {
  const config = requestConfig("POST", userData);

  const res = await fetch(api + "/user/register", config);
  if (!res.ok) return handleErrors(res);

  const data = await res.json();
  return data.data;
};

const login = async (userData) => {
  const config = requestConfig("POST", userData);

  const res = await fetch(api + "/login", config);
  if (!res.ok) return handleErrors(res);

  const data = await res.json();
  return data.data;
};

const logout = async () => {
  localStorage.removeItem("user");
};

const authService = {
  login,
  logout,
  register,
  registerUser
};

export default authService;
