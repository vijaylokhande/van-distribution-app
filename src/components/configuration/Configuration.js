import React, { Component } from 'react';
import { connect } from "react-redux";
import { getCall, postCall, deleteCall, putCall } from '../../service/RestClient';
import { IN_PROGRESS, SET_APP_CONFIGURATION } from '../../constants/ActionConstants';
import { LIST_APP_CONFIGURATION } from '../../constants/AppConstants';
import { pageinationOptions } from '../../util/tableUtil'
import { Container, Card, Button, ButtonGroup } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory , {Type} from 'react-bootstrap-table2-editor';
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
        configuration.data.unshift({
            PROPERTY_ID: null,
            PROPERTY_TYPE: null,
            PROPERTY_VALUE: null,
            ACTIVE_STATUS: false
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
            if (row.PROPERTY_ID === null || row.PROPERTY_ID === undefined || row.PROPERTY_ID === "") { // add new record
                var data = {};
                data["PROPERTY_TYPE"] = row.PROPERTY_TYPE;
                data["PROPERTY_VALUE"] = row.PROPERTY_VALUE;

                var _typeof= typeof row.ACTIVE_STATUS
                if(_typeof === "string"){
                    if(row.ACTIVE_STATUS==="true") {row.ACTIVE_STATUS=true;}
                    else  { row.ACTIVE_STATUS=false};
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

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
                data["PROPERTY_ID"] = row.PROPERTY_ID;
                data["PROPERTY_TYPE"] = row.PROPERTY_TYPE;
                data["PROPERTY_VALUE"] = row.PROPERTY_VALUE;

                var _typeof= typeof row.ACTIVE_STATUS
                if(_typeof === "string"){
                    if(row.ACTIVE_STATUS==="true") {row.ACTIVE_STATUS=true;}
                    else  { row.ACTIVE_STATUS=false};
                }
                data["ACTIVE_STATUS"] =  row.ACTIVE_STATUS;
                
                putCall(LIST_APP_CONFIGURATION.concat("/").concat(row.PROPERTY_ID), data).then(res => {
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
            if (row.PROPERTY_ID === null || row.PROPERTY_ID === undefined || row.PROPERTY_ID === "") { // delete from cache
                this.listConfiguration();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_APP_CONFIGURATION.concat("/").concat(row.PROPERTY_ID)).then(res => {
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
            
            keys=_.without(keys,"ACTIVE_STATUS");

            var columnsArray = keys.map(key => (
                this.state.toggleFilter ?
                    {
                        "dataField": key,
                        "text": key,
                        "sort": true,
                        filter: textFilter()
                    }
                    :
                    {
                        "dataField": key,
                        "text": key,
                        "sort": true
                    }

            ));

            columnsArray.push({
                dataField:"ACTIVE_STATUS",
                text: "ACTIVE_STATUS",
                editor: {
                    type: Type.SELECT,
                    options :[
                        {
                            value:true,
                            label:"true"
                        },
                        {
                            value:false,
                            label:"false"
                        }
                    ]
                }
            })

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
                            this.props.configuration !== undefined && this.props.configuration !== null &&
                                this.props.configuration.data !== undefined && this.props.configuration.data !== null ? (
                                    <div>
                                        <BootstrapTable
                                            keyField="PROPERTY_ID"
                                            data={this.props.configuration.data}
                                            columns={this.getTableColumn(this.props.configuration.data[0])}
                                            striped
                                            hover
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.configuration.data.length))}
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
    listConfiguration: data => dispatch({ type: SET_APP_CONFIGURATION, payload: data }),
    addNewEmpltyRecord: data => dispatch({ type: SET_APP_CONFIGURATION, payload: data })

});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    configuration: state.config.configuration
});

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);