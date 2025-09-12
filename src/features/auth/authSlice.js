// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, registerThunk, logoutThunk, meThunk } from "./authThunks";

const initialState = { user: null, token: null, status: "idle", error: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 👇 Shu action’ni qo‘shamiz va eksport qilamiz
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b
      .addCase(registerThunk.pending, (s)=>{ s.status="loading"; s.error=null; })
      .addCase(registerThunk.fulfilled, (s,a)=>{ s.status="succeeded"; s.user=a.payload.user; s.token=a.payload.token; })
      .addCase(registerThunk.rejected, (s,a)=>{ s.status="failed"; s.error=a.payload||a.error?.message; })

      .addCase(loginThunk.pending, (s)=>{ s.status="loading"; s.error=null; })
      .addCase(loginThunk.fulfilled, (s,a)=>{ s.status="succeeded"; s.user=a.payload.user; s.token=a.payload.token; })
      .addCase(loginThunk.rejected, (s,a)=>{ s.status="failed"; s.error=a.payload||a.error?.message; })

      .addCase(meThunk.fulfilled, (s,a)=>{ if(a.payload?.user) s.user=a.payload.user; })

      .addCase(logoutThunk.fulfilled, (s)=>{ s.user=null; s.token=null; s.status="idle"; s.error=null; });
  }
});

export const { logout } = authSlice.actions; // 🔥 endi export bor
export default authSlice.reducer;
