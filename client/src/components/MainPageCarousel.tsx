import { Carousel } from '@mantine/carousel';
import {Image, rem} from '@mantine/core';
import savage from '../images/21savage.jpg'
import gucciMane from '../images/guccimane.jpg'
import metroBoomin from '../images/metroboomin.jpg'
import metroBoomin2 from '../images/metroboomin2.jpg'
import producer from '../images/producer1.jpg'
import under from '../images/under.jpg'
import youngThug from '../images/youngthug.jpg'
// @ts-ignore
import Autoplay from 'embla-carousel-autoplay';

import {useRef} from "react";
interface CardProps {
    image: string;
}

const data = [
    {image:savage},
    {image:gucciMane},
    {image:metroBoomin},
    {image:metroBoomin2},
    {image:producer},
    {image:under},
    {image:youngThug}
];

export default function MainPageCarousel() {
    const autoplay = useRef(Autoplay({ delay: 5000 }));

    const slides = data.map((item) => (
        <Carousel.Slide key={item.image}>
            <Image src={item.image} w="100%" h="100%"/>
        </Carousel.Slide>
    ));

    return (
        <Carousel
            height={500}
            style={{margin: '0', padding: '0'}}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            // slideSize={{ base: '50%', sm: '50%' }}
            // slideGap={{ base: rem(1), sm: 'xl' }}
            // align="start"
            // slidesToScroll={1}
        >
            {slides}
        </Carousel>
    )
}