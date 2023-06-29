class TokenStorage {
    //ajouter un token dans le localstorage
    static saveToken(token) {
        localStorage.setItem('token', token);
    }
    //lire un token dans le localstorage
    static getToken() {
        return localStorage.getItem('token');
    }
    //supprimer un token dans le localstorage
    static removeToken() {
        localStorage.removeItem('token');
    }
}

export default TokenStorage;
