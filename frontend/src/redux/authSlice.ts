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
import { getMe } from "../api/user/getMe";
import axios from "axios";
import { IApiError } from "../interface/apiTypes";

interface ISetCredentialsPayload {
  user: IUser;
  accessToken: string;
}

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<
  IAuthResponse,
  ILogin,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    return await login(data);
  } catch (error) {
    if (axios.isAxiosError<IApiError>(error)) {
      return rejectWithValue(error.response?.data.message ?? "Login failed");
    }

    return rejectWithValue("Something went wrong");
  }
});

export const refreshThunk = createAsyncThunk("auth/refresh", async () => {
  return await refresh();
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  return await logoutService();
});

export const getMeThunk = createAsyncThunk("user/getMe", async () => {
  return await getMe();
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
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? null;
      })

      // refresh token
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })

      // get me
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // logout
      .addCase(logoutThunk.fulfilled, (state) => {
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
