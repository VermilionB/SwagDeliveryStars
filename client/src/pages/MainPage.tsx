import React from 'react';
import {Container, Title} from "@mantine/core";
import MainPageCarousel from "../components/MainPageCarousel";


const MainPage = () => {
    return (
        <Container fluid style={{paddingTop: '95px', paddingRight: 0, paddingLeft: 0, margin: '0', width: '100%'}}>
            <Title w="100%" style={{textAlign: 'center'}} order={1} mb={40}>Welcome to Producer World</Title>
            <MainPageCarousel/>
        </Container>
    );
};

export default MainPage;