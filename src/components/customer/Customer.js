import React, { Component } from 'react';
import { getCall, putCall, postCall, deleteCall } from '../../service/RestClient';
import { Container, Card, Button, ButtonGroup , Badge } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_CUSTOMER } from '../../constants/AppConstants';
import { SET_CUSTOMER } from '../../constants/ActionConstants';

import { pageinationOptions, ACTIVE_STATUS_OPTIONS } from '../../util/tableUtil'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import _ from 'underscore';

import { FaFilter, FaPlusCircle, FaSave, FaTrash } from 'react-icons/fa'

class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            toggleFilter: false
        };

        this.updateAndSave.bind(this);
        this.deleteAndSave.bind(this);
    }

    componentDidMount() {
        this.listCustomer();
    }

    listCustomer = () => {
        this.props.setInProgress(true);
        getCall(LIST_CUSTOMER).then(res => {
            if (res.status === 200) {
                this.props.listCustomer(res.data);
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


    getConfiguration = (type) => {
        var array = _.filter(this.props.configuration.data, function (object) { return object.PROPERTY_TYPE === type; });
        return _.map(array, function (object) {
           return { value: object.PROPERTY_ID, label: object.PROPERTY_VALUE };
        });
    }

    addNewEmpltyRecord = () => {

        this.props.setInProgress(true);
        var customerData = this.props.customer;
        customerData.data.unshift({            
                CUST_ID: null,
                CUST_NAME: null,
                SHOP_NAME: null,
                CUST_CONTACT: null,
                CUST_GST_NO: null,
                CUST_ADDRESS: null,
                OUTSTANDING: null,
                CUST_DOB: null,
                ACTIVE_STATUS: false
        });
        this.props.addNewEmpltyRecord(customerData);
        this.props.setInProgress(false);
    }

    toggleFilter = () => {
        this.setState({ toggleFilter: !this.state.toggleFilter });
    };

    updateAndSave = (cell, row, rowIndex) => {
        this.props.setInProgress(true);
        if (row !== null && row !== undefined) {
            if (row.CUST_ID === null || row.CUST_ID === undefined || row.CUST_ID === "") { // add new record
                var data = {};    
                
                data["CUST_ID"] = row.CUST_ID;
                data["CUST_NAME"] = row.CUST_NAME;
                data["SHOP_NAME"] = row.SHOP_NAME;
                data["CUST_CONTACT"] = row.CUST_CONTACT;
                data["CUST_GST_NO"] = row.CUST_GST_NO;
                data["CUST_ADDRESS"] = row.CUST_ADDRESS;
                data["OUTSTANDING"] = row.OUTSTANDING;
                data["CUST_DOB"] = row.CUST_DOB;                
                data["ACTIVE_STATUS"] = false;

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                postCall(LIST_CUSTOMER, data).then(res => {
                    if (res.status === 201) {
                        this.listCustomer();
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
            }
            else { // update record
                var data = {};

                data["CUST_ID"] = row.CUST_ID;
                data["CUST_NAME"] = row.CUST_NAME;
                data["SHOP_NAME"] = row.SHOP_NAME;
                data["CUST_CONTACT"] = row.CUST_CONTACT;
                data["CUST_GST_NO"] = row.CUST_GST_NO;
                data["CUST_ADDRESS"] = row.CUST_ADDRESS;
                data["OUTSTANDING"] = row.OUTSTANDING;
                data["CUST_DOB"] = row.CUST_DOB;                
                data["ACTIVE_STATUS"] = false;

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                putCall(LIST_CUSTOMER.concat("/").concat(row.EMP_ID), data).then(res => {
                    if (res.status === 200) {
                        this.listCustomer();
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
            }
        }
        else { // error
            this.props.setInProgress(false);
        }
    };

    deleteAndSave = (cell, row, rowIndex) => {
        if (row !== null && row !== undefined) {
            if (row.PRODUCT_ID === null || row.PRODUCT_ID === undefined || row.PRODUCT_ID === "") { // delete from cache
                this.listCustomer();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_CUSTOMER.concat("/").concat(row.PRODUCT_ID)).then(res => {
                    if (res.status === 200) {
                        this.listCustomer();
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
            }
        }
        else { // error
            this.props.setInProgress(false);
        }
    };

    saveAll = () => { };

    actionButton = (cell, row, rowIndex) => {
        return (
            <ButtonGroup size="sm">
                <Button variant="success" size="sm" onClick={() => { this.updateAndSave(cell, row, rowIndex) }}><FaSave /></Button>
                <Button variant="danger" size="sm" onClick={() => { this.deleteAndSave(cell, row, rowIndex) }}><FaTrash /></Button>
            </ButtonGroup>
        )
    };

    getTableColumn = (data) => {
        if (data !== null && data !== undefined) {
            var keys = Object.keys(data);

            var columnsArray = keys.map(key => {
                
                 if(key === 'ACTIVE_STATUS'){
                    return {
                    dataField: key,
                    text: 'STATUS',
                    sort: true,
                    type:'bool',
                    editor :{
                        type: Type.CHECKBOX,
                        value: 'true:false'
                    },
                    formatter : (cell)=>{  
                        return cell ? (<Badge variant="success">Active</Badge>) : (<Badge variant="danger">InActive</Badge>)
                    },
                    filter: this.state.toggleFilter ? textFilter() : false
                    };
                }
                else if (key === 'CUST_DOB') {
                    return {
                        dataField: key,
                        text: key,
                        type:'date',
                        filter: this.state.toggleFilter ? textFilter() : false,                        
                        sort: true,
                        headerStyle: () => {
                            return { width: "10%" };
                        },
                        editor: {
                            type: Type.DATE
                        },
                        formatter: (cell, row, rowIndex) => {
                            
                            var date = new Date(cell);
                            var yyyy = date.getFullYear();
                            var mm = date.getMonth() + 1;
                            if (mm < 10) {
                                mm = '0' + mm;
                            }
                            var dd = date.getDate();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            var ndt = yyyy + "-" + mm + "-" + dd;
                            return ndt;
                        },
                        editable: true
                    }
                }
                else {
                    return {
                        dataField: key,
                        text: key,
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false
                    }
                }
            }
            );

            columnsArray.push({
                text: "ACTION",
                formatter: this.actionButton,
                editable: false,
                headerStyle: () => {
                    return { width: "6%" };
                },
            });

            return columnsArray
        }
        return [];
    };

    render() {
        return (
            <Container fluid className="app-container">
                <Card>
                    <Card.Header as="span">customer
                    <ButtonGroup size="sm" style={{ float: "right", marginBottom: "2px" }}>
                            <Button variant="success" size="sm" onClick={() => { this.addNewEmpltyRecord() }}><FaPlusCircle />  Add New</Button>
                            <Button variant="success" size="sm" onClick={() => { this.toggleFilter() }}><FaFilter />  Filter</Button>
                            <Button variant="success" size="sm" onClick={() => { this.saveAll() }}><FaSave />  Save All</Button>
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>

                        {
                            this.props.customer !== undefined && this.props.customer !== null &&
                                this.props.customer.data !== undefined && this.props.customer.data !== null ? (
                                    <div>
                                        <BootstrapTable
                                            keyField="CUST_ID"
                                            data={this.props.customer.data}
                                            columns={this.getTableColumn(this.props.customer.data[0])}
                                            striped
                                            bootstrap4
                                            hover
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.customer.data.length))}
                                            headerWrapperClasses="tbl-head"
                                            cellEdit={cellEditFactory({
                                                mode: 'click',
                                                blurToSave: true
                                            })}
                                        />
                                    </div>
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
    listCustomer: data => dispatch({ type: SET_CUSTOMER, payload: data }),
    addNewEmpltyRecord: data => dispatch({ type: SET_CUSTOMER, payload: data })
});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    configuration: state.config.configuration,
    customer: state.customer.customer
});

export default connect(mapStateToProps, mapDispatchToProps)(Customer);