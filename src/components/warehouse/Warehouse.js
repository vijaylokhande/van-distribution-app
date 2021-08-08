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
                            this.props.warehouse !== undefined && this.props.warehouse !== null ? (
                                    <Table responsive striped bordered hover size="sm" >
                                        <thead>
                                            <tr>
                                            <th>Warehouse Id</th>
                                            <th>Warehouse Name</th>
                                            <th>Warehouse Address</th>
                                            <th>Warehouse Contact</th>
                                            <th>Active Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.warehouse.map((data, i) => {
                                                return (
                                                    <tr>
                                                        <td>{data.warehouseId}</td>
                                                        <td>{data.warehouseName}</td>
                                                        <td>{data.warehouseAddress}</td>       
                                                        <td>{data.warehouseContact}</td>                                                   
                                                        <td>{data.activeStatus ? "Active" : "Inactive"}</td>
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