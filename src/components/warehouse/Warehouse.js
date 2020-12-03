import React,{Component} from 'react';
import { getCall } from '../../service/RestClient';
import { Container, Card, Button, Table } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_WAREHOUSE } from '../../constants/AppConstants';
import { SET_WAREHOUSE } from '../../constants/ActionConstants';

class Warehouse extends Component{

    componentDidMount() {
        this.listWarehouse();
    }

    listWarehouse = () => {
        this.props.setInProgress(true);
        getCall(LIST_WAREHOUSE).then(res => {
            if (res.status === 200) {
                this.props.listWarehouse(res.data);
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
            <Card.Header as="span">Warehouse</Card.Header>
            <Card.Body>
            {
                            this.props.warehouse !== undefined && this.props.warehouse !== null &&
                                this.props.warehouse.data !== undefined && this.props.warehouse.data !== null ? (
                                    <Table responsive striped bordered hover size="sm" >
                                        <thead>
                                            <tr>
                                            <th>WAREHOUSE_ID</th>
                                            <th>WAREHOUSE_NAME</th>
                                            <th>WAREHOUSE_ADDRESS</th>
                                            <th>WAREHOUSE_CONTACT</th>
                                            <th>ACTIVE_STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.warehouse.data.map((data, i) => {
                                                return (
                                                    <tr>
                                                        <td>{data.WAREHOUSE_ID}</td>
                                                        <td>{data.WAREHOUSE_NAME}</td>
                                                        <td>{data.WAREHOUSE_ADDRESS}</td>       
                                                        <td>{data.WAREHOUSE_CONTACT}</td>                                                   
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
    listWarehouse: data => dispatch({ type: SET_WAREHOUSE, payload: data })
});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    warehouse: state.warehouse.warehouse
});

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);