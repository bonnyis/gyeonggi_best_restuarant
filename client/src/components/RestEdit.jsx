import React, { useState, useEffect } from 'react'
import {  Modal, ModalHeader, ModalBody, Container, Button, Form, FormGroup, Label, Input, Col } from 'reactstrap'
import DaumPostcodeEmbed from 'react-daum-postcode';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { Link } from 'react-router-dom';

const RestEdit = () => {
  //state 셋팅 
  const [ rEdit, setREdit ] = useState({
    title: '',
    titleFood: '',
    tel1:'',
    tel2:'',
    tel3:'',
    zipCode: '',
    address1:'',
    address2:'',
    radius:'',
    file: null,  
    fileName:''
  });  
  const [ isOpen, setIsOpen ] = useState(false);
  const [ sigun, setSigun ] = useState('');
  const [ oldAddress, setOldAddress ] = useState('');
  const [ latitude, setLatitude ] = useState('');
  const [ longitude, setLongitude ] = useState('');

  //match.params.id 는 match가 더이상 사용되지 않는다. react-router-dom의 userParams를 이용한다.
  const { id } = useParams();


   //데이터 가져와 연결
   useEffect(()=>{
      axios.get('/api/edit/'+id)
      .then(rs=>{
         let newREdit = {...rEdit};
         const row = rs.data[0];
         const [tel1, tel2, tel3] = row.tel.split("-");
         const [address1, address2] = row.address.split("||");
         newREdit['title'] = row.title;
         newREdit['titleFood'] = row.title_food;
         newREdit['tel1'] = tel1;
         newREdit['tel2'] = tel2;
         newREdit['tel3'] = tel3;
         newREdit['address1'] = address1;
         newREdit['address2'] = address2;
         newREdit['radius'] = row.radius;
         newREdit['zipCode'] = row.zip;
         setOldAddress(row.address_old);
         setLatitude(row.latitude);
         setLongitude(row.longitude);
         setREdit(newREdit);
      })
   })

  //다음 api
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let jibunAddress = data.jibunAddress;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

  //좌표 찾기
    // 주소-좌표 변환 객체를 생성합니다
     let geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
     geocoder.addressSearch(fullAddress, function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === window.kakao.maps.services.Status.OK) {
        let coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        setLatitude(coords.La);
        setLongitude(coords.Ma);
     }else{
        setLatitude('33.450701');
        setLongitude('126.570667');
     } 
});    



    const mysigun = fullAddress.split(' ');
    if(
         mysigun[0]==='서울'||
         mysigun[0]==='부산'||
         mysigun[0]==='대구'||
         mysigun[0]==='인천'||
         mysigun[0]==='광주'||
         mysigun[0]==='대전'||
         mysigun[0]==='울산'||
         mysigun[0]==='세종특별자치시'
    ){
       setSigun(mysigun[0]);
    }else{
       setSigun(mysigun[1]);
    }  
    
    let newREdit = {...rEdit};
    newREdit['zipCode'] = data.zonecode;
    newREdit['address1'] = fullAddress;
    setREdit(newREdit);
    setOldAddress(jibunAddress);
    setIsOpen(false);
  }
  //주소 검색창
  const handleClick = ()=>{
     setIsOpen(true);
  }

  const handleClose = ()=>{
     setIsOpen(false);
  }

  const handleInput = (e) => {
     let newREdit = {...rEdit}; //바로 수정이 불가능하니까 복제함.
     newREdit[e.target.name] = e.target.value;
     setREdit(newREdit);
     //console.log(rEdit.title, rEdit.titleFood);
  }

  const handleFile = (e)=>{
     const file = e.target.files[0];
     const filename = e.target.value;
     let newREdit = {...rEdit}; //바로 수정이 불가능하니까 복제함.
     newREdit['file'] = file;
     newREdit['fileName'] = filename;
     setREdit(newREdit);
  }

  const handleSubmit = (e) =>{
     e.preventDefault();
     const url ="/api/update/"+id;
     const formData = new FormData();
     formData.append('sigun', sigun);
     formData.append('title', rEdit.title);
     formData.append('tel', rEdit.tel1+"-"+rEdit.tel2+"-"+rEdit.tel3);
     formData.append('title_food', rEdit.titleFood);
     formData.append('zip', rEdit.zipCode);
     formData.append('address', rEdit.address1+' '+rEdit.address2);
     formData.append('oldAddress', oldAddress + ' ' + rEdit.address2);
     formData.append('latitude', latitude);
     formData.append('longitude', longitude);
     formData.append('radius', rEdit.radius);
     formData.append('files', rEdit.file);
     axios.post(url, formData, {
        headers: {
            'Content-Type':'multipart/form-data'
        }
     })
     .then((response) => {
        console.log('응답');
     })
     .catch((error)=>{
        console.log(error);
     })
  }

  return (
    <Container className="wirteBox">
        <h2 className="text-center my-5">{ id }번 상점 수정</h2>
    <Form onSubmit={handleSubmit}>
        <Input type="hidden" name="sigun" value={ sigun } />
        <Input type="hidden" name="address_old" value={ oldAddress } />
        <Input type="hidden" name="latitude" value={ latitude } />
        <Input type="hidden" name="longitude" value={ longitude } />
        <FormGroup row>
            <Label for="title" sm={2}>
               상점이름
            </Label>
            <Col sm={10}>
                <Input id="title" 
                       name="title" 
                       placeholder="상점이름" 
                       type="text" 
                       onChange={ handleInput }
                       value={ rEdit.title } />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="title_food" sm={2}>
               주요메뉴
            </Label>
            <Col sm={10}>
                <Input id="title_food" 
                       name="titleFood" 
                       placeholder="주요메뉴" 
                       onChange={ handleInput }  
                       type="text"
                       value={ rEdit.titleFood } />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label for="tel1" sm={2}>
               전화번호
            </Label>
            <Col sm={2}>
                <Input id="tel1" 
                       name="tel1" 
                       placeholder="전화번호" 
                       onChange={ handleInput }  
                       type="number"
                       value={ rEdit.tel1 } />
            </Col>
            <Col sm={2}>
                <Input id="tel2" 
                       name="tel2" 
                       onChange={ handleInput }  
                       type="number"
                       value={ rEdit.tel2 } />
            </Col>
            <Col sm={2}>
                <Input id="tel3" name="tel3" onChange={ handleInput }  
                       type="number" value={ rEdit.tel3 } />
            </Col>
            <Col sm={4}/>
        </FormGroup>
        <FormGroup row>
            <Label for="zip" sm={2}>우편번호</Label>
            <Col sm={3}>
                <Input name="zipCode" type="text" readOnly value={ rEdit.zipCode } />
            </Col>
            <Col sm={1}>
                <Button outline onClick={ handleClick }>주소검색</Button>
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label sm={2}>
               주소
            </Label>
            <Col sm={10}>
              <Input type="text" name="address1" readOnly value={ rEdit.address1 } />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Col sm={2}></Col>
            <Col sm={10}>
               <Input type="text" name="address2" 
                 placeholder="상세주소" 
                 onChange={ handleInput }
                 value={ rEdit.address2 } />  

            </Col>    
        </FormGroup>  
        <FormGroup row>
            <Label sm={2}>거리뷰</Label>
            <Col sm={3}>
               <Input type="number" name="radius" placeholder="거리뷰" 
                onChange={ handleInput } value={ rEdit.radius } /> 
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label sm={2}>이미지업로드</Label>
            <Col sm={10}>
               <Input type="file" name="file" placeholder="이미지업로드" 
                onChange={ handleFile }
                value={ rEdit.fileName }
               /> 
            </Col>
        </FormGroup>
        <FormGroup row className="my-5">
            <Col sm={3}></Col>
            <Col sm={3}><Link to='/'><Button color="danger" block outline>취소</Button></Link></Col>
            <Col sm={1}/>
            <Col sm={3}><Button type="submit" color="success" block outline>전송</Button></Col>
            <Col sm={2}></Col>
        </FormGroup>
    </Form>
    <Modal isOpen={ isOpen }>
        <ModalHeader  toggle={function noRefCheck(){}} onClick={ handleClose } />
        <ModalBody>
            <DaumPostcodeEmbed onComplete={handleComplete} />
        </ModalBody>
    </Modal>
    </Container>
  )
}

export default RestEdit