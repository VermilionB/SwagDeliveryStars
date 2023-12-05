import {Text, Container, ActionIcon, Group, rem, Stack, Image} from '@mantine/core';
import {IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconBrandTelegram} from '@tabler/icons-react';
import React from "react";
import logo from '../images/sdstars.svg'

const data = [
    {
        title: 'About',
        links: [
            {label: 'Features', link: '#'},
            {label: 'Pricing', link: '#'},
            {label: 'Support', link: '#'},
            {label: 'Forums', link: '#'},
        ],
    },
    {
        title: 'Project',
        links: [
            {label: 'Contribute', link: '#'},
            {label: 'Media assets', link: '#'},
            {label: 'Changelog', link: '#'},
            {label: 'Releases', link: '#'},
        ],
    },
    {
        title: 'Community',
        links: [
            {label: 'Join Discord', link: '#'},
            {label: 'Follow on Twitter', link: '#'},
            {label: 'Email newsletter', link: '#'},
            {label: 'Telegram chat', link: '#'},
        ],
    },
];

const Footer = () => {
    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text<'a'>
                key={index}
                className="footer-link"
                component="a"
                href={link.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        ));

        return (
            <div className="wrapper" key={group.title}>
                <Text className="footer-section-title">{group.title}</Text>
                {links}
            </div>
        );
    });

    return (
        <Container fluid style={{margin: '0'}}>
            <div style={{
                backgroundImage: 'linear-gradient(to right, teal , indigo)',
                height: '3px',
                marginBottom: '30px'
            }}></div>
            <Container size="xl">
                    <Group justify="space-between">
                        <Stack className="footer-description">
                            <Group>
                                <Image src={logo} h={100}
                                       w="auto"
                                       fit="contain"/>
                                {/*<Text*/}
                                {/*    size="xl"*/}
                                {/*    fw={900}*/}
                                {/*    style={{marginRight: 'auto'}}*/}
                                {/*>*/}
                                {/*    $wag Delivery Stars*/}
                                {/*</Text>*/}
                            </Group>
                           <Text>
                               The place to change your life
                           </Text>
                        </Stack>
                        <Group justify="space-between">
                            {groups}
                        </Group>
                    </Group>
            </Container>
            <Container size="xl" className="afterFooter">
                <Text c="dimmed" size="sm">

                    © 2023 Swag Delivery Stars. All rights reserved.
                </Text>

                <Group gap={0} justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandTelegram stroke={1.5}/>
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandTwitter stroke={1.5}/>
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandYoutube stroke={1.5}/>
                    </ActionIcon>
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconBrandInstagram stroke={1.5}/>
                    </ActionIcon>
                </Group>
            </Container>
        </Container>
    );
}

export default Footer