import { createContext, useContext, useEffect, useReducer } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...initialState, token: null, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (!state.token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: state.token } });
      } catch {
        dispatch({ type: 'LOGOUT' });
      }
    };
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    return data;
  } 

  const signup = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    return data;
  } 

  const logout = () => dispatch({ type: 'LOGOUT' });

  const updateUser = (user) => dispatch({ type: 'UPDATE_USER', payload: user });

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
