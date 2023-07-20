const FetchApi = async (url, method,  datas = null) => {
  try {
    const options = {
        method: method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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
