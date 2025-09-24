import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

const api = async (path, { method = "GET", body, token } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : {};
  if (!res.ok) {
    const e = new Error(data?.message || `HTTP ${res.status}`);
    e.data = data;
    e.status = res.status;
    throw e;
  }
  return data;
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await api("http://localhost:5000/api/auth/login", { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e?.data?.message || e.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await api("http://localhost:5000/api/auth/register", { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e?.data?.message || e.message);
    }
  }
);

export const meThunk = createAsyncThunk(
  "auth/me",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      return await api("http://localhost:5000/api/auth/me", { token });
    } catch (e) {
      return rejectWithValue(e?.data?.message || e.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      await api("http://localhost:5000/api/auth/logout", { method: "POST", token });
      return {};
    } catch (e) {
      return rejectWithValue(e?.data?.message || e.message);
    }
  }
);
