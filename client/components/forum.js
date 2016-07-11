import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import * as actions from '../actions';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import ForumItem from './forumItem';
import CircularProgress from 'material-ui/CircularProgress';

import ForumModal from './forumModal';
import ForumNavbar from './forumNavbar';


const style = {
	customList:{
		height:'600',
		overflow: 'scroll',
	},
	comment:{
		height: 100,
		marginTop: 25,
		marginLeft: 150,
		marginRight: 150,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		display: 'inline-block',
		width: '100%',
	},
	commentButton: {
		marginTop: -100,
	},
	button: {
		textDecoration: 'none',
		color: 'white',
	},
	forumWindow: {
		textAlign: 'left',
		width: '100%',
		height: 800,
	},
	optionsBar: {
		width: '100%',
		height: 50,
		backgroundColor: '#FF0A9C',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
	},
	optionElement: {
		display: 'inline-block',
		paddingRight: 10,
		verticalAlign: 'middle',
	},
	optionsElements: {
		float: 'right',
		display: 'inline-block',
		alignItems: 'center',
	},
	optionsMenu: {
		marginTop: -15,
	},
	textField:{
		border:' 3px solid #585858',
		marginTop: 15,
		marginBottom:15,
		width: '50%',
		height: 200,
	},
	subject:{
		width: '50%',
		border:' 3px solid #585858',
	},
	newPost:{
		height: 400,
		marginTop: 25,
		marginLeft: 150,
		marginRight: 150,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor:'#D8D8D8',
	},
	mainPost:{
		border:' 3px solid #585858',
		backgroundColor:'#D8D8D8',
	},
}


//when user wants to create a new post, make this true
let flag = false;

class Forum extends Component {
	constructor(props){
		super(props);

		this.state = {
			modalOpen:false,
			filter: 'Most Recent',
			posts: '',
			comments: '',
			input: '',
			subject:'',
			commentValue:''
		}
	}
	handleClick(body, subject){
		this.props.newPost({ subject: this.state.subject, message:this.state.input });
		flag = !flag;
		this.setState({});
	}
	handleChange(event, index, value) {
		this.setState({
			filter: value
		})
	}
	handlChangeInput(event,subject){
		if(subject === 'comment'){
			this.setState({commentValue:event.target.value});
		}
		else if(subject === 'subject'){
			this.setState({subject:event.target.value})
		}else{
		this.setState({input:event.target.value})
		}
	}
	componentDidMount(){
		this.props.getPosts();
	}
	handleModal(){
		flag = !flag;
		this.setState({});
	}
handleCommentSubmit(comment,id){
	this.props.postComment({comment, id});
	var that = this;
	setTimeout(function(){
		that.props.getComments({id: id});
	},100);

}
	handleForumItemClick(item){
		//the this reffers to the forumItem not this fourm.js
		this.props.getComments({id: item.id});
	}
	render() {
		if(this.props.waiting){
			return(
				<div>
				 <CircularProgress size={2} />
				</div>
			);
		} else if(flag){
			//if the user clicked on post we want the modal to pop up before anything else
					return (
						<div style={style.forumWindow}>	
								<ForumNavbar />
								<ForumModal />		
						</div>
					);
		} else if(this.props.comments){
			//if the post was clicked show the comments belonging to that post
			let item = this.props.post;
			//check the length of the comments array, if it is empty dont try to map comments to the page
			if(this.props.comments.length < 1){
				return (
					<div style={style.forumWindow}>
						<AppBar style={style.optionsBar} showMenuIconButton={false}
							children={
								<div style={style.optionsElements}>
								<div style={style.optionElement}>
									<FlatButton onClick={()=> this.props.getPosts()} style={style.button} label="Back" />
								</div>
									<div style={style.optionElement}>
										<FlatButton onClick={()=> this.handleModal()} style={style.button} label="Post" />
									</div>
									<div style={style.optionElement}>
										<DropDownMenu style={style.button} value={this.state.filter} onChange={(event, index, value) => this.handleChange(event, index, value)}>
						          <MenuItem value={'Most Recent'} primaryText="Most Recent" />
						          <MenuItem value={'Up-Votes'} primaryText="Up-Votes" />
						          <MenuItem value={'Most Comments'} primaryText="Most Comments" />
						        </DropDownMenu>
									</div>
								</div>
							}
						/>
							<div>
							<Paper zDepth={2}>
								<List style={style.customList}>
									<ForumItem style={style.mainPost} item={item} />
									<div>{'Be the first to comment!'}</div>
								</List>
							</Paper>
						</div>
						<div style={style.comment}>
							<br></br>
							<TextField 
								style={style.subject}
								placeholder={'Comment'}
								multiLine={true}
								name="POST_COMMENT"
								onChange={(e)=> this.handlChangeInput(e,'comment')}
							/>
							<RaisedButton label="Comment" primary={true} style={style.commentButton} onClick={()=>this.handleCommentSubmit(this.state.commentValue, this.props.post.id)} />
						</div>
					</div>
				);
				} else {
					// this else statement is in the comment if statment, and maps the comments to the page
					let item = this.props.post;
						return (
							<div style={style.forumWindow}>
								<AppBar style={style.optionsBar} showMenuIconButton={false}
									children={
										<div style={style.optionsElements}>
										<div style={style.optionElement}>
											<FlatButton onClick={()=> this.props.getPosts()} style={style.button} label="Back" />
										</div>
											<div style={style.optionElement}>
												<FlatButton onClick={()=> this.handleModal()} style={style.button} label="Submit a Post" />
											</div>
											<div style={style.optionElement}>
												<DropDownMenu style={style.button} value={this.state.filter} onChange={(event, index, value) => this.handleChange(event, index, value)}>
								          <MenuItem value={'Most Recent'} primaryText="Most Recent" />
								          <MenuItem value={'Up-Votes'} primaryText="Up-Votes" />
								          <MenuItem value={'Most Comments'} primaryText="Most Comments" />
								        </DropDownMenu>
											</div>
										</div>
									}
								/>
								<div>
									<Paper zDepth={2}>
												<List style={style.customList}>
													<ForumItem style={style.mainPost} item={item} />
													{ this.props.comments.map(item =>
														<ForumItem context={this} item={item} /> 
													)}
												</List>
											</Paper>
								</div>
								<div style={style.comment}>
									<br></br>
									<br></br>
									<TextField 
										style={style.subject}
										placeholder={'Comment'}
										multiLine={true}
										name="POST_COMMENT"
										onChange={(e)=> this.handlChangeInput(e,'comment')}
									/>
									<RaisedButton label="Comment" primary={true} style={style.commentButton} onClick={()=>this.handleCommentSubmit(this.state.commentValue, this.props.post.id)} />
								</div>		
							</div>
					);
				}
		}
		else {
			// this last else reverts to rendering all the posts on the page
			return (
				<div style={style.forumWindow}>
					<AppBar style={style.optionsBar} showMenuIconButton={false}
						children={
							<div style={style.optionsElements}>
								<div style={style.optionElement}>
									<FlatButton onClick={()=> this.handleModal()} style={style.button} label="Post" />
								</div>
								<div style={style.optionElement}>
									<DropDownMenu style={style.button} value={this.state.filter} onChange={(event, index, value) => this.handleChange(event, index, value)}>
					          <MenuItem value={'Most Recent'} primaryText="Most Recent" />
					          <MenuItem value={'Up-Votes'} primaryText="Up-Votes" />
					          <MenuItem value={'Most Comments'} primaryText="Most Comments" />
					        </DropDownMenu>
								</div>
							</div>
						}
					/>
					<div>
						<Paper zDepth={2}>
							<List style={style.customList}>
								{ this.props.posts.map(item =>
									<ForumItem context={this} handleClick={this.handleForumItemClick} item={item} /> 
								)}
							</List>
						</Paper>
					</div>		
				</div>
			)
		}
	};
}

function mapStateToProps(state) {
	return { 
		posts: state.posts.posts,
		waiting: state.response.waiting ,
		comments: state.posts.comments,
		post: state.posts.post
	};
}

export default connect(mapStateToProps, actions)(Forum);