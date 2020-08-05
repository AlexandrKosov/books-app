import { configure } from 'mobx';

import notificationsStore from './notifications';
import genresStore from './genres';

import authorsStore from './authors';
import booksStore from './books';


import * as authors from '~/api/authors';
import * as books from '~/api/books';

configure({ enforceActions: "observed" })

class RootStore{
    constructor(){
        this.api = {
			authors,
			books,
        };

        this.storage = localStorage;

        this.notifications = new notificationsStore(this);
		this.authors = new authorsStore(this);
		this.books = new booksStore(this);
		this.genres = new genresStore(this);
    }    
}

export default new RootStore();