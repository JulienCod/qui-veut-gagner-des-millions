import jwt_decode from 'jwt-decode'
import localstorage from "./localstorage";
class AuthApi
{
    static getToken() {
        return localStorage.getItem('token');
    }

    static getUserRole() {
        const token = this.getToken();
        if (token) {
            // Décoder le token JWT pour obtenir les informations de l'utilisateur
            const decodedToken = jwt_decode(token);
            // Vérifier si le token contient les informations du rôle de l'utilisateur
            if (decodedToken && decodedToken.role) {
                return decodedToken.role;
            }
        }
        return null;
    }

    static isAuthenticated() {
    // 1. Voir si on a un token ?
    const token = localstorage.getToken("token");
    // 2. Si le token est encore valide
    if (token) {
        const { exp: expiration } = jwt_decode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

    static logout() {
        localstorage.removeToken("token");
    }
}

export default AuthApi