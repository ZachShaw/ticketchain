import Axios from 'axios';
import config from './config/config.development';

const api = Axios.create({
    baseURL: config.SKIDDLE_API_URL
});

export default api;
