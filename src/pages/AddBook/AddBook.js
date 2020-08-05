import React, {Component} from 'react';
import { urlBuilder } from '~/routes';
import { Link } from 'react-router-dom';
import withStore from '~/hocs/withStore';
import 'antd/dist/antd.css';
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
} from 'antd';
const { Option } = Select;
const { TextArea } = Input;

const tailLayout = {
	wrapperCol: {
	  offset: 8,
	  span: 16,
	},
};

function handleChange(value) {
  //console.log(`selected ${value}`);
}

class AddBook extends Component{

	formRef = React.createRef();
	state = {
		newAuthor: false,
		newGenres: false,
	}

  onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  componentDidMount() {
		this.props.stores.genres.getGenresList();	
		this.props.stores.authors.fetchAll({_sort:'secondName',_order:'asc'});
	}

	selectAuthor = (a) => {
		if(a==-1){
			this.setState({newAuthor:true});
		}else{
			this.setState({newAuthor:false});
		}

	}
	
	onSubmit = (e) => { 
		if(e.author == -1) {
			let newAuthor = {
				name: e.name,
				middleName: e.middleName?e.middleName:'',
				secondName: e.secondName,
				years: e.years,
				description: e.authorDescription
			}
			let createdAuthor = this.props.stores.authors.add(newAuthor)
			.then((createdAuthor)=>{
				let book = {
					authorId: createdAuthor.id,
					year: e.bookCreatedDate,
					description: e.bookDescription,
					genre: e.bookGenres.join(', '),
					name: e.bookTitle
				}
				this.props.stores.books.add(book);
			})
			.then(()=>{
				this.onReset(); 			
			})
		} else {
		
			let genres = '';

			if(e.newBookGenres){
				genres = [...e.bookGenres, ...e.newBookGenres.split(', ')].join(', ');
			}else{
				genres = e.bookGenres.join(', ');
			}
			console.log("genres:",genres);			
			let book = {
				authorId: e.author,
				year: e.bookCreatedDate,
				description: e.bookDescription,
				genre: genres,
				name: e.bookTitle
			}
			this.props.stores.books.add(book)
			.then(()=>{
				this.onReset() 
			})
		}
	}

	onFinishFailed = () => {
		console.log("ERROR");
	}
	onReset = () => {
		this.formRef.current.resetFields();
		this.setState({newAuthor: false, newGenres: false});
	};
	onSwitchChange = (e) => {
		this.setState({newGenres: e});
	}

	render(){
		let genresModel = this.props.stores.genres;
		let authorsModel = this.props.stores.authors;
		let genresList = genresModel.genres.map((item)=>(
			<Option key={item}>{item}</Option>
		));

		let authorsList = authorsModel.authors.map((item)=>{
			let middle = item.middleName?`${item.middleName}`:'';
			let name = `${item.secondName} ${item.name} ${middle}`;
			return (
				<Select.Option key={item.id} value={item.id}>{name}
				</Select.Option> 
			)
		});

		return (
			<div>
				<Form onSubmit={this.onSubmit}
				      onFinish={this.onSubmit}
					  onFinishFailed={this.onFinishFailed}
					  ref={this.formRef}
				labelCol={{
				  span: 8,
				}}
				wrapperCol={{
				  span: 10,
				}}
				layout="horizontal"
			  >
					<Form.Item rules={[
									{required: true,},
								]} 
							label="Выберите автора, или создайте нового" name="author">
						<Select showSearch placeholder="Выберите автора из списка или создайте нового" onChange={this.selectAuthor}>
							<Select.Option className="new" value={-1}><i>Новый автор</i></Select.Option>
							{authorsList}
						</Select>
					</Form.Item>

					{this.state.newAuthor?(
						<React.Fragment>
							<div className="form-group">	
							<Form.Item label="Имя" name="name" rules={[
									{required: true,},
								]}>
								<Input />
							</Form.Item>
							<Form.Item label="Отчество" name="middleName">
								<Input />
							</Form.Item>
							<Form.Item label="Фамилия" name="secondName" 
								rules={[
									{required: true,},
								]}>
								<Input />
							</Form.Item>
							<Form.Item label="Годы жизни" name="years">
								<Input/>
							</Form.Item>
							<Form.Item label="описание" name="authorDescription">
								<TextArea rows={4} />
							</Form.Item>
							</div>
						</React.Fragment>
					):''}

					<Form.Item label="Название книги" name="bookTitle" 
								rules={[
									{required: true,},
								]}>
						<Input/>
					</Form.Item>
					<Form.Item label="Год создания" name="bookCreatedDate">
							<Input/>
						</Form.Item>
					<Form.Item label="Жанры" 
							name="bookGenres">
						<Select
							mode="multiple"
							style={{ width: '100%' }}
							placeholder="Выберите несколько жанров из списка"
							onChange={handleChange}
						>
							{genresList}
						</Select>
					</Form.Item>
					<Form.Item label={(<span> Добавить новые жанры&nbsp;&nbsp;<Switch size="small" defaultChecked={false} onChange={this.onSwitchChange} /></span>)}
								name="newBookGenres">
						{this.state.newGenres?<Input placeholder="Добавьте через запятую несколько новых жанров"/>:''}
					</Form.Item>	
					<Form.Item label="Краткое описание" name="bookDescription">
						<TextArea rows={4}/>
					</Form.Item>

					<Form.Item {...tailLayout}>
						<Button type="primary" htmlType="submit">
							Сохранить
						</Button>
						<Button htmlType="button" onClick={this.onReset}>
							Сбросить
						</Button>
					</Form.Item>
				</Form>
		</div>
		)
	}
}
export default withStore(AddBook);