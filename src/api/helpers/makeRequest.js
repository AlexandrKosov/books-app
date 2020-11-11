//let mainServerUrl = 'http://localhost:3000';
let mainServerUrl = 'https://react-biblioteka.herokuapp.com';

async function makeRequest(url, options = {}, baseUrl = mainServerUrl){
    try{
        let response = await fetch(baseUrl + url, options);
        if(response.ok){
            return response.json();
        }else {
           // console.error("Ошибка http: ", response.status);
            return response.text().then(function(text){
                throw new Error(text);
            });
        }
    }catch
    (err){
        console.error(err)
    }


}
export default makeRequest;
