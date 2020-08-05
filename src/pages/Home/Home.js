import React, {Component} from 'react';
import E404 from '~c/errors/404';
import { urlBuilder } from '~/routes';
import withStore from '~/hocs/withStore';

import Splitter from '~c/splitter';
import SplitterZone from '~c/splitter/SplitterZone';

import { Layout, Input, Empty, Spin, List } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class Home extends Component{

    componentDidMount() {
        this.props.stores.authors.fetchAll({_sort:'secondName',_order:'asc'});
    }

    showAuthor = (id) => {     
      if(id !== this.props.stores.authors.author.id){
        this.props.stores.authors.fetchOne(id);
        this.props.stores.books.fetchByAuthor(id);
        this.props.stores.books.clearBookInfo();
      }
    }

    showBookInfo = (id) => {
      if(id !== this.props.stores.books.book.id){
        let params = `?_expand=author`;
        this.props.stores.books.fetchOne(id,params);
      }
    }

    onFilter = (e) => {
      this.props.stores.authors.fetchAll({_sort:'secondName',_order:'asc',secondName_like: e.target.value});
    }

    render() {  
    let booksModel = this.props.stores.books;
    let authorsModel = this.props.stores.authors;
    let ulength = authorsModel.authors.length;
    
    let booksbyAuthor = booksModel.items.map((item)=>{
      return (
        <div key={item.id} className="book">
          <a onClick={()=>this.showBookInfo(item.id)} href="#" className="link-to-book">{item.name}</a> - {item.year}, <i>{item.genre}</i>
        </div>
      )
    });
      return (
        <React.Fragment>
          <div className="flex-container">
            <aside className="aside-left">
              <div className="flex-container flex-container_columns">
                <div className="flex-container__auto">
                  <Input name="searchAuthor" 
                        allowClear
                        placeholder="Поиск по авторам" 
                        onChange={this.onFilter}/>
                  <p>Всего авторов: {ulength}</p>
                </div>
                <div className="flex-container__fill">
                  <div className="fill-container vertical-scroll">
                    {authorsModel.state=='done' ? <List
                      dataSource={authorsModel.authors}
                      renderItem={item => {
                        let middle = item.middleName?`${item.middleName}`:'';
                        let name = `${item.secondName} ${item.name} ${middle}`;
                        return (
                          <List.Item key={item.id} 
                                    onClick={()=>this.showAuthor(item.id)} 
                                    className={item.id===authorsModel.author.id?'selected':''}>
                              {name}
                          </List.Item> 
                        )
                      }
                      }
                      size='small'>
                    </List> : authorsModel.state=='pending'? <Spin />: <E404 />}
                  </div>
                </div>
              </div>  
            </aside>
            <section className="main-content">

            <Splitter horizontal>
                <SplitterZone minHeight="200px" height="50%">
                    {authorsModel.stateOne=='empty' ? <div className="centered"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>:
                      authorsModel.stateOne=='done' ?
                    <div className="fill-container" style={{overflowY:'auto', padding: '16px'}}>
                      <div>
                        <h4><b>{authorsModel.author.secondName} {authorsModel.author.name} {authorsModel.author.middleName?authorsModel.author.middleName:''} </b> </h4>
                        <div>{authorsModel.author.years}</div>
                        <div>{authorsModel.author.description}</div>
                        <hr />   
                        {booksbyAuthor}
                      </div>
                    </div> : authorsModel.stateOne=='pending'? <div className="centered"><Spin /></div>: <E404 />}
                   
                </SplitterZone>
                <SplitterZone minHeight="200px">
                    {booksModel.stateOne=='empty'? <div className="centered"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>:
                    booksModel.stateOne=='done' ?
                    <div className="fill-container" style={{overflowY:'auto', padding: '16px'}}>
                      <h4>{booksModel.book.name}</h4>
                       <p>
                         <b>{booksModel.book.author.secondName} {booksModel.book.author.name}{booksModel.book.author.middleName?` ${booksModel.book.author.middleName}`:''}</b>,&nbsp;
                          {booksModel.book.year}
                       </p>
                       <p><em>{booksModel.book.genre}</em></p>
                       <p>{booksModel.book.description}</p>
                    </div>
                    : booksModel.stateOne=='pending'? <div className="centered"><Spin /></div>: <E404 />}
                </SplitterZone>
              </Splitter> 
            </section>
          </div>  
        </React.Fragment>
      ) 
  }
}
export default withStore(Home);