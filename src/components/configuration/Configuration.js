import React, { Component } from 'react';
import { connect } from "react-redux";
import { getCall, postCall, deleteCall, putCall } from '../../service/RestClient';
import { IN_PROGRESS, SET_APP_CONFIGURATION } from '../../constants/ActionConstants';
import { LIST_APP_CONFIGURATION } from '../../constants/AppConstants';
import { pageinationOptions, ACTIVE_STATUS_OPTIONS, PROPERTY_TYPES_OPTIONS } from '../../util/tableUtil'
import { Container, Card, Button, ButtonGroup ,Badge} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import _ from 'underscore';

import { FaFilter, FaPlusCircle, FaSave, FaTrash } from 'react-icons/fa'

class Configuration extends Component {

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

    addNewEmpltyRecord = () => {

        this.props.setInProgress(true);
        var configuration = this.props.configuration;
        configuration.unshift({
            propertyId: null,
            propertyType: null,
            propertyValue: null,
            activeStatus: false
        });
        this.props.addNewEmpltyRecord(configuration);
        this.props.setInProgress(false);
    }

    toggleFilter = () => {
        this.setState({ toggleFilter: !this.state.toggleFilter });
    };


    addNewRecord = () => {

    };


    saveAll = () => {

    };

    updateAndSave = (cell, row, rowIndex) => {
        this.props.setInProgress(true);
        if (row !== null && row !== undefined) {
            if (row.propertyId === null || row.propertyId === undefined || row.propertyId === "") { // add new record
                var data = {};
                data["propertyType"] = row.propertyType;
                data["propertyValue"] = row.propertyValue;

                var _typeof = typeof row.activeStatus
                if (_typeof === "string") {
                    if (row.activeStatus === "true") { row.activeStatus = true; }
                    else { row.activeStatus = false };
                }
                data["activeStatus"] = row.activeStatus;

                postCall(LIST_APP_CONFIGURATION, data).then(res => {
                    if (res.status === 201) {
                        this.listConfiguration();
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
                data["propertyId"] = row.propertyId;
                data["propertyType"] = row.propertyType;
                data["propertyValue"] = row.propertyValue;

                var _typeof = typeof row.activeStatus
                if (_typeof === "string") {
                    if (row.activeStatus === "true") { row.activeStatus = true; }
                    else { row.activeStatus = false };
                }
                data["activeStatus"] = row.activeStatus;

                putCall(LIST_APP_CONFIGURATION.concat("/").concat(row.propertyId), data).then(res => {
                    if (res.status === 200) {
                        this.listConfiguration();
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
            if (row.propertyId === null || row.propertyId === undefined || row.propertyId === "") { // delete from cache
                this.listConfiguration();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_APP_CONFIGURATION.concat("/").concat(row.propertyId)).then(res => {
                    if (res.status === 200) {
                        this.listConfiguration();
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

                if (key === 'activeStatus') {
                    return {
                        dataField: key,
                        text: "STATUS",
                        sort: true,
                        type: 'bool',
                        editor: {
                            type: Type.CHECKBOX,
                            value: 'true:false'
                        },
                        formatter: (cell) => {
                            return cell ? (<Badge variant="success">ACTIVE</Badge>) : (<Badge variant="danger">INACTIVE</Badge>)
                        },
                        filter: this.state.toggleFilter ? textFilter() : false
                    };
                }
                else if (key === 'propertyType') {
                    return {
                        dataField: "propertyType",
                        text: "PROPERTY TYPE",
                        sort: true,
                        editor: {
                            type: Type.SELECT,
                            options: PROPERTY_TYPES_OPTIONS
                        },
                        filter: this.state.toggleFilter ? textFilter() : false
                    };
                }
                else if(key === 'propertyId'){
                    return {
                        dataField: key,
                        text: "PROPERTY ID",
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false
                    };
                }
                else if(key === 'propertyValue'){
                    return {
                        dataField: key,
                        text: "PROPERTY VALUE",
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false
                    };
                }                
                else {
                    return {
                        dataField: key,
                        text: key,
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false
                    };
                }
            });

            columnsArray.push({
                text: "ACTION",
                formatter: this.actionButton,
                editable: false
            })
            return columnsArray
        }
        return [];
    };

    render() {
        return (
            <Container fluid className="app-container">
                <Card>
                    <Card.Header as="Row" >Configuration
                    <ButtonGroup size="sm" style={{ float: "right", marginBottom: "2px" }}>
                            <Button variant="success" size="sm" onClick={() => { this.addNewEmpltyRecord() }}><FaPlusCircle />  Add New</Button>
                            <Button variant="success" size="sm" onClick={() => { this.toggleFilter() }}><FaFilter />  Filter</Button>
                            <Button variant="success" size="sm" onClick={() => { this.saveAll() }}><FaSave />  Save All</Button>
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>
                        {
                            this.props.configuration !== undefined && this.props.configuration !== null && this.props.configuration.length > 0 ? (
                                    <div>
                                        <BootstrapTable
                                            keyField="propertyId"
                                            data={this.props.configuration}
                                            columns={this.getTableColumn(this.props.configuration[0])}
                                            striped
                                            hover
                                            condensed
                                            tabIndexCell
                                            bootstrap4
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.configuration.length))}
                                            headerWrapperClasses="tbl-head"
                                            cellEdit={cellEditFactory({
                                                mode: 'click',
                                                blurToSave: true
                                            })}
                                            defaultSorted
                                            
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
    listConfiguration: data => dispatch({ type: SET_APP_CONFIGURATION, payload: data }),
    addNewEmpltyRecord: data => dispatch({ type: SET_APP_CONFIGURATION, payload: data })

});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    configuration: state.config.configuration,
    loginUser:state.auth.loginUser
});

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);