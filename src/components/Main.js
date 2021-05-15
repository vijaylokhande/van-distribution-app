import React ,{Component}from 'react';
import MainContainer from '../container/MainContainer';
import Footer from './footer/Footer';
import Menu from './menu/Menu';
import Auth from './Auth';
import { BrowserRouter } from "react-router-dom";
import {Spinner} from 'react-bootstrap';
import {IN_PROGRESS,SET_APP_CONFIGURATION} from '../constants/ActionConstants';
import {LIST_APP_CONFIGURATION} from '../constants/AppConstants';
import { connect } from "react-redux";
import { getCall } from '../service/RestClient';

class Main extends Component{

  componentDidMount(){    
      this.listConfiguration();    
  }

  
  listConfiguration = () => {
    this.props.setInProgress(true);
    getCall(LIST_APP_CONFIGURATION).then(res => {
        if (res.status === 200) {
            this.props.listConfiguration(res.data);
            this.props.setInProgress(false);
        }
        else {
            this.props.setInProgress(false);
        }
    })
        .catch(exp => {
            this.props.setInProgress(false);
            console.log(exp);
        });
};

  render() {
    return (
      <div> 
          <BrowserRouter>
            {this.props.loginUser.token===undefined? <Auth></Auth>: 
            <div>
              <div><Menu></Menu></div>        
              <div><MainContainer></MainContainer></div>
              <div><Footer></Footer></div>  
                     
            {  this.props.inProgress ?            
            <div id="bd" className="bd">
            <Spinner animation="border" variant="warning" className="center-pos" ><span className="sr-only">Loading...</span></Spinner>
            </div>
            :null
            }
            </div>
          }
          </BrowserRouter>         
      </div>
    );
  }
}
const mapDispatchToProps=(dispatch) =>({ 
  setInProgress: flag =>  dispatch({type:IN_PROGRESS,payload:flag}),
  listConfiguration: data => dispatch({ type: SET_APP_CONFIGURATION, payload: data })        
});
const mapStateToProps = (state) => ({
inProgress:state.config.inProgress,
loginUser:state.auth.loginUser
});
export default connect(mapStateToProps,mapDispatchToProps)(Main);
