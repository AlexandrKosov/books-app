import makeRequest from './helpers/makeRequest';
import "regenerator-runtime/runtime";

//GET /posts?_sort=views&_order=asc
async function all(params){
    //let data = await makeRequest('http://localhost:3000/author?_sort=secondName&_order=asc');
    let data = await makeRequest(`/authors${params}`);
    return data;
}

async function one(id){
    let data = await makeRequest(`/authors/${id}`);
    return data;
}

async function add(author){
    let data = await makeRequest('/authors/', {
        method: 'POST',
        body: JSON.stringify({...author}),
        headers:{
            'Content-Type': 'application/json'
            }
    });

    return data;
}

async function edit(id, author){
    let data = await makeRequest(`/authors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(author),
        headers:{
            'Content-Type': 'application/json'
            }
    });
    return data;
} 

async function remove(id){
    let data = await makeRequest(`/authors/${id}`, {
        method: 'DELETE'
    });

    return data;
}


export { all, one, add, edit, remove };
