import {observable, computed, action, runInAction, configure} from 'mobx';
configure({ enforceActions: "observed" });

export default class{
    @observable books = [];
    @observable state = 'empty'; // pending, done, error //fetchByAuthor|fetchAll
    @observable book = {};// отдельная книга, вызываемая fetchOne
    @observable genres = [];
    @observable stateOne = 'empty'; //empty, pending, done, error (пусто, загрузка, загружено, ошибка) - статусы работы fetchOne 
    @observable genreState = 'empty'; //empty, pending, done, error (пусто, загрузка, загружено, ошибка)
    //вместо State
    @observable checkedList = [];
    @observable indeterminate = false;//true,
    @observable checkAll = false;

    @action setCheckedList = (value) => {
        this.checkedList = value;
    }
    @action setIndeterminate = (value) => {
        this.indeterminate = value
    }
    @action setCheckAll = (value) => {
        this.checkAll = value;
    }

    constructor(rootStore){
        this.rootStore = rootStore;
        this.api = this.rootStore.api.books;
    }

    @action clearBookList (){
        runInAction(()=>{
            this.items = [];
            this.state="empty";
        })
    }

    @action clearBookInfo(){
        runInAction(()=>{
            this.book = {};
            this.stateOne="empty";
        })
    }

    @action fetchAll(params){
        let str = '?';//'_sort=secondName&_order=asc'
        if (typeof params === "string" || params instanceof String){
            str = params;
        }else if (typeof params === "object") {
            for(var key in params){
                str += ''+key+'='+params[key]+'&';
            }
        }
        this.state = 'pending';
        return new Promise((resolve, reject) => {
            this.api.all(str).then((data) => {
                runInAction(()=>{
                    this.books = data;  
                    this.state = 'done';
                });
                resolve(true);
            },
            error=> {
                runInAction(()=>{
                    this.state = 'error';
                });
            });
        });
    }

	@action fetchByAuthor(id, sort='year', order='asc') {
        let str = `?authorId=${id}&_sort=${sort}&_order=${order}`;
        this.state = 'pending';
        return new Promise((resolve, reject) => {
            this.api.all(str).then((data) => {
                runInAction(()=>{
                    this.books = data;
                    this.state = 'done';
                });
                resolve(true);
            },
            error=> {
                runInAction(()=>{
                    this.state = 'error';
                });
            });
        });		
	}
	
    @action fetchOne(id, params){
        this.stateOne = 'pending';
        return new Promise((resolve, reject) => {
            this.api.one(id, params).then((data) => {
                runInAction(()=>{
                    this.book = data;
                    this.stateOne = 'done';
                });
                resolve(data);
            },
            error=> {
                runInAction(()=>{
                    this.stateOne = 'error';
                });
            }
        );
        });
    }

    @action fetchAllforGenres(params){
        let str = '?';//'_sort=secondName&_order=asc'
        if (typeof params === "string" || params instanceof String){
            str = params;
        }else if (typeof params === "object") {
            for(var key in params){
                str += ''+key+'='+params[key]+'&';
            }
        }
        this.genreState = 'pending';
        return new Promise((resolve, reject) => {
            this.api.all(str).then((data) => {
                runInAction(()=>{
                    this.booksForGenres = data;  
                    this.genreState = 'done';
                });
                resolve(true);
            },
            error=> {
                runInAction(()=>{
                    this.genreState = 'error';
                });
            });
        });
    }


    @action async getGenresList (){
        await this.fetchAllforGenres();
        let genres = new Set();
        this.booksForGenres.map((item)=>{
            item.genre.split(', ').forEach((g)=>genres.add(g.toLowerCase()))
            
        });
        runInAction(()=>{
            this.genres =  Array.from(genres).sort();
        });
		//this.clearBookList();
    }
}