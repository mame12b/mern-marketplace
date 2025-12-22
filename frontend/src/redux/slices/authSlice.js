import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../../services/authService';

const hasWindow = 
typeof window !== 'undefined' &&
typeof window.localStorage !== 'undefined';

const getStored = (key) => (hasWindow ? window.localStorage.getItem(key) : null);


const clearStoredSession = () => {
  if (!hasWindow) return;
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('token');
};

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);

  } catch  {
    // Corrupted storage value; clear it so it doesn't break hydration.
    clearStoredSession();
    return null;
  }
};

const storedUser = safeParse(getStored('user'));
const storedToken = getStored('token');

const initialState = {
  user: storedUser?.data || storedUser || null,
  token: storedToken || null,
  loading: false,
  error: null,
  message: "",
};

// Async Thunks
export const  login = createAsyncThunk(
  'auth/login',
    async (userData, thunkAPI) => {
        try {
            return await loginUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || error?.message || 'Login failed'
            );
        }
    }
);

export const register = createAsyncThunk(
  'auth/register',
    async (userData, thunkAPI) => {
        try {
            return await registerUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || error?.message || 'Registration failed'
            );
        }
    }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            state.message = "";
            clearStoredSession();
        },
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.message = "";
        },
  
    },
    extraReducers: (builder) => {
        builder

        // Login Cases
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || action.payload.data || null;
                state.token = action.payload.token || null;
                state.error = null;
                state.message = action.payload.message || "";
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload;
            })

        // Register Cases
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || action.payload.data || null;
                state.token = action.payload.token || null;
                state.error = null;
                state.message = action.payload.message || "";
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload;
            });
    },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;
