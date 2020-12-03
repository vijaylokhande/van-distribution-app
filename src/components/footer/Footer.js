
import React from 'react';
import {Row,Col,Navbar} from 'react-bootstrap';
const footer=()=>{
return (<footer className="footer">
    <Navbar fixed="bottom" bg="dark" variant="dark">
    <Row>
      <Col sm={12}>
       <span style={{textAlign:"center",color:"#fff"}}>VDMS | LeCom LLP - <span>&#169;</span> 2021</span>
     </Col>  
    </Row>
    </Navbar>
</footer>);
};

export default footer;

