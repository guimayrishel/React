
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const fetchWards = createAsyncThunk('wards/fetchWards', async () => {
  const response = await axios.get(`/api/wards`);
  return response.data;
});

export const addWard = createAsyncThunk('wards/addWard', async (ward) => {
  const response = await axios.post(`/api/wards/`, ward);
  return response.data;
});

export const updateWard = createAsyncThunk('wards/updateWard', async (ward) => {
  const response = await axios.put(`/api/wards/${ward.id}/`, ward);
  return response.data;
});

export const deleteWard = createAsyncThunk('wards/deleteWard', async (wardId) => {
  await axios.delete(`/api/wards/${wardId}`);
  return wardId;
});

const wardsSlice = createSlice({ name: 'wards',
  initialState: { wards: [], status: 'idle', error: null, },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWards.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchWards.fulfilled, (state, action) => { state.status = 'succeeded'; state.wards = action.payload; })
      .addCase(fetchWards.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(addWard.fulfilled, (state, action) => { state.wards.push(action.payload); })
      .addCase(updateWard.fulfilled, (state, action) => { const index = state.wards.findIndex((ward) => ward.id === action.payload.id); state.wards[index] = action.payload; })
      .addCase(deleteWard.fulfilled, (state, action) => { state.wards = state.wards.filter((ward) => ward.id !== action.payload); });
  },
});

export default wardsSlice.reducer;
