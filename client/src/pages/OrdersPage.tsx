import React, {useContext, useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Group,
    Image,
    Loader,
    Modal,
    Stack,
    Table,
    Text, Title
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {jwtDecode} from "jwt-decode";
import {fetchAvatarFile, getUserById, UserData} from "../http/usersAPI";
import {getOrdersByUser} from "../http/orderAPI";
import {Context} from "../index";
import {IconDots} from "@tabler/icons-react";
import {OrderInterface} from "../store/orderStore";

interface OrderBeatInterface {
    id: string,
    name: string,
    producer_id: string,
    genre_id: string,
    beat_files_id: string,
    image_url: string,
    duration: number,
    description: string,
    bpm: number,
    key: number,
    tags: string[],
    is_free: boolean,
    is_available: boolean,
    genres: {
        id: string,
        genre: string
    },
    keys: {
        id: number,
        key: string
    },
    beat_files: {
        id: string,
        mp3_file: string,
        wav_file: string,
        zip_file: string
    }
}

const SellsPage = () => {
    const {orders} = useContext(Context)
    const [opened, {open, close}] = useDisclosure(false);

    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [beatImage, setBeatImage] = useState('');
    const [selectedBeat, setSelectedBeat] = useState<OrderBeatInterface | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(null);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [seller, setSeller] = useState('')
    const [loading, setLoading] = useState(true);

    const openDetailsModal = async (order: OrderInterface) => {
        const beat = order.beats
        setSelectedOrder(order)
        setSelectedBeat({...beat});
        setBeatImage(beat.image_url);
        setSeller(order.users_order_history_seller_idTousers.username)
        open();
    }

    useEffect(() => {
        const fetchData = async () => {
            if (selectedBeat) {
                try {
                    const imgPromise = fetchAvatarFile(selectedBeat.image_url);
                    // const audioPromise = fetchAvatarFile(selectedBeat.beat_files.mp3_file);

                    const [img] = await Promise.all([imgPromise]);

                    setBeatImage(img);

                } catch (error) {
                    console.error("Error fetching beat:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [selectedBeat]);

    useEffect(() => {
        const fetchOrders = async () => {

            if (currentUser) {
                const data = await getOrdersByUser(currentUser?.user.id)
                orders.setOrders(data)
                setLoading(false)
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

    const downloadFile = async (key: string, mime: string) => {
        const response = await fetchAvatarFile(key);
        fetch(response, {
            method: 'GET',

        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));

                const link = document.createElement('a');
                link.href = url;
                link.download = `${selectedBeat?.name}.${mime}`;

                document.body.appendChild(link);

                link.click();

                link.parentNode?.removeChild(link);
            });

    };


    if (loading) {
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
        <Container size="xl" style={{paddingTop: '95px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            {orders.orders.length ? (
                <>
                    <Modal opened={opened} onClose={close} title="Order details" centered miw="400px">
                        <Card>
                            <Group w="100%">
                                <Avatar src={beatImage} size="xl" radius="lg" w="30%"/>
                                <Group ml="10px">
                                    <Stack>
                                        <Text w="100%" fw={800}>{selectedBeat?.name}</Text>
                                        <Text c="dimmed">{seller}</Text>
                                    </Stack>
                                    <Stack>
                                        <Text>{selectedBeat?.genres.genre}</Text>
                                        <Text>{selectedBeat?.bpm} Bpm</Text>
                                    </Stack>
                                </Group>
                            </Group>
                            <Group mt="20px" gap="sm">
                                {selectedOrder?.licenses.license_types.includes_mp3 && selectedBeat && (
                                    <Button size="xs"
                                            onClick={() => downloadFile(selectedBeat?.beat_files.mp3_file, 'mp3')}>Download
                                        MP3</Button>
                                )}
                                {selectedOrder?.licenses.license_types.includes_wav && selectedBeat && (
                                    <Button size="xs"
                                            onClick={() => downloadFile(selectedBeat?.beat_files.wav_file, 'wav')}>Download
                                        WAV</Button>
                                )}
                                {selectedOrder?.licenses.license_types.includes_zip && selectedBeat && (
                                    <Button size="xs"
                                            onClick={() => downloadFile(selectedBeat?.beat_files.zip_file, 'zip')}>Download
                                        ZIP</Button>
                                )}
                            </Group>
                        </Card>
                    </Modal>
                    <Title order={2} mb={20} c="teal">My Orders</Title>
                    <Table stickyHeader stickyHeaderOffset={60} verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Seller</Table.Th>
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
                                    <Table.Td><Text lineClamp={1}>{order.users_order_history_seller_idTousers.username}</Text></Table.Td>
                                    <Table.Td><Text lineClamp={1}>{order.users_order_history_consumer_idTousers.username}</Text></Table.Td>
                                    <Table.Td><Text lineClamp={1}>{order.beats.name}</Text></Table.Td>
                                    <Table.Td>{order.purchase_date}</Table.Td>
                                    <Table.Td>{order.licenses.license_types.license_type}</Table.Td>
                                    <Table.Td>${order.licenses.price}</Table.Td>
                                    <Table.Td>
                                        <Button m={0} variant="subtle" color="gray" size="xs" onClick={() => {
                                            openDetailsModal(order)
                                        }}>
                                            <IconDots/>
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </>
            ) : (
                <Text w="100%" fw={800} style={{display: 'flex', justifyContent: 'center'}}>No orders found</Text>

            )}

        </Container>
    );
};

export default SellsPage;