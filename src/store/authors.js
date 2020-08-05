import {observable, computed, action, runInAction} from 'mobx';

//global  experimentalDecorators
export default class{
    constructor(rootStore){
        this.rootStore = rootStore;
        this.api = this.rootStore.api.authors;
    }

    @observable authors = [];
    @observable state = 'empty'; // pending, done, error
    @observable stateOne = 'empty'; // pending, done, error
    @observable author = {};// отдельный автор, получаемый через fetchOne
	
    @action fetchAll(params){
        let str = '?';
        for(var key in params){
            str += ''+key+'='+params[key]+'&';
        }
        this.state = 'pending';
        return new Promise((resolve, reject) => {
            this.api.all(str).then((data) => {
                runInAction(()=>{
                    this.authors = data;
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
	
	@action fetchOne(id){
        this.stateOne = 'pending';
        return new Promise((resolve, reject) => {
            this.api.one(id).then((data) => {
                runInAction(()=>{
                    this.author = data;
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

    @action add(authorForm){
        return new Promise((resolve, reject) => {
            this.api.add(authorForm).then((data) => {
                resolve(data);
            });
        });
    }

    @action edit(authorForm){
        return new Promise((resolve, reject) => {
            this.api.edit(authorForm.id,authorForm).then((data) => {
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