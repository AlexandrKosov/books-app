import React, {Component} from 'react';
import styles from './app.module.css';
import './app.less';
//import {HashRouter as Router, Route, Switch, NavLink, Link} from 'react-router-dom';
import {BrowserRouter as Router, Route, Switch, NavLink, Link} from 'react-router-dom';
import routes, { routesMap } from '~/routes';

import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import withStore from '~/hocs/withStore';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class App extends Component{

    render(){
        let routesComponents = routes.map((route) => {
            return <Route path={route.url}
                          component={route.component}
                          exact={route.exact} 
                          key={route.url}
                    />;
        });

        return (
            <Router>
                <Layout className="page-layout">
                    <Header>
                        <div className="logo" />
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <NavLink to={routesMap.home} exact activeClassName={styles.active}>
                                Авторы
                            </NavLink>
                        </Menu.Item>
						<Menu.Item key="2">
                            <NavLink to={routesMap.genres} exact activeClassName={styles.active}>
                                Жанры
                            </NavLink>
                        </Menu.Item>
						<Menu.Item key="3">
                            <NavLink to={routesMap.addBook} exact activeClassName={styles.active}>
                                Добавление книг
                            </NavLink>
                        </Menu.Item>
                        </Menu>
                    </Header>
                    <Layout>
                        <Content className="main-layout">
                            <Switch>
                                {routesComponents}
                            </Switch>
                        </Content>
                    </Layout>
                <Footer>
                    <footer>
                        Футер
                    </footer>  
                </Footer>
                </Layout>
            </Router>
        )
    }
}

export default withStore(App);
