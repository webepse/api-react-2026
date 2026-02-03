import Axios from "axios";
import {jwtDecode} from "jwt-decode";
import {LOGIN_API} from "../config";

function authenticate(credentials){
    return Axios
            .post(LOGIN_API, credentials)
            .then(response => response.data.token)
            .then(token => {
                // mettre le token dans le localStorage
                window.localStorage.setItem("authToken", token)
                // ajouter le token à mes headers de requête
                Axios.defaults.headers["Authorization"] = `Bearer ${token}`
                return true
            })
}

function logout() {
    window.localStorage.removeItem("authToken")
    //Axios.defaults.headers["Authorization"] = null
    delete Axios.defaults.headers["Authorization"]
}

function setup() {
    // vérifier s'il y a un token
    const token = window.localStorage.getItem("authToken")
    if(token)
    {
        const jwtData = jwtDecode(token)
        // millisecondes vs secondes
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            Axios.defaults.headers["Authorization"] = `Bearer ${token}`
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken")
    if(token)
    {
        const jwtData = jwtDecode(token)
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            return true
        }
        return false // token expiré
    }
    return false // pas de token
}

export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated: isAuthenticated
}