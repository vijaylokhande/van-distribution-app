import React, { Component } from 'react';
import { getCall, putCall, postCall, deleteCall } from '../../service/RestClient';
import { Container, Card, Button, ButtonGroup , Badge } from 'react-bootstrap';
import { IN_PROGRESS , ROLE } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_EMPLOYEE } from '../../constants/AppConstants';
import { SET_EMPLOYEE } from '../../constants/ActionConstants';

import { pageinationOptions } from '../../util/tableUtil'
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
            toggleFilter: false,
            columnHeader : {
                empId :"ID",
                empName:"NAME",
                empContact:"CONTACT",
                empAddress:"ADDRESS",
                designationId:"DESIGNATION",
                empWarehouseId:"WAREHOUSE",
                idProofType:"IDPROOF",
                idProofDetails:"IDPROOF DETAILS",
                empDob:"DOB",
                activeStatus:"STATUS"
            }
        };

        this.updateAndSave.bind(this);
        this.deleteAndSave.bind(this);
    }

    componentDidMount() {
        this.listEmployee();
    }

    listEmployee = () => {
        this.props.setInProgress(true);
        getCall(LIST_EMPLOYEE,this.props.loginUser.token).then(res => {
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
        let array = _.filter(this.props.configuration, function (object) { return object.propertyType === type; });
        return _.map(array, function (object) {
           return { value: object.propertyId, label: object.propertyValue};
        });
    }

    addNewEmpltyRecord = () => {

        this.props.setInProgress(true);
        let employeeData = this.props.employee;
        employeeData.unshift({
            empId: null,
            empName: null,
            empContact: null,
            empAddress: null,
            designationId: null,
            empWarehouseId: null,
            idProofType: null,
            idProofDetails: null,
            empDob: Date.now(),
            activeStatus: false
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
            if (row.empId === null || row.empId === undefined || row.empId === "") { // add new record
                let data = {};
                data["empId"] = row.empId;
                data["empName"] = row.empName;
                data["empContact"] = row.empContact;
                data["empAddress"] = row.empAddress;
                data["idProofType"] = row.idProofType;
                data["idProofDetails"] = row.idProofDetails;
                data["empDob"] = row.empDob;
                data["designationId"] = row.designationId;
                data["empWarehouseId"] = row.empWarehouseId;

                let _typeof = typeof row.activeStatus
                if (_typeof === "string") {
                    if (row.activeStatus === "true") { row.activeStatus = true; }
                    else { row.activeStatus = false };
                }
                data["activeStatus"] = row.activeStatus;

                postCall(LIST_EMPLOYEE, data,this.props.loginUser.token).then(res => {
                    if (res.status === 201 || res.status === 200) {
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
                let data = {};

                data["empId"] = row.empId;
                data["empName"] = row.empName;
                data["empContact"] = row.empContact;
                data["empAddress"] = row.empAddress;
                data["idProofType"] = row.idProofType;
                data["idProofDetails"] = row.idProofDetails;
                data["empDob"] = row.empDob;
                data["designationId"] = row.designationId;
                data["empWarehouseId"] = row.empWarehouseId;

                let _typeof = typeof row.activeStatus
                if (_typeof === "string") {
                    if (row.activeStatus === "true") { row.activeStatus = true; }
                    else { row.activeStatus = false };
                }
                data["activeStatus"] = row.activeStatus;

                putCall(LIST_EMPLOYEE.concat("/").concat(row.empId), data,this.props.loginUser.token).then(res => {
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
            if (row.empId === null || row.empId === undefined || row.empId === "") { // delete from cache
                this.props.setInProgress(true);
                this.listEmployee();
                this.props.setInProgress(false);
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_EMPLOYEE.concat("/").concat(row.empId),this.props.loginUser.token).then(res => {
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
              { this.props.loginUser.EMP_ROLE === "admin"?  <Button variant="success" size="sm" onClick={() => { this.updateAndSave(cell, row, rowIndex) }}><FaSave /></Button>:null}
                <Button variant="danger" size="sm" onClick={() => { this.deleteAndSave(cell, row, rowIndex) }}><FaTrash /></Button>
            </ButtonGroup>
        )
    };

    getTableColumn = (data) => {
        if (data !== null && data !== undefined) {
            var keys = Object.keys(data);

            var columnsArray = keys.map(key => {
                if (key === 'idProofType' || key === 'designationId') {

                    var obj = {
                        dataField: key,
                        text: this.state.columnHeader[key],
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false,
                        editor: {
                            type: Type.SELECT
                        },                        
                        formatter : (cell)=>{  
                                                         
                            if(cell !== undefined && cell !==null && cell !==""){                          
                            
                            var option=_.find(obj.editor.options,function(opn){                                  
                                return opn.value===cell;                                
                            }); 

                            if(option!==undefined)           
                            return (option.label);
                            }
                        }
                    };

                    if (key === 'idProofType') {
                        obj.editor.options = this.getConfiguration("ID_PROOF");                        
                    }
                    else if (key === 'designationId') {
                        obj.editor.options = this.getConfiguration("EMPLOYEE_DESIGNATION");
                    }                    
                    return obj;
                }
                else if(key === 'activeStatus'){
                    return {
                    dataField: key,
                    text: this.state.columnHeader[key],
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
                else if (key === 'empDob') {
                    return {
                        dataField: key,
                        text: this.state.columnHeader[key],
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
                        text: this.state.columnHeader[key],
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false,
                        headerStyle: () => {
                            if(key==='empId')
                                return { width: "4%" };                            
                            else if(key==='activeStatus')
                                return { width: "6%" };                                
                            else
                                return { width: "10%" };                            
                        }
                    }
                }
            }
            );

            if(this.props.loginUser.EMP_ROLE === ROLE.ADMIN ){
                columnsArray.push({
                    text: "ACTION",
                    formatter: this.actionButton,
                    editable: false,
                    headerStyle: () => {
                        return { width: "7%" };
                    },
                });
            }


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
                    
                        { this.props.loginUser.EMP_ROLE === "admin"?<Button variant="success" size="sm" onClick={() => { this.addNewEmpltyRecord() }}><FaPlusCircle />  Add New</Button>:null}
                            <Button variant="success" size="sm" onClick={() => { this.toggleFilter() }}><FaFilter />  Filter</Button>
                        { this.props.loginUser.EMP_ROLE === "admin"?<Button variant="success" size="sm" onClick={() => { this.saveAll() }}><FaSave />  Save All</Button>:null}
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>

                        {
                            this.props.employee !== undefined && this.props.employee !== null && this.props.employee.length > 0 ? (
                                    <div>
                                        <BootstrapTable                                            
                                            keyField="empId"
                                            data={this.props.employee}
                                            columns={this.getTableColumn(this.props.employee[0])}
                                            striped
                                            bootstrap4
                                            hover
                                            responsive
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.employee.length))}
                                            headerWrapperClasses="tbl-head"
                                            cellEdit= {                                       
                                            cellEditFactory({
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
    employee: state.emp.employee,    
    loginUser:state.auth.loginUser
});

export default connect(mapStateToProps, mapDispatchToProps)(Employee);