import React, {useContext, useEffect, useState} from 'react';
import {
    Image,
    Card,
    Container,
    Text,
    Stack,
    Group,
    Divider,
    Box,
    Button,
    ScrollArea,
    Flex,
    Loader,
    Grid
} from "@mantine/core";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import {
    fetchAvatarFile,
    findFollowed,
    followProducer,
    getUserById,
    unfollowProducer,
    UserData
} from "../../http/usersAPI";
import {IconHomeStats, IconPlus, IconUserMinus, IconUserPlus} from "@tabler/icons-react";
import {Context} from "../../index";
import {jwtDecode} from "jwt-decode";
import SmallBeatCardComponent from "../../components/beats/SmallBeatCardComponent";
import BeatCardComponent from "../../components/beats/BeatCardComponent";
import '../../App.css'


const UserPage = observer(() => {
    const {beats} = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    const {userId} = useParams();

    const [avatar, setAvatar] = useState('');
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [isOwnAccount, setIsOwnAccount] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        if (currentUser) {
            beats.setBeats(currentUser?.beats)
        }
        if (beats.beats) setIsLoading(false)
    }, [currentUser]);


    useEffect(() => {
        const fetchUserAndCheckFollowStatus = async () => {
            try {
                if (userId) {
                    const data = await getUserById(userId);
                    if (!currentUser) {
                        setCurrentUser(data);
                        setIsOwnAccount(userToken.id === userId);

                        // Check if the current user is following the selected user
                        const followedData = await findFollowed(data.id);

                        // If the user is found, update the follow status
                        if (followedData) {
                            setIsFollowed(true); // or setIsFollowed(followedData.isFollowed);
                        } else {
                            setIsFollowed(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserAndCheckFollowStatus().then(() => {
            const avatarFetch = async () => {
                if (currentUser) {
                    const avatar = await fetchAvatarFile(currentUser.avatar_url);
                    setAvatar(avatar);
                }
            }
            avatarFetch();
        });
    }, [currentUser, isFollowed]);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            console.log(storedToken)
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
            console.log(storedToken)
            if (storedToken) {
                setUserToken(jwtDecode(storedToken));
            } else {
                setUserToken({});
            }
        } catch (err) {
            console.error('Error decoding token:', err);
        }
    }, [localStorage.getItem('token')]);

    const followUser = async () => {
        if (currentUser) {
            // Check if the user is not already followed (just to be safe)
            if (!isFollowed) {
                await followProducer(currentUser.id);
                setIsFollowed(true);
            }
        }
    }

    const unfollowUser = async () => {
        if (currentUser) {
            // Check if the user is currently followed
            if (isFollowed) {
                await unfollowProducer(currentUser.id);
                setIsFollowed(false);
            }
        }
    }

    if (isLoading) {
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
        <Container size="xl" style={{paddingTop: '95px', display: 'flex', flexDirection: 'row', width: '100%'}}>
            <Card style={{width: '30%', marginBottom: '20px'}} shadow="sm" padding="lg" radius="lg" withBorder>
                <Image src={avatar} radius="lg" mb="md"/>
                <Card.Section style={{display: 'flex', justifyContent: 'center'}}>
                    <Stack style={{display: "flex", justifyContent: "center"}}>
                        <Text fw={900} size="lg"
                              style={{display: "flex", justifyContent: "center"}}>{currentUser?.username}</Text>
                        {!isOwnAccount && !isFollowed && (
                            <Button onClick={followUser} leftSection={<IconUserPlus/>} variant="filled" color="indigo">Follow</Button>
                        )}
                        {!isOwnAccount && isFollowed && (
                            <Button onClick={unfollowUser} leftSection={<IconUserMinus/>} variant="light" color="red">Unfollow</Button>
                        )}
                    </Stack>
                </Card.Section>

                <Divider
                    my="xs"
                    labelPosition="center"
                    label={
                        <>
                            <IconHomeStats size={16}/>
                            <Box ml={5}>Stats</Box>
                        </>
                    }
                />
                <Stack align="center" gap="xl" w="100%" style={{display: 'inline-block'}} py="xs">
                    <Group justify="space-between">
                        <Text size="md">Followers</Text>
                        <Text fw={800} size="sm"
                              c="dimmed">{currentUser?.followers_followers_who_followedTousers.length}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text size="md">Plays</Text>
                        <Text fw={800} size="sm"
                              c="dimmed">{currentUser?.plays.length}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text size="md">Beats</Text>
                        <Text fw={800} size="sm"
                              c="dimmed">{currentUser?.beats.length}</Text>
                    </Group>
                </Stack>
                <Divider
                    my="xs"
                    labelPosition="center"
                    label={
                        <>
                            <Box ml={5}>Products</Box>
                        </>
                    }
                />
                <Stack align="center" gap="xl" w="100%" style={{display: 'inline-block'}} py="xs">
                    <Button variant="default" radius="lg">{currentUser?.beats.length} beats</Button>
                </Stack>

                <Divider
                    my="xs"
                    labelPosition="center"
                    label={
                        <>
                            <Box ml={5}>About me</Box>
                        </>
                    }
                />
                <Stack align="center" gap="xl" w="100%" style={{display: 'inline-block'}} py="xs">
                    <ScrollArea h={150} offsetScrollbars>{currentUser?.bio}</ScrollArea>
                </Stack>
            </Card>

            {currentUser && (
                <Container style={{width: '70%', paddingRight: 0}}>
                    <Grid columns={6} miw="100%" mb="20px">
                        {beats.beats.map(beat => (
                            <Grid.Col span={2}>
                                <BeatCardComponent beat={beat}/>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            )}
        </Container>
    );
});

export default UserPage;
