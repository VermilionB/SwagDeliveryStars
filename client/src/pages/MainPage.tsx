import React from 'react';
import {Container} from "@mantine/core";
import MainPageCarousel from "../components/MainPageCarousel";


const MainPage = () => {
    return (
        <Container fluid style={{paddingTop: '95px', margin: '0', width: '100%'}}>
            <MainPageCarousel/>
        </Container>
    );
};

export default MainPage;