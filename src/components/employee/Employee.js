import React, { Component } from 'react';
import { getCall , putCall , postCall , deleteCall } from '../../service/RestClient';
import { Container, Card, Button, ButtonGroup } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_EMPLOYEE } from '../../constants/AppConstants';
import { SET_EMPLOYEE } from '../../constants/ActionConstants';

import { pageinationOptions, ACTIVE_STATUS_OPTIONS } from '../../util/tableUtil'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import _ from 'underscore';

import { FaFilter, FaPlusCircle, FaSave, FaTrash } from 'react-icons/fa'

class Employee extends Component {

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
        this.listEmployee();
    }

    listEmployee = () => {
        this.props.setInProgress(true);
        getCall(LIST_EMPLOYEE).then(res => {
            if (res.status === 200) {
                this.props.listEmployee(res.data);
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
            return { "value": object.PROPERTY_ID, "label": object.PROPERTY_VALUE };
        });

    }

    addNewEmpltyRecord = () => {

        this.props.setInProgress(true);
        var employeeData = this.props.employee;
        employeeData.data.unshift({
            EMP_ID: null,
            EMP_NAME: null,
            EMP_CONTACT: null,
            EMP_ADDRESS: null,
            DESIGNATION_ID: null,
            EMP_WAREHOUSE_ID: null,
            ID_PROOF_TYPE: null,
            ID_PROOF_DETAILS: null,
            EMP_DOB: null,
            ACTIVE_STATUS: false
        });
        this.props.addNewEmpltyRecord(employeeData);
        this.props.setInProgress(false);
    }

    toggleFilter = () => {
        this.setState({ toggleFilter: !this.state.toggleFilter });
    };

    updateAndSave = (cell, row, rowIndex) => {
        this.props.setInProgress(true);
        if (row !== null && row !== undefined) {
            if (row.EMP_ID === null || row.EMP_ID === undefined || row.EMP_ID === "") { // add new record
                var data = {};
                data["EMP_ID"] = row.EMP_ID;
                data["EMP_NAME"] = row.EMP_NAME;
                data["EMP_CONTACT"] = row.EMP_CONTACT;
                data["EMP_ADDRESS"] = row.EMP_ADDRESS;
                data["ID_PROOF_TYPE"] = parseInt(row.ID_PROOF_TYPE);
                data["ID_PROOF_DETAILS"] = row.ID_PROOF_DETAILS;
                data["EMP_DOB"] = row.EMP_DOB;
                data["DESIGNATION_ID"] = parseInt(row.DESIGNATION_ID);
                data["EMP_WAREHOUSE_ID"]=parseInt(row.EMP_WAREHOUSE_ID);

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                postCall(LIST_EMPLOYEE, data).then(res => {
                    if (res.status === 201) {
                        this.listEmployee();
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
                
                data["EMP_ID"] = row.EMP_ID;
                data["EMP_NAME"] = row.EMP_NAME;
                data["EMP_CONTACT"] = row.EMP_CONTACT;
                data["EMP_ADDRESS"] = row.EMP_ADDRESS;
                data["ID_PROOF_TYPE"] = parseInt(row.ID_PROOF_TYPE);
                data["ID_PROOF_DETAILS"] = row.ID_PROOF_DETAILS;
                data["EMP_DOB"] = row.EMP_DOB;
                data["DESIGNATION_ID"] = parseInt(row.DESIGNATION_ID);
                data["EMP_WAREHOUSE_ID"]=parseInt(row.EMP_WAREHOUSE_ID);

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                putCall(LIST_EMPLOYEE.concat("/").concat(row.EMP_ID), data).then(res => {
                    if (res.status === 200) {
                        this.listEmployee();
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
            if (row.EMP_ID === null || row.EMP_ID === undefined || row.EMP_ID === "") { // delete from cache
                
                this.listEmployee();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_EMPLOYEE.concat("/").concat(row.EMP_ID)).then(res => {
                    if (res.status === 200) {
                        this.listEmployee();
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
                if(key==='ID_PROOF_TYPE'){
                    
                    return {
                        dataField: "ID_PROOF_TYPE",
                        text: "ID_PROOF_TYPE",                        
                        sort: true,
                        editor: {
                            type: Type.SELECT,
                            options: this.getConfiguration("ID_PROOF")
                        },
                        filter: this.state.toggleFilter ? textFilter() : false
                    } 
                }
                if(key==='DESIGNATION_ID'){

                    return {
                        dataField: "DESIGNATION_ID",
                        text: "DESIGNATION_ID",                        
                        sort: true,
                        editor: {
                            type: Type.SELECT,
                            options: this.getConfiguration("EMPLOYEE_DESIGNATION")
                        },
                        filter: this.state.toggleFilter ? textFilter() : false
                    }
                } 
                if(key==='ACTIVE_STATUS'){
                    return {
                        dataField: "ACTIVE_STATUS",
                        text: "ACTIVE_STATUS",                        
                        sort: true,
                        editor: {
                            type: Type.SELECT,
                            options: ACTIVE_STATUS_OPTIONS
                        },
                        filter: this.state.toggleFilter ? textFilter() : false
                    }
                }
                else{                 
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
                editable: false
            });

            return columnsArray
        }
        return [];
    };

    render() {
        return (
            <Container fluid className="app-container">
                <Card>
                    <Card.Header as="span">Employee
                    <ButtonGroup size="sm" style={{ float: "right", marginBottom: "2px" }}>
                            <Button variant="success" size="sm" onClick={() => { this.addNewEmpltyRecord() }}><FaPlusCircle />  Add New</Button>
                            <Button variant="success" size="sm" onClick={() => { this.toggleFilter() }}><FaFilter />  Filter</Button>
                            <Button variant="success" size="sm" onClick={() => { this.saveAll() }}><FaSave />  Save All</Button>
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>

                        {
                            this.props.employee !== undefined && this.props.employee !== null &&
                                this.props.employee.data !== undefined && this.props.employee.data !== null ? (
                                    <div>
                                        <BootstrapTable
                                            keyField="PROPERTY_ID"
                                            data={this.props.employee.data}
                                            columns={this.getTableColumn(this.props.employee.data[0])}
                                            striped
                                            hover
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.employee.data.length))}
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
    listEmployee: data => dispatch({ type: SET_EMPLOYEE, payload: data }),
    addNewEmpltyRecord: data => dispatch({ type: SET_EMPLOYEE, payload: data })
});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    configuration: state.config.configuration,
    employee: state.emp.employee
});

export default connect(mapStateToProps, mapDispatchToProps)(Employee);