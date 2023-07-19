import jwt_decode from "jwt-decode";
import localstorage from "./localstorage";
import Swal from "sweetalert2";
import FetchApi from "./fetchApi";
class AuthApi {
  static getToken() {
    //récupération du token en localstorage
    const token = localstorage.getToken("token");
    if (token) {
      const { exp: expiration } = jwt_decode(token);
      if (expiration * 1000 > new Date().getTime()) {
        return token;
      }
      this.refreshToken();
    }
  }

  static async refreshToken() {
    try {
      const token = localstorage.getToken("token");
      if (token) {
        const { exp: expiration } = jwt_decode(token);
        if (expiration * 1000 > new Date().getTime()) {
          return JSON.parse(token);
        }
        console.log("Refreshing token");
        const refresh_token = localstorage.getRefreshToken("refresh_token");
        const response = await FetchApi("/api/token/refresh","POST",false,{ "refresh_token": refresh_token });
        if (response.response.ok) {
          localstorage.saveToken(response.data.token);
          return await response.data.token;
        } else {
          Swal.fire({
            icon: "info",
            title:
              "Vous avez été déconnecté, veuillez vous reconnecter à votre compte",
            heightAuto: false,
            timer: 3000,
          });
          return false;
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  static getUserRole() {
    const token = this.getToken();
    if (token) {
      // Décoder le token JWT pour obtenir les informations de l'utilisateur
      const decodedToken = jwt_decode(token);
      // Vérifier si le token contient les informations du rôle de l'utilisateur
      if (decodedToken && decodedToken.roles) {
        return decodedToken.roles[0];
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
    }
    return false;
  }

  static async logout() {
    localstorage.removeToken("token");
  }
}

export default AuthApi;
