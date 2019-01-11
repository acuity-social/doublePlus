import React from 'react';
import { withRouter } from 'react-router-dom';
import CommentReplies from '../components/CommentReplies';

class Comments extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            itemId: this.props.match.params.itemid,
         };
    }

    componentWillMount(){
        this.setState({
  
        });
    };

    shouldComponentUpdate(lastState, nextState) {
        return true;
    };

    route (link) {
        this.props.history.push(link)
    };

    render() {
        let Render;
        Render =
        <CommentReplies itemId = {this.state.itemId}/>
        return(Render);
    };

    componentWillUnmount() {
    };

}

export default withRouter(Comments);