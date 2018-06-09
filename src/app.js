import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import './app.scss';
import Scheduler from "./Scheduler";
import Posts from "./Posts";
import axios, {get, post} from "axios";
import toastr from "toastr";

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts : [],
        }
    }

    addToScheduledPosts(post){
        this.setState({
            posts : [post, ...this.state.posts]
        })
    }

    componentDidMount(){
        this.getPosts(false);
    }

    getPosts(status){
        get('/posts', {
            params: {
                published : status
            }
        }).then((response) => {
            this.setState({posts : response.data})
        });
    }

    deletePost(id, e){
        console.log(id);
        e.preventDefault();
        // GET request for remote image
        axios.delete('/schedule', {params: {'id': id}})
            .then((response) => {
                if(response.data.done){
                    this.setState({
                        posts : this.state.posts.filter((post) => {
                            return post._id !== id
                        })
                    });
                    toastr.success('Posts removed');
                }
            });
    }

    publish(id, e){
        e.preventDefault();
        console.log(id);
        post('/schedule/publish', {
            id : id
        }).then((response) => {
            console.log(response);
            if(response.data.published){
                this.setState({
                    posts : this.state.posts.filter((post) => {
                        return post._id !== id
                    })
                });
                toastr.success('Posts published');
            }
        });
    }

    render(){
        return(
            <div id="app">
                <Scheduler addPost={this.addToScheduledPosts.bind(this)}/>
                <hr className="my-4"/>
                <Posts
                    posts={this.state.posts}
                    deletePost={this.deletePost.bind(this)}
                    publish={this.publish.bind(this)}
                />
            </div>
        )
    }
}

if(document.getElementById('root') !== null){
    ReactDOM.render(
        <App/>,
        document.getElementById('root')
    );
}