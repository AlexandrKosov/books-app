import Home from '~p/Home';
import Genres from '~p/Genres';
import AddBook from '~p/AddBook';

import Page404 from '~p/error404';

let routes = [
	{
        name: 'genres',
        url: '/genres',
        component: Genres,
        exact: true
    },
	{
        name: 'addBook',
        url: '/add-book',
        component: AddBook,
        exact: true
    },
    {
        name: 'home',
        url: '/',
        component: Home,
        exact: true
    },
    {
        url: '**',
        component: Page404
    }
];

let routesMap = {};

routes.forEach((route) => {
    if(route.hasOwnProperty('name')){
        routesMap[route.name] = route.url;
    }
});

let urlBuilder = function(name, params){
    if(!routesMap.hasOwnProperty(name)){
        return null;
    }

    let url = routesMap[name];

    for(let key in params){
        url = url.replace(':' + key, params[key]);
    }

    return url;
}

export default routes;
export {routesMap, urlBuilder};