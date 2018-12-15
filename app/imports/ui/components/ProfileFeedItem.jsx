import React from 'react';
import { withRouter } from 'react-router-dom';
import base64img from '../../startup/client/lib/base64img.js';
import ReplyBox from './ReplyBox.jsx';
const web3 = require('web3');

class ProfileFeedItem extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            item: this.props.item,
            reply:false
        };
    }

    componentWillMount(){
        this.setState({
            profileImg: "data:image/jpeg;base64, " + base64img.defaultProfileImg
        });
        this.state.item.init()
        .then(_item => {
            console.log(_item);
            this.setState({
                owner:_item.owner(),
                itemId:_item.itemId,
                isMine: (web3.utils.toChecksumAddress(_item.owner()) == web3.utils.toChecksumAddress(Session.get('addr')))
            })

            MixUtil.getBlurbInfo(_item.itemId)
            .then(blurbInfo =>{
                console.log('info', blurbInfo);
            })

            MixUtil.getProfileLocalDb(_item.owner())
            .then(_profile => {

                this.setState({
                    name:_profile.name,
                    bio:_profile.bio,
                    image:_profile.image,
                    location:_profile.location,
                    type:_profile.type
                })
            });
            


            _item.latestRevision().load()
            .then(_revision => {
                this.setState({
                    bodyText: _revision.getBodyText(),
                    timeStamp: moment.unix(_revision.getTimestamp()).format('YYYY MM DD'),

                });


            })

        })
        
        
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    handleReplyChange(e) {
        this.setState({
            reply:!this.state.reply,
        });

    };

    handleDonate(e) {

        let notify = 
        $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            title: '',
            message: 'Donating to Item Owner!',
            target: '_blank',
            allow_dismiss: false,
          },{
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            type:'info',
            showProgressbar: true,
            placement: {
                from: "bottom",
                align: "center"
            }
          });

          MixUtil.donateToItem(Session.get('addr'),this.state.itemId, notify);


    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        

        Render = 
        <div className="w3-container w3-card w3-white w3-round w3-margin"><br/>
            <img  src = {this.state.profileImg} alt="Avatar" className="w3-left w3-circle w3-margin-right" style={{width:'60px'}}/>
            <span className="w3-right w3-opacity">{this.state.timeStamp}</span>
            <h3>{this.state.name}</h3> <a href="#" onClick={this.route.bind(this,'/profile/'+this.state.owner)} > {this.state.owner}</a>
            
            <hr className="w3-clear"/>
            <p style={{paddingBottom:"10px",fontSize:"20px"}}> &nbsp; {this.state.bodyText}</p>
            {!this.state.isMine &&
            <button type="button" onClick={this.handleDonate.bind(this)} className="btn btn-success w3-margin-bottom"><i className="fa fa-money"></i> &nbsp;Send a Mix</button>
            }
            <button type="button" onClick={this.handleReplyChange.bind(this)} className="btn w3-theme-d2 w3-margin-bottom"><i className="fa fa-comment"></i> &nbsp; {this.state.reply ? 'Cancel': 'Reply'}</button> 
            <span className="w3-right w3-opacity"> <a href="" onClick={this.route.bind(this, "comments/"+ this.state.itemId) }> Replies: 23</a> </span>
            <span className="w3-right w3-opacity">  Mix Received: 1232 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {this.state.reply &&
                <div style={{paddingBottom:"20px"}}>
                    <ReplyBox parentItemId = {this.state.itemId}/>
                </div>
            }
        </div>  
        
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(ProfileFeedItem);