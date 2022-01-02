import axios from "axios";

const instance = axios.create({
    baseURL: 'https://react-my-burger-e62a5-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

export default instance;