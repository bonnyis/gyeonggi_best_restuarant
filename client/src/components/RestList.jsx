import React, { useState, useEffect } from 'react'
import { Container, ListGroup } from 'reactstrap'
import { Outlet, Link } from 'react-router-dom'
import RestListItem from './RestListItem'
import axios from 'axios'

const RestList = () => {
  const [rest, setRest] = useState([]);

  useEffect(()=>{
      axios.post('/api')
      .then(rs => setRest(...rest, rs.data))
      .then(rs=>console.log(rs.data))
      // .catch(console.log('오류'))
  }, []);
    
  return (
    <Container>
        <h1 className="text-center my-5"> 경기도 맛집 리스트 </h1>
        <div className="text-right mb-2">
           <Link to="/write" className="write">글쓰기</Link>
           <Outlet />
        </div>
        <ListGroup>
            {
               rest.map( c => (
                <RestListItem 
                key={c.id}
                id={c.id}
                sigun={c.city}
                title={c.name}
                tel={c.telNum}
                title_food={c.titleName}    
                zip={c.postNum}
                address={c.rideaddress}
                address_old={c.postaddress}
                latitude={c.latitude}
                longitude={c.longitude}
                />   
               ))    
            }
      
        </ListGroup>
    </Container>
  )
}

export default RestList