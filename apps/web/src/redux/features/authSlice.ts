import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import { apiUrl } from '../apiUrl';

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// ============================
// LOGIN THUNK
// ============================
interface LoginPayload {
  username: string;
  pin: string;
}

export const loginUser = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: payload.username, pin: payload.pin }),
        credentials: 'include', // ✅ cookies HttpOnly
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login fallido');
      }

      // 🔹 Ajustamos según tu backend: si devuelve solo { message } y JWT en cookie
      return { id: payload.username, username: payload.username }; // simulamos user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);

// ============================
// RESET USER PIN THUNK (ADMIN)
// ============================
interface ResetPinPayload {
  username: string;
  newPin: string;
}

export const resetUserPin = createAsyncThunk<
  { tempPin: string },
  ResetPinPayload,
  { rejectValue: string }
>(
  'auth/resetUserPin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/users/reset-pin/${payload.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: payload.newPin }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Error al resetear el PIN');
      }

      return data; // { tempPin: string }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);

// ============================
// UPDATE MY PIN THUNK (USER)
// ============================
export const updateMyPin = createAsyncThunk<
  { message: string },
  { pin: string },
  { rejectValue: string }
>(
  'auth/updateMyPin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}users/me/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: payload.pin }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Error al actualizar el PIN');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);

// ============================
// SLICE
// ============================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login fallido';
      });

    // RESET USER PIN (ADMIN)
    builder
      .addCase(resetUserPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetUserPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al resetear el PIN';
      });

    // UPDATE MY PIN (USER)
    builder
      .addCase(updateMyPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyPin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateMyPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al actualizar el PIN';
      });
  },
});

export const { logout } = authSlice.actions;

// ============================
// SELECTORES
// ============================
export const selectUser = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
