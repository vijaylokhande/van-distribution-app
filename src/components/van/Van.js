import React,{Component} from 'react';
import { getCall } from '../../service/RestClient';
import { Container, Card, Button, Table } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_VAN } from '../../constants/AppConstants';
import { SET_VAN } from '../../constants/ActionConstants';

class Van extends Component{

    componentDidMount() {
        this.listVan();
    }

    listVan = () => {
        this.props.setInProgress(true);
        getCall(LIST_VAN).then(res => {
            if (res.status === 200) {
                this.props.listVan(res.data);
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

    render(){
        return ( 
        <Container fluid className="app-container">
        <Card>
            <Card.Header as="span">Van</Card.Header>
            <Card.Body>
            {
                            this.props.van !== undefined && this.props.van !== null &&
                                this.props.van.data !== undefined && this.props.van.data !== null ? (
                                    <Table responsive striped bordered hover size="sm" >
                                        <thead>
                                            <tr>
                                            <th>VAN_ID</th>
                                            <th>VAN_NUMBER</th>
                                            <th>VAN_NAME</th>
                                            <th>ACTIVE_STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.van.data.map((data, i) => {
                                                return (
                                                    <tr>
                                                        <td>{data.VAN_ID}</td>
                                                        <td>{data.VAN_NUMBER}</td>
                                                        <td>{data.VAN_NAME}</td>                                                        
                                                        <td>{data.ACTIVE_STATUS ? "Active" : "Inactive"}</td>
                                                    </tr>)
                                            })
                                            }
                                        </tbody>
                                    </Table>
                                ) :
                                null
                        }
            </Card.Body>    
        </Card>
        </Container>
        );
    }
    
}
const mapDispatchToProps = (dispatch) => ({
    setInProgress: flag => dispatch({ type: IN_PROGRESS, payload: flag }),
    listVan: data => dispatch({ type: SET_VAN, payload: data })
});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    van: state.van.van
});

export default connect(mapStateToProps, mapDispatchToProps)(Van);