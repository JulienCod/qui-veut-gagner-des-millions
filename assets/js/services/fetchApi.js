const FetchApi = async (url, method,  datas = null) => {
  try {
    const options = {
        method: method,
        credentials: 'include',
        headers: {
          accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    
    if (datas) {
        options.body = JSON.stringify(datas); 
    }
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return { response, data };
    }
    if (response.status === 401){
      localStorage.removeItem('user');
      localStorage.removeItem('currentAccount');
      return {response};
    }else{
      return { response, data };

    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default FetchApi;
