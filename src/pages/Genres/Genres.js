import React, {Component} from 'react';
import E404 from '~c/errors/404';
import { urlBuilder } from '~/routes';
import withStore from '~/hocs/withStore';

import Splitter from '~c/splitter';
import SplitterZone from '~c/splitter/SplitterZone';

import { Layout, Input, Empty, Spin, List, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
const { Header, Content, Footer, Sider } = Layout;

class Genres extends Component{

  componentDidMount() {
      this.props.stores.genres.getGenresList();
  }

  onChange = checkedList => {
    let genresModel = this.props.stores.genres;
      genresModel.setCheckedList(checkedList);
      genresModel.setIndeterminate(!!checkedList.length && checkedList.length < genresModel.genres.length);
      genresModel.setCheckAll(checkedList.length === genresModel.genres.length);

    if(checkedList.length > 0) {
      let params = '?_expand=author&_sort=authorId&order=asc';
      checkedList.forEach((item, i)=>{
        params+=`&genre_like=${item}`;
      });
      genresModel.fetchAll(params);
      //genresModel.clearBookInfo();
    }else{
      genresModel.clearBookList();
      genresModel.clearBookInfo();
    }
  };

  onCheckAllChange = e => {
    let genresModel = this.props.stores.genres;
    genresModel.setCheckedList(e.target.checked ? genresModel.genres : []);
    genresModel.setIndeterminate(false);
    genresModel.setCheckAll(e.target.checked);

    
    if (e.target.checked > 0){
      let params = '?_expand=author&_sort=authorId&order=asc';
      genresModel.checkedList.forEach((item, i)=>{
        params+=`&genre_like=${item}`;
      });
      genresModel.fetchAll(params);
    }else{
      genresModel.clearBookList();
      genresModel.clearBookInfo();
    }
  };

  showBookInfo = (id) => {
    if(id !== this.props.stores.genres.book.id){
      let params = `?_expand=author`;
      this.props.stores.genres.fetchOne(id,params);
    }
  }
    render() {  
    let genresModel = this.props.stores.genres;
    let booksByGenre = genresModel.books.map((item)=>{
      let author;
      if(item.author){
        let middle = item.author.middleName?`${item.author.middleName[0]}.`:'';
        author=`${item.author.secondName} ${item.author.name[0]}. ${middle}, `
      }
      return (
        <div key={item.id} className="book">
          <span>{author}</span>
          <a onClick={()=>this.showBookInfo(item.id)} href="#" className="link-to-book">{item.name}</a>,&nbsp;
          {item.year}, <i>{item.genre}</i>
        </div>
      )
    });

      return (
        <React.Fragment>
          <div className="flex-container">
            <aside className="aside-left">
              <div className="flex-container flex-container_columns">
                <div className="flex-container__auto">
                
                </div>
                <div className="flex-container__fill">
                  <div className="fill-container vertical-scroll">
                    <div className="genres-list">
                      <div className="site-checkbox-all-wrapper">
                        <Checkbox
                          indeterminate={genresModel.indeterminate}
                          onChange={this.onCheckAllChange}
                          checked={genresModel.checkAll}>
                          Отметить все
                        </Checkbox>
                      </div>
                      <br />
                      <CheckboxGroup
                        options={genresModel.genres}
                        value={genresModel.checkedList}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                </div>
              </div>  
            </aside>
            <section className="main-content">

            <Splitter horizontal>
                <SplitterZone minHeight="200px" height="50%">
                  {genresModel.state=='empty'? <div className="centered"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>:
                  genresModel.state=='done' ?
                    <div className="fill-container" style={{overflowY:'auto', padding: '16px'}}>
                      {booksByGenre}
                    </div>
                  : genresModel.state=='pending'? <div className="centered"><Spin /></div>: <E404 />}
                    
                </SplitterZone>
                <SplitterZone minHeight="200px">
                  {genresModel.stateOne=='empty'? <div className="centered"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>:
                    genresModel.stateOne=='done' ?
                    <div className="fill-container" style={{overflowY:'auto', padding: '16px'}}>
                      <h4>{genresModel.book.name}</h4>
                      <p>
                        <b>{genresModel.book.author.secondName} {genresModel.book.author.name}{genresModel.book.author.middleName?` ${genresModel.book.author.middleName}`:''}</b>,&nbsp;
                          {genresModel.book.year}
                      </p>
                      <p><em>{genresModel.book.genre}</em></p>
                      <p>{genresModel.book.description}</p>
                    </div>
                    : genresModel.stateOne=='pending'? <div className="centered"><Spin /></div>: <E404 />}
                </SplitterZone>
              </Splitter> 
            </section>
          </div>  
        </React.Fragment>
      ) 
  }
}
export default withStore(Genres);