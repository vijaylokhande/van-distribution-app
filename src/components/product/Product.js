import React, { Component } from 'react';
import { getCall, putCall, postCall, deleteCall } from '../../service/RestClient';
import { Container, Card, Button, ButtonGroup , Badge } from 'react-bootstrap';
import { IN_PROGRESS } from '../../constants/ActionConstants';
import { connect } from "react-redux";
import { LIST_PRODUCT } from '../../constants/AppConstants';
import { SET_PRODUCT } from '../../constants/ActionConstants';

import { pageinationOptions, ACTIVE_STATUS_OPTIONS } from '../../util/tableUtil'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import _ from 'underscore';

import { FaFilter, FaPlusCircle, FaSave, FaTrash } from 'react-icons/fa'

class Product extends Component {

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
        this.listProduct();
    }

    listProduct = () => {
        this.props.setInProgress(true);
        getCall(LIST_PRODUCT).then(res => {
            if (res.status === 200) {
                this.props.listProduct(res.data);
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
        var productData = this.props.product;
        productData.data.unshift({
            PRODUCT_ID : null,
            PRODUCT_CODE : null,
            PRODUCT_NAME : null,
            HSN_CODE : null,
            PRODUCT_DESC : null,
            PROD_COMPANY_ID: null,
            PROD_UNIT_ID : null,
            PROD_UNIT_QUANTITY : null,
            PRODUCT_MRP: null,
            PROD_CGST_PER: null,
            PROD_SGST_PER: null,
            PRODUCT_RATE: null,
            ACTIVE_STATUS: false
        });
        this.props.addNewEmpltyRecord(productData);
        this.props.setInProgress(false);
    }

    toggleFilter = () => {
        this.setState({ toggleFilter: !this.state.toggleFilter });
    };

    updateAndSave = (cell, row, rowIndex) => {
        this.props.setInProgress(true);
        if (row !== null && row !== undefined) {
            if (row.PRODUCT_ID === null || row.PRODUCT_ID === undefined || row.PRODUCT_ID === "") { // add new record
                var data = {};        

                data["PRODUCT_ID"] = row.PRODUCT_ID;
                data["PRODUCT_CODE"] = row.PRODUCT_CODE;
                data["PRODUCT_NAME"] = row.PRODUCT_NAME;
                data["HSN_CODE"] = row.HSN_CODE;
                data["PRODUCT_DESC"] = row.PRODUCT_DESC;
                data["PROD_COMPANY_ID"] = row.PROD_COMPANY_ID;
                data["PROD_UNIT_ID"] = row.PROD_UNIT_ID;
                data["PROD_UNIT_QUANTITY"] = parseInt(row.PROD_UNIT_QUANTITY);
                data["PRODUCT_MRP"] = parseFloat(row.PRODUCT_MRP);
                data["PROD_CGST_PER"] = parseFloat(row.PROD_CGST_PER);
                data["PROD_SGST_PER"] = parseFloat(row.PROD_SGST_PER);
                data["PRODUCT_RATE"] = row.PRODUCT_RATE;
                data["ACTIVE_STATUS"] = false;

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                postCall(LIST_PRODUCT, data).then(res => {
                    if (res.status === 201) {
                        this.listProduct();
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

                data["PRODUCT_ID"] = row.PRODUCT_ID;
                data["PRODUCT_CODE"] = row.PRODUCT_CODE;
                data["PRODUCT_NAME"] = row.PRODUCT_NAME;
                data["HSN_CODE"] = row.HSN_CODE;
                data["PRODUCT_DESC"] = row.PRODUCT_DESC;
                data["PROD_COMPANY_ID"] = row.PROD_COMPANY_ID;
                data["PROD_UNIT_ID"] = row.PROD_UNIT_ID;
                data["PROD_UNIT_QUANTITY"] = parseInt(row.PROD_UNIT_QUANTITY);
                data["PRODUCT_MRP"] = parseFloat(row.PRODUCT_MRP);
                data["PROD_CGST_PER"] = parseFloat(row.PROD_CGST_PER);
                data["PROD_SGST_PER"] = parseFloat(row.PROD_SGST_PER);
                data["PRODUCT_RATE"] = [];
                data["ACTIVE_STATUS"] = false;

                var _typeof = typeof row.ACTIVE_STATUS
                if (_typeof === "string") {
                    if (row.ACTIVE_STATUS === "true") { row.ACTIVE_STATUS = true; }
                    else { row.ACTIVE_STATUS = false };
                }
                data["ACTIVE_STATUS"] = row.ACTIVE_STATUS;

                putCall(LIST_PRODUCT.concat("/").concat(row.EMP_ID), data).then(res => {
                    if (res.status === 200) {
                        this.listProduct();
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
                this.listProduct();
            }
            else {  // delete from db                
                this.props.setInProgress(true);
                deleteCall(LIST_PRODUCT.concat("/").concat(row.PRODUCT_ID)).then(res => {
                    if (res.status === 200) {
                        this.listProduct();
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
                if (key === 'PROD_UNIT_ID' || key === 'PROD_COMPANY_ID') {

                    var obj = {
                        dataField: key,
                        text: key=='PROD_UNIT_ID'? 'UNIT' : 'COMPANY',
                        sort: true,
                        filter: this.state.toggleFilter ? textFilter() : false,
                        editor: {
                            type: Type.SELECT
                        },                        
                        formatter : (cell)=>{  
                                                         
                            if(cell !== undefined && cell !==null && cell !==""){                          
                            
                            var option=_.find(obj.editor.options,function(opn){                                  
                                return opn.value==cell;                                
                            }); 

                            if(option!==undefined)           
                            return (option.label);
                            }
                        }
                    };

                    if (key === 'PROD_UNIT_ID') {
                        obj.editor.options = this.getConfiguration("UNIT");                        
                    }
                    else if (key === 'PROD_COMPANY_ID') {
                        obj.editor.options = this.getConfiguration("COMPANY");
                    }                    
                    return obj;
                }
                else if(key === 'ACTIVE_STATUS'){
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
                else if(key === 'PRODUCT_RATE'){
                    return {
                    dataField: key,
                    text: key,
                    sort: true,                    
                    
                    formatter : (cell)=>{ 
                        
                    //    var html= _.map(cell,function(item){
                    //     return(<div>
                    //             <input value={item.RATE}/>
                    //             <input value={item.PRICE}/>
                    //            </div>)
                    //     })                  
                        
                    //      return html;

                     return JSON.stringify(cell)
                    },                    
                    filter: this.state.toggleFilter ? textFilter() : false,
                    editor:{
                        type:Type.TEXTAREA
                    },
                    editable:false
                    

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
                    <Card.Header as="span">Product
                    <ButtonGroup size="sm" style={{ float: "right", marginBottom: "2px" }}>
                            <Button variant="success" size="sm" onClick={() => { this.addNewEmpltyRecord() }}><FaPlusCircle />  Add New</Button>
                            <Button variant="success" size="sm" onClick={() => { this.toggleFilter() }}><FaFilter />  Filter</Button>
                            <Button variant="success" size="sm" onClick={() => { this.saveAll() }}><FaSave />  Save All</Button>
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>

                        {
                            this.props.product !== undefined && this.props.product !== null &&
                                this.props.product.data !== undefined && this.props.product.data !== null ? (
                                    <div>
                                        <BootstrapTable
                                            keyField="PRODUCT_ID"
                                            data={this.props.product.data}
                                            columns={this.getTableColumn(this.props.product.data[0])}
                                            striped
                                            bootstrap4
                                            hover
                                            condensed
                                            tabIndexCell
                                            filter={filterFactory()}
                                            pagination={paginationFactory(pageinationOptions(this.props.product.data.length))}
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
    listProduct: data => dispatch({ type: SET_PRODUCT, payload: data }),
    addNewEmpltyRecord: data => dispatch({ type: SET_PRODUCT, payload: data })
});

const mapStateToProps = (state) => ({
    inProgress: state.config.inProgress,
    configuration: state.config.configuration,
    product: state.product.product
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);