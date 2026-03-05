/** @format */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAuthResponse,
  IAuthState,
  ILogin,
  IUser,
} from "../interface/authTypes";
import { login, logout as logoutService } from "../api/auth/log";
import refresh from "../api/auth/refresh";

interface ISetCredentialsPayload {
  user: IUser;
  accessToken: string;
}

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
};

export const loginThunk = createAsyncThunk<IAuthResponse, ILogin>(
  "auth/login",
  async ({ email, password }) => {
    return await login({ email, password });
  },
);

export const refreshThunk = createAsyncThunk("auth/refresh", async () => {
  return await refresh();
});

export const logoutThunk = createAsyncThunk("auth/refresh", async () => {
  return await logoutService();
});

const authSlide = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ISetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    setAccessToken: (state, action: PayloadAction<ISetCredentialsPayload>) => {
      state.accessToken = action.payload.accessToken;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // refresh token
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })

      // logout
      .addCase(loginThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, setAccessToken, logout, setLoading } =
  authSlide.actions;

const authReducer = authSlide.reducer;
export default authReducer;
