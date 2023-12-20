import React, {useContext, useEffect, useState} from 'react';
import {Card, Container, Group, Paper, SimpleGrid, Text, ThemeIcon} from "@mantine/core";
import {jwtDecode} from "jwt-decode";
import {getUserById, UserData} from "../../http/usersAPI";
import CountUp from "react-countup";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {getSalesByUser} from "../../http/orderAPI";
import {IconArrowUpRight} from "@tabler/icons-react";

const MyStatsPage = observer(() => {
    const {orders} = useContext(Context)

    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});

    useEffect(() => {
        const fetchOrders = async () => {

            if (currentUser) {
                const data = await getSalesByUser(currentUser?.user.id)
                orders.setOrders(data)
            }
        }
        fetchOrders()
    }, [currentUser]);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setUserToken(jwtDecode(storedToken));
            } else {
                setUserToken({});
            }
        } catch (err) {
            console.error('Error decoding token:', err);
        }
    }, []);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setUserToken(jwtDecode(storedToken));
            } else {
                setUserToken({});
            }
        } catch (err) {
            console.error('Error decoding token:', err);
        }
    }, [localStorage.getItem('token')]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (userToken.id) {
                    const data = await getUserById(userToken.id);
                    setCurrentUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser()
    }, [userToken]);

    return (
        <Container size="xl" style={{
            paddingTop: '95px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {currentUser && (
                <Card style={{flexDirection: 'row', minWidth: '400px', justifyContent: 'center'}}>
                    <SimpleGrid cols={{base: 1, sm: 2}}>
                        <Paper withBorder p="md" radius="md">
                            <Group justify="apart">
                                <div>
                                    <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                                        Total Plays
                                    </Text>
                                    <Text fw={700} fz="xl">
                                        <CountUp duration={4} end={currentUser.totalPlays}/>
                                    </Text>
                                </div>
                                <ThemeIcon
                                    color="gray"
                                    variant="light"
                                    style={{
                                        color: 'teal',
                                    }}
                                    size={38}
                                    radius="md"
                                >
                                    <IconArrowUpRight size="1.8rem" stroke={1.5}/>
                                </ThemeIcon>
                            </Group>
                            <Text c="dimmed" fz="sm" mt="md">
                                Your total plays for all beats
                            </Text>
                        </Paper>
                        <Paper withBorder p="md" radius="md">
                            <Group justify="apart">
                                <div>
                                    <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                                        Total Sales
                                    </Text>
                                    <Text fw={700} fz="xl">
                                        <CountUp duration={4} end={orders.orders.length}/>
                                    </Text>
                                </div>
                                <ThemeIcon
                                    color="gray"
                                    variant="light"
                                    style={{
                                        color: 'teal',
                                    }}
                                    size={38}
                                    radius="md"
                                >
                                    <IconArrowUpRight size="1.8rem" stroke={1.5}/>
                                </ThemeIcon>
                            </Group>
                            <Text c="dimmed" fz="sm" mt="md">
                                Your total sales for all beats
                            </Text>
                        </Paper>
                    </SimpleGrid>
                </Card>


            )}
        </Container>
    );
});

export default MyStatsPage;