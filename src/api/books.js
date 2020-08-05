import makeRequest from './helpers/makeRequest';
import "regenerator-runtime/runtime";

async function all(params){
    let data = await makeRequest(`/books${params}`);
    return data;
}
// async function booksByAuthor(params){
//     let data = await makeRequest(`/book${params}`);
//     return data;
// }
async function one(id, strParams){
    let data = await makeRequest(`/books/${id}${strParams}`);
    return data;
}

async function add(book){
    let data = await makeRequest('/books/', {
        method: 'POST',
        body: JSON.stringify({...book}),
        headers:{
            'Content-Type': 'application/json'
            }
    });

    return data;
}

async function edit(id, book){
    let data = await makeRequest(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(book),
        headers:{
            'Content-Type': 'application/json'
            }
    });
    return data;
} 

async function remove(id){
    let data = await makeRequest(`/books/${id}`, {
        method: 'DELETE'
    });

    return data;
}


export { all, one, add, edit, remove };
