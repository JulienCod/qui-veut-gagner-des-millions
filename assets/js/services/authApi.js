import FetchApi from "./fetchApi";

class AuthApi {
  static getUserRole() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const role = user.user_role[0];
      return role;
    }
    return null;
  }

  static async isAuthenticated() {
    try {
      const data = await FetchApi("/api/users/me", "GET");

      if (data.response.ok) {
        localStorage.setItem("user", JSON.stringify(data.data));

        return true;
      } else {
        // Si la requête n'est pas réussie, gérer l'erreur ici
        return false;
      }
    } catch (error) {
      // Si une exception est levée, gérer l'erreur ici
      console.error("Erreur lors de la requête :", error.message);
      return false;
    }
  }

  static async logout() {
    try {
      const response = await FetchApi("/api/logout", "POST");

      if (!response.response.ok) {
        console.log('problem logging out')
      }
    } catch (error) {
      // Si une exception est levée, gérer l'erreur ici
      console.error("Erreur lors de la requête :", error.message);
      return false;
    }
  }
}

export default AuthApi;