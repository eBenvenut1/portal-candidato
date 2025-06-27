import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/UserService";


//get all candidatos
export const getCandidatos = createAsyncThunk("dashboard", async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token
  const data = await userService.getCandidatos(token)
  return data
})

//send a notify by email
export const handleNotify = createAsyncThunk("dashboard/notify", async ({ email }, thunkAPI) => {


  const token = thunkAPI.getState().auth.user.token;


  return await userService.handleNotify(email, token);
});

//search candidatos
export const searchCandidatos = createAsyncThunk("users/search", async (query, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token
  const data = await userService.searchCandidatos(query, token)

  return data
})

//update candidato - copiando estrutura do searchCandidatos
export const updateCandidato = createAsyncThunk("user/updateCandidato", async (userData, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token

  const data = await userService.updateCandidato(userData, token)

  return data;
})



// perfil
export const Profile = createAsyncThunk("users/profile", async (userData, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token
  

  const data = await userService.updateCandidato(userData, token)

  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: {},
    loading: false,
    error: false,
    success: false,
    message: "",
  },
  reducers: {
    resetUser: (state) => {
      state.profile = {};
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Profile.pending, (state) => {
        state.loading = true;
      })
      .addCase(Profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload.data;
      })
      .addCase(Profile.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload?.message || "Erro ao buscar perfil";
      })
      .addCase(getCandidatos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.candidatos = action.payload;
      })
      .addCase(getCandidatos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(searchCandidatos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.candidatos = action.payload;
      })
      .addCase(searchCandidatos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateCandidato.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidato.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(updateCandidato.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });


  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
