import React, { useState, useEffect } from 'react'
import { Roadview , Map} from 'react-kakao-maps-sdk'
import {ListGroupItem, Row, Col } from 'reactstrap'
import { Restaurant , MyLocation, Call, MenuBook,  MapsHomeWork } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom'

const RestListItem = (props) => {

  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  useEffect(()=>{
     setLat(props.latitude);
     setLon(props.longitude);

  }, [])  

  return (
    <ListGroupItem className="py-4 px-4">
    <Row>
        <Col xs="4">
           <Roadview 
                position={{
                    lat: lat,
                    lng: lon,
                    radius : 50
                }}
            
                style={{
                    width: "100%",
                    height: "250px",
                    borderRadius: "15px",
                    border: "2px solid #333"
                }}
               radius ={10}
            />    
        </Col>
        <Col xs="5">
            <h2 className=''><Restaurant color="secondary" />{props.title}<Link to="/edit" className='d-flex just-content-end'><EditIcon /></Link></h2>
             <p><MyLocation color="primary" /> {props.sigun}</p>
             <p><Call/> {props.tel}</p>
             <p><MenuBook/> {props.title_food}</p>
            <p><MapsHomeWork/> ({props.zip}) {props.address} 
                <br /> {props.address_old}</p>
        </Col>
        <Col xs="3">
            <Map 
               center={{
                   lat: lat,
                   lng: lon
               }}
               style={{
                   width:"250px",
                   height:"200px",
                   border: "1px solid #ddd"
               }}
               level={3}
            />   
            
        </Col>
    </Row>

</ListGroupItem> 
  )
}

export default RestListItem