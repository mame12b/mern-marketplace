import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  api from "../../utils/axios";




export const getProducts =  createAsyncThunk(
  "products/getProducts", 
  async (_, {rejectWithValue}) => {
  
    try {
      const { data } = await api.get("/api/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(getProducts.fulfilled, (state, action) => {
  state.loading = false;

  // ✅ normalize API response
  state.items = Array.isArray(action.payload)
    ? action.payload
    : action.payload.products || action.payload.data || [];
})

      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
 ;

  },
});

export default productsSlice.reducer;