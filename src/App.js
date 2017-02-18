import React, { Component } from 'react';
import './App.css';
import Card from './Card';
import Halogen from 'halogen';
import $ from 'jquery';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      canSubmit : false,
      tag: '',
      data:[],
      loading: false,
      error: 'Search for a hashtag in the input box'
    };
  }

  getData = ()=>{
     this.setState({ loading: this.state.data.length === 0});
     let ref = this;
     $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:4000/tags/'+ref.state.tag,
            dataType: 'json',
            success: function(response) {
              ref.setState({loading: false, data: response.data,error: response.data.length ? '' : 'No Data found'});
            },
            error: function(xhr) {
              ref.setState({loading: false,error: xhr.status});
            }
      });
  }

  submit = (e)=> {
    e.preventDefault();
    this.getData();
    setInterval(this.getData,30000);
  }

  onChangeValue =(event)=> {
    let tag  = event.target.value;
    tag = tag || '';
    this.setState({canSubmit : tag !== '',tag: tag, error : tag === ''? 'Search for a hashtag in the input box' :''});
  }
  
  render() {
    return (
      <div>
      <div className="input-container">
          <form>
           <input className="tag-input" name="tag" placeholder="search hashtags" onChange={this.onChangeValue}/>
           <button type="submit" className="btn" disabled={!this.state.canSubmit} onClick={this.submit}>Go</button>
          </form>
      </div>
       <div >
          {
            this.state.data.length 
            ?
            this.state.data.map((d,i)=>{
              return <Card key={i} name={d.user.name}
                           description={d.user.description} 
                           profile_image_url={d.user.profile_image_url}
                           created_at={d.created_at}
                           retweeted={d.retweeted}
                           favorited={d.favorited}
                           retweet_count={d.retweet_count}
                           favorite_count={d.favorite_count}
                           text={d.text}/>;
            })
            :
            <div className="error">{this.state.error}</div>
            }
         <div>
           {
            this.state.loading 
            ?
            <div className="loader">
              <Halogen.ClipLoader color="#121517"/>  
              <div>Loading...</div>
            </div>    
            :  
            null
          }
          </div>   
        </div>
      </div>
    );
  }
}

export default App;
