import React, { useState } from 'react'
import {  Modal, ModalHeader, ModalBody, Container, Button, Form, FormGroup, Label, Input, Col } from 'reactstrap'
import DaumPostcodeEmbed from 'react-daum-postcode';
import axios from 'axios'
import { Link } from 'react-router-dom';

const RestWrite = () => {
  //state 셋팅 
  const [ rWrite, setRWrite ] = useState({
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
        setLatitude(coords.Ma);
        setLongitude(coords.La);
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
    
    let newRWrite = {...rWrite};
    newRWrite['zipCode'] = data.zonecode;
    newRWrite['address1'] = fullAddress;
    setRWrite(newRWrite);
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
     let newRWrite = {...rWrite}; //바로 수정이 불가능하니까 복제함.
     newRWrite[e.target.name] = e.target.value;
     setRWrite(newRWrite);
     //console.log(rWrite.title, rWrite.titleFood);
  }

  const handleFile = (e)=>{
     const file = e.target.files[0];
     const filename = e.target.value;
     let newRWrite = {...rWrite}; //바로 수정이 불가능하니까 복제함.
     newRWrite['file'] = file;
     newRWrite['fileName'] = filename;
     setRWrite(newRWrite);
  }

  const handleSubmit = (e) =>{
     e.preventDefault();
     const url ="/api/write";
     const formData = new FormData();
     formData.append('sigun', sigun);
     formData.append('title', rWrite.title);
     formData.append('tel', rWrite.tel1+"-"+rWrite.tel2+"-"+rWrite.tel3);
     formData.append('title_food', rWrite.titleFood);
     formData.append('zip', rWrite.zipCode);
     formData.append('address', rWrite.address1+'||'+rWrite.address2);
     formData.append('oldAddress', oldAddress+'||'+rWrite.address2);
     formData.append('latitude', latitude);
     formData.append('longitude', longitude);
     formData.append('radius', rWrite.radius);
     formData.append('files', rWrite.file);
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
        <h2 className="text-center my-5">새로운 상점 등록</h2>
    <Form onSubmit={handleSubmit}>
        {/* <Input type="hidden" name="sigun" value={ sigun } />
        <Input type="hidden" name="address_old" value={ oldAddress } />
        <Input type="hidden" name="latitude" value={ latitude } />
        <Input type="hidden" name="longitude" value={ longitude } /> */}
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
                       value={ rWrite.title } />
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
                       value={ rWrite.titleFood } />
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
                       value={ rWrite.tel1 } />
            </Col>
            <Col sm={2}>
                <Input id="tel2" 
                       name="tel2" 
                       onChange={ handleInput }  
                       type="number"
                       value={ rWrite.tel2 } />
            </Col>
            <Col sm={2}>
                <Input id="tel3" name="tel3" onChange={ handleInput }  
                       type="number" value={ rWrite.tel3 } />
            </Col>
            <Col sm={4}/>
        </FormGroup>
        <FormGroup row>
            <Label for="zip" sm={2}>우편번호</Label>
            <Col sm={3}>
                <Input name="zipCode" type="text" readOnly value={ rWrite.zipCode } />
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
              <Input type="text" name="address1" readOnly value={ rWrite.address1 } />
            </Col>
        </FormGroup>
        <FormGroup row>
            <Col sm={2}></Col>
            <Col sm={10}>
               <Input type="text" name="address2" 
                 placeholder="상세주소" 
                 onChange={ handleInput }
                 value={ rWrite.address2 } />  

            </Col>    
        </FormGroup>  
        <FormGroup row>
            <Label sm={2}>거리뷰</Label>
            <Col sm={3}>
               <Input type="number" name="radius" placeholder="거리뷰" 
                onChange={ handleInput } value={ rWrite.radius } /> 
            </Col>
        </FormGroup>
        <FormGroup row>
            <Label sm={2}>이미지업로드</Label>
            <Col sm={10}>
               <Input type="file" name="file" placeholder="이미지업로드" 
                onChange={ handleFile }
                value={ rWrite.fileName }
               /> 
            </Col>
        </FormGroup>
        <FormGroup row className="my-5">
            <Col sm={3}></Col>
          <Col sm={3}>  <Link to='/'><Button color="danger" block outline>취소</Button></Link></Col>
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

export default RestWrite