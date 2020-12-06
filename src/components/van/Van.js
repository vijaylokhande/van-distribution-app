import React, { Component } from 'react';
import { getCall, putCall, postCall, deleteCall } from '../../service/RestClient';
import { Container, Card, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_VAN } from '../../constants/AppConstants';
import { SET_VAN } from '../../constants/ActionConstants';

import { pageinationOptions, ACTIVE_STATUS_OPTIONS } from '../../util/tableUtil'
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
            toggleFilter: false
        };

        this.updateAndSave.bind(this);
        this.deleteAndSave.bind(this);
    }

    componentDidMount() {
        this.listVan();
    }

    getConfiguration = (type) => {
        var array = _.filter(this.props.configuration.data, function (object) { return object.PROPERTY_TYPE === type; });
        return _.map(array, function (object) {
            return { value: object.PROPERTY_ID, label: object.PROPERTY_VALUE };
        });
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


    addNewEmpltyRecord = () => {
        this.props.setInProgress(true);
        var vanData = this.props.van;
        vanData.data.unshift({
            VAN_ID: null,
            VAN_NUMBER: null,
            VAN_NAME: null,
            ACTIVE_STATUS: false
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
            if (row.VAN_ID === null || row.VAN_ID === undefined || row.VAN_ID === "") { // add new record
                var data = {};
                data["VAN_ID"] = row.VAN_ID;
                data["VAN_NAME"] = row.VAN_NAME;
                data["VAN_NUMBER"] = row.VAN_NUMBER;

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

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
                var data = {};

                data["VAN_ID"] = row.VAN_ID;
                data["VAN_NAME"] = row.VAN_NAME;
                data["VAN_NUMBER"] = row.VAN_NUMBER;

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                putCall(LIST_VAN.concat("/").concat(row.VAN_ID), data).then(res => {
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
            if (row.VAN_ID === null || row.VAN_ID === undefined || row.VAN_ID === "") { // delete from cache
                this.listEmployee();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_VAN.concat("/").concat(row.VAN_ID)).then(res => {
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
                if (key === 'ACTIVE_STATUS') {
                    return {
                        dataField: key,
                        text: key,
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
                        {
                            this.props.van !== undefined && this.props.van !== null &&
                                this.props.van.data !== undefined && this.props.van.data !== null ? (
                                    <div>
                                        <BootstrapTable
                                            keyField="VAN_ID"
                                            data={this.props.van.data}
                                            columns={this.getTableColumn(this.props.van.data[0])}
                                            striped
                                            bootstrap4
                                            hover
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.van.data.length))}
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