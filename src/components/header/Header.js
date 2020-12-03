import React from 'react';
import {Col , Navbar,NavDropdown,Nav} from 'react-bootstrap';

const header=()=>{
return(<header className="header">    

<Navbar >
 
  <Col sm={10} style={{textAlign:"left"}}>
  <Navbar.Brand href="#home">WMS</Navbar.Brand> 
  </Col>
  <Col sm={2} style={{textAlign:"right"}}>
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <NavDropdown title="User" id="basic-nav-dropdown">
        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>       
      </NavDropdown>
    </Nav>   
  </Navbar.Collapse>
  </Col>  
</Navbar>         
</header>);
};
export default header;