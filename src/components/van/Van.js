import React, { Component } from 'react';
import { getCall, putCall, postCall, deleteCall } from '../../service/RestClient';
import { Container, Card, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_VAN } from '../../constants/AppConstants';
import { SET_VAN } from '../../constants/ActionConstants';

import { pageinationOptions } from '../../util/tableUtil'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import _ from 'underscore';

import { FaFilter, FaPlusCircle, FaSave, FaTrash } from 'react-icons/fa'

class Van extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            toggleFilter: false,
            columnHeader : {
                vanId: "ID",
                vanName : "NAME",
                vanNumber : "NUMBER",
                activeStatus : "STATUS"
            }
        };

        this.updateAndSave.bind(this);
        this.deleteAndSave.bind(this);
    }

    componentDidMount() {
        this.listVan();
    } 

    getConfiguration = (type) => {
        let array = _.filter(this.props.configuration.data, function (object) { return object.PROPERTY_TYPE === type; });
        return _.map(array, function (object) {
            return { value: object.PROPERTY_ID, label: object.PROPERTY_VALUE };
        });
    }

    listVan = () => {
        this.props.setInProgress(true);
        getCall(LIST_VAN).then(res => {
            if (res.status === 200) {
                this.props.listVan(res.data);
                console.log(this.props.van)
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


    addNewEmpltyRecord = () => {
        this.props.setInProgress(true);
        let vanData = this.props.van;
        vanData.data.unshift({            
            vanId: null,
            vanNumber: null,
            vanName: null,
            activeStatus: false              
        });
        this.props.addNewEmpltyRecord(vanData);
        this.props.setInProgress(false);
    }

    toggleFilter = () => {
        this.setState({ toggleFilter: !this.state.toggleFilter });
    };

    updateAndSave = (cell, row, rowIndex) => {
        this.props.setInProgress(true);
        if (row !== null && row !== undefined) {
            if (row.vanId === null || row.vanId === undefined || row.vanId === "") { // add new record
                let data = {};
                data["vanId"] = row.vanId;
                data["vanName"] = row.vanName;
                data["vanNumber"] = row.vanNumber;

                let _typeof = typeof row.activeStatus
                if (_typeof === "string") {
                    if (row.activeStatus === "true") { row.activeStatus = true; }
                    else { row.activeStatus = false };
                }
                data["activeStatus"] = row.activeStatus;

                postCall(LIST_VAN, data).then(res => {
                    if (res.status === 201) {
                        this.listVan();
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

                data["vanId"] = row.vanId;
                data["vanName"] = row.vanName;
                data["vanNumber"] = row.vanNumber;

                let _typeof = typeof row.activeStatus
                if (_typeof === "string") {
                    if (row.activeStatus === "true") { row.activeStatus = true; }
                    else { row.activeStatus = false };
                }
                data["activeStatus"] = row.activeStatus;

                putCall(LIST_VAN.concat("/").concat(row.vanId), data).then(res => {
                    if (res.status === 200) {
                        this.listVan();
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
            if (row.vanId === null || row.vanId === undefined || row.vanId === "") { // delete from cache
                this.listEmployee();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_VAN.concat("/").concat(row.vanId)).then(res => {
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
            let keys = Object.keys(data);
            let columnsArray = keys.map(key => {
                if (key === 'activeStatus') {
                    return {
                        dataField: key,
                        text: this.state.columnHeader[key],
                        sort: true,
                        type: 'bool',
                        editor: {
                            type: Type.CHECKBOX,
                            value: 'true:false'
                        },
                        formatter: (cell) => {
                            return cell ? (<Badge variant="success">Active</Badge>) : (<Badge variant="danger">InActive</Badge>)
                        },
                        filter: this.state.toggleFilter ? textFilter() : false
                    };
                }
                else {
                    return {
                        dataField: key,
                        text: this.state.columnHeader[key],
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
                    return { width: "8%" };
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
                    <Card.Header as="span">Van
                        <ButtonGroup size="sm" style={{ float: "right", marginBottom: "2px" }}>
                            <Button variant="success" size="sm" onClick={() => { this.addNewEmpltyRecord() }}><FaPlusCircle />  Add New</Button>
                            <Button variant="success" size="sm" onClick={() => { this.toggleFilter() }}><FaFilter />  Filter</Button>
                            <Button variant="success" size="sm" onClick={() => { this.saveAll() }}><FaSave />  Save All</Button>
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>
                        { this.props.van !== undefined && this.props.van !== null  && this.props.van.length > 0? (
                                    <div>
                                        <BootstrapTable
                                            keyField="vanId"
                                            data={this.props.van}
                                            columns={this.getTableColumn(this.props.van[0])}
                                            striped
                                            bootstrap4
                                            hover
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.van.length))}
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
    listVan: data => dispatch({ type: SET_VAN, payload: data }),
    addNewEmpltyRecord: data => dispatch({ type: SET_VAN, payload: data })
});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    van: state.van.van
});

export default connect(mapStateToProps, mapDispatchToProps)(Van);