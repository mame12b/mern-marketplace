import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = () => createAsyncThunk(
  "products/getProducts", 
  async (_, {rejectWithValue}) => {
  
    try {
      const { data } = await axios.get("/api/products");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
//     // setProducts: (state, action) => {
//     //     state.list = action.payload;
//     // },
// },
extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;