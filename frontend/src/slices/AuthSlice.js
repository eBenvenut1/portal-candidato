import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/AuthService";

//register gestor
export const register = createAsyncThunk("auth/gestor/register", async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
})

//register candidato
export const registerUser = createAsyncThunk("auth/user/register", async (user, thunkAPI) => {
  try {
    return await authService.registerUser(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
})


// login
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// logout
export const logout = createAsyncThunk("auth/logout", async () => {
  return await authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: false,
    success: false,
    message: "",
  },
  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload || "Erro no login";
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      
      
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
