import React,{Component} from 'react';
import {Navbar,NavDropdown,Nav} from 'react-bootstrap';
import {Link} from "react-router-dom";
class Menu extends Component{

    render() {
        return (
          <div>      
          <Navbar bg="dark" variant="dark" className="menu-header">
            <Nav className="mr-auto">
            
            <NavDropdown title="Admin" id="admin-menu">
              <NavDropdown.Item ><Link to="/admin/warehouse">Warehouse</Link></NavDropdown.Item>
              <NavDropdown.Item ><Link to="/admin/employee">Employee</Link></NavDropdown.Item>
              <NavDropdown.Item ><Link to="/admin/van">Van</Link></NavDropdown.Item>
              <NavDropdown.Item ><Link to="/admin/config">Configuration</Link></NavDropdown.Item>              
              <NavDropdown.Item ><Link to="/admin/day_in_out">Day In/Out</Link></NavDropdown.Item>
              <NavDropdown.Item ><Link to="/admin/backup">Backup</Link></NavDropdown.Item>
            </NavDropdown>

            
            <NavDropdown title="Master" id="master-menu">
              <NavDropdown.Item ><Link to="/master/product">Product</Link></NavDropdown.Item>
              <NavDropdown.Item ><Link to="/master/customer">Customer</Link></NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Inventory" id="Inventory-menu">              
              <NavDropdown.Item ><Link to="/inventory/master">Inventory</Link></NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Shipment" id="shipment-menu">              
              <NavDropdown.Item ><Link to="/shipment/master">Shipment Master</Link></NavDropdown.Item>              
            </NavDropdown>

            <NavDropdown title="Mobile Sync" id="mobile-sync-menu">          
              <NavDropdown.Item ><Link to="/mobile/master">Mobile Master</Link></NavDropdown.Item>  
              <NavDropdown.Item ><Link to="/mobile/data-pull">Mobile Pull</Link></NavDropdown.Item>              
              <NavDropdown.Item ><Link to="/mobile/data-push">Mobile Push</Link></NavDropdown.Item>              
            </NavDropdown>

            
            </Nav>          
          </Navbar>
          </div>
        );
      }
}
export default Menu;