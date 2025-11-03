import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.2.8:3000/api/auth', // tu IP de PC y ruta de auth
});

export default API;
