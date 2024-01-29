import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = '/api';

export const fetchWards = createAsyncThunk('wards/fetchWards', async () => {
  const response = await fetch(`${API_URL}/wards/`);
  if (!response.ok) { throw new Error('Failed to fetch wards'); }
  const data = await response.json();
  return data;
});

export const addWard = createAsyncThunk('wards/addWard', async (ward) => {
  const response = await fetch(`${API_URL}/wards/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ward),
  });
  if (!response.ok) {
    throw new Error('Failed to add ward');
  }
  const data = await response.json();
  return data;
});

export const updateWard = createAsyncThunk('wards/updateWard', async (ward) => {
  const response = await fetch(`${API_URL}/wards/${ward.id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ward),
  });
  if (!response.ok) {
    throw new Error('Failed to update ward');
  }
  const data = await response.json();
  return data;
});

export const deleteWard = createAsyncThunk('wards/deleteWard', async (wardId) => {
  const response = await fetch(`${API_URL}/wards/${wardId}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete ward');
  }
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
