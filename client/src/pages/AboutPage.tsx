import React from 'react';
import {Card, Container, Image, Paper, SimpleGrid, Text, Title, TypographyStylesProvider} from "@mantine/core";
import aboutPic from '../images/about.jpg'

const AboutPage = () => {
    return (
        <Container size="xl" style={{
            paddingTop: '95px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Title c="indigo">
                About Swag Delivery Stars
            </Title>
            <SimpleGrid cols={2} mt="50px">
                <Image src={aboutPic} radius="lg"/>

                <TypographyStylesProvider pl={0}>
                    <Text fw={600} size="xl">We are a young multi-genre association of talented producers of $wag
                        Delivery.
                        Here you will find a lot of high-quality beats in the style of your favorite artists and you
                        will
                        always keep up with the times of the music industry.</Text>
                </TypographyStylesProvider>
            </SimpleGrid>
        </Container>
    );
};

export default AboutPage;