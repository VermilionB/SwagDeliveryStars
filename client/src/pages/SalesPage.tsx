import React, {useContext, useEffect, useState} from 'react';
import {Container, Flex, Loader, Table} from "@mantine/core";
import {jwtDecode} from "jwt-decode";
import {getUserById, UserData} from "../http/usersAPI";
import {getOrdersByUser, getSalesByUser} from "../http/orderAPI";
import {Context} from "../index";

const SalesPage = () => {
    const {orders} = useContext(Context)
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {

            if (currentUser) {
                const data = await getSalesByUser(currentUser?.id)
                console.log(data)
                orders.setOrders(data)
                setLoading(false)
            }
        }
        fetchOrders()
        orders.orders.map(order => {
            console.log(order)
        })
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

    if (loading || !orders.orders.length) {
        return (
            <Flex
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: window.screen.height - 154,
                }}
            >
                <Loader color="blue" type="bars"/>
            </Flex>
        );
    }

    return (
        <Container size="xl" style={{paddingTop: '95px', display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Table stickyHeader stickyHeaderOffset={60} verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Consumer</Table.Th>
                        <Table.Th>Product</Table.Th>
                        <Table.Th>Purchase Date</Table.Th>
                        <Table.Th>License Type</Table.Th>
                        <Table.Th>Order Price</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {orders.orders.map(order => (
                        <Table.Tr key={order.id}>
                            <Table.Td>{order.id}</Table.Td>
                            <Table.Td>{order.users_order_history_consumer_idTousers.username}</Table.Td>
                            <Table.Td>{order.beats.name}</Table.Td>
                            <Table.Td>{order.purchase_date}</Table.Td>
                            <Table.Td>{order.licenses.license_types.license_type}</Table.Td>
                            <Table.Td>${order.licenses.price}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
};

export default SalesPage;