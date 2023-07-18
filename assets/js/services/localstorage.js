class TokenStorage {
    //ajouter un token dans le localstorage
    static saveToken(token, refresh_token) {
        localStorage.setItem('token', token);
        if (refresh_token){
            localStorage.setItem('refresh_token', refresh_token);
        }
    }
    //lire un token dans le localstorage
    static getToken() {
        return localStorage.getItem('token');
    }
    static getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }
    //supprimer un token dans le localstorage
    static removeToken() {
        localStorage.removeItem('token');
    }
}

export default TokenStorage;
