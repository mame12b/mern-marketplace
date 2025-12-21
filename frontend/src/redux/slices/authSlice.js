import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../../services/authService';

const initialState = {
  user: null,
  token: null,
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
                error.response.data.message || 'Login failed'
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
                error.response.data.message || 'Registration failed'
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
        },
        reset: (state) => {
            state.loading = false;
            state.error = null;
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
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
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
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
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
