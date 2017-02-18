import React, { Component,PropTypes} from 'react';
import './App.css';

class Card extends Component {
  render() {
    return (
      <div className="card">
          <div className="header">
            <div className="avatar" style={{backgroundImage:'url('+this.props.profile_image_url+')'}}>
            </div>
            <div className="user-info">
                <div className="title">
                    <span>{this.props.name}</span>
                    <span className="time text-muted">{this.props.created_at.split('+')[0]}</span>
                </div>
                <div className="description">{this.props.description}</div>
            </div>
          </div>
          <div className="content">
              {this.props.text}
          </div>    
          <div className="footer">
            <div className="content">
              <div className="text-muted">
                  <i className="fa fa-retweet"></i>
                  <span>{this.props.retweet_count}</span>
              </div>
              <div className="text-muted">
                <i className="fa fa-heart"></i>
                <span>{this.props.favorite_count}</span>
              </div>
            </div>
          </div>  
      </div>
    );
  }
}

Card.propTypes = {
    name : PropTypes.string,
    description : PropTypes.string,
    profile_image_url : PropTypes.string,
    created_at : PropTypes.string,
    retweeted: PropTypes.bool,
    favorited: PropTypes.bool,
    retweet_count: PropTypes.number,
    favorite_count: PropTypes.number,
    text:PropTypes.string
}


export default Card;
