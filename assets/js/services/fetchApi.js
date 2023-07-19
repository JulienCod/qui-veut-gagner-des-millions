import AuthApi from "./authApi";

const FetchApi = async (url, method, useToken = Boolean,  datas = null) => {
  try {
    let token = '';
    if (useToken){
      token = await AuthApi.refreshToken();
    }
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    
    if (datas) {
        options.body = JSON.stringify(datas); 
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default FetchApi;
