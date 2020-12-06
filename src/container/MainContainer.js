import React,{Component} from 'react';
import {Container,Row} from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom'
import Warehouse from '../components/warehouse/Warehouse';
import Employee from '../components/employee/Employee';
import Van from '../components/van/Van';
import Product from '../components/product/Product';
import Customer from '../components/customer/Customer';
import Configuration from '../components/configuration/Configuration';

class MainContainer extends Component{

    render() {
        return (          
          <Container fluid >      
          <Row>
            <Switch>
                <Route path = "/admin/warehouse" component = {Warehouse} />                
                <Route path = "/admin/employee" component = {Employee} />   
                <Route path = "/admin/van" component = {Van} />   
                <Route path = "/admin/config" component = {Configuration} />   
                <Route path = "/admin/warehouse" component = {Warehouse} />    
                <Route path = "/master/product" component = {Product} />  
                <Route path = "/master/customer" component = {Customer} />  
            </Switch>
          </Row> 
        </Container>
        );
      }
}
export default MainContainer;