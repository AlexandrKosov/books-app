import {observable, computed, action, runInAction, configure} from 'mobx';
configure({ enforceActions: "observed" });

export default class{
    @observable items = [];
    //@observable itemsByAuthor = [];
    @observable state = 'empty'; // pending, done, error //fetchByAuthor|fetchAll
    @observable book = {};// отдельная книга, вызываемая fetchOne
    @observable genres = null;
    @observable stateOne = 'empty'; //empty, pending, done, error (пусто, загрузка, загружено, ошибка) - статусы работы fetchOne 

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
                    this.items = data;  
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
                    this.items = data;
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
                    this.book = data;  // нужно ИМЕННО передавать данные массиву items!!!!
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
    @action add(artForm){
        return new Promise((resolve, reject) => {
            this.api.add(artForm).then((data) => {
                resolve(data);
            });
        });
    }

    @action edit(artForm){
        return new Promise((resolve, reject) => {
            this.api.edit(artForm.id,artForm).then((data) => {
                resolve(data);
            });
        });
    }

    @action delete(id){
        return new Promise((resolve, reject)=>{
            this.api.remove(id).then((data)=>{
                resolve(true)
            })
        });
    }
}