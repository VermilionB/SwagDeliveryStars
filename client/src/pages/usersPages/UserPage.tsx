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
    Grid,
    LoadingOverlay, Tabs
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
import {IconBrandTiktok, IconHomeStats, IconRepeat, IconUserMinus, IconUserPlus} from "@tabler/icons-react";
import {Context} from "../../index";
import {jwtDecode} from "jwt-decode";
import BeatCardComponent from "../../components/beats/BeatCardComponent";
import '../../App.css'
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";


const UserPage = observer(() => {
    const {beats} = useContext(Context);

    const {userId} = useParams();

    const [avatar, setAvatar] = useState('');
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [isOwnAccount, setIsOwnAccount] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [loadingOverlayVisible, {toggle: toggleLoadingOverlay}] = useDisclosure(false); // State to control loading overlay
    const [activeTab, setActiveTab] = useState<string | null>('beats');


    useEffect(() => {
        if (currentUser && activeTab === 'beats') {
            beats.setBeats(currentUser?.user.beats)
        }
        else if(currentUser && activeTab === 'reposts') {
            beats.setReposts(currentUser?.user.reposts)
        }

    }, [currentUser, activeTab]);


    useEffect(() => {
        const fetchUserAndCheckFollowStatus = async () => {
            try {

                if (userId) {
                    const data = await getUserById(userId);
                    console.log(data)
                    if (!currentUser && data) {
                        setCurrentUser(data);

                        // Check if the current user is following the selected user
                        const followedData = await findFollowed(data.user.id);

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
                    setIsOwnAccount(userToken.id === userId);
                    const avatar = await fetchAvatarFile(currentUser.user.avatar_url);
                    setAvatar(avatar);

                }
            }
            avatarFetch();
        });
    }, [userId, currentUser, isFollowed]);

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
        try {
            if (currentUser) {
                // Check if the user is not already followed (just to be safe)
                if (!isFollowed) {
                    await followProducer(currentUser.user.id);
                    setIsFollowed(true);
                }
            }
        } catch (error: any) {
            // Handle the error, e.g., display a notification
            notifications.show({
                title: 'Error',
                message: `Failed to follow user: ${error.response.data.message}`,
                color: 'red',
            });
        }
    }

    const unfollowUser = async () => {
        if (currentUser) {
            // Check if the user is currently followed
            if (isFollowed) {
                await unfollowProducer(currentUser.user.id);
                setIsFollowed(false);
            }
        }
    }


    return (
        <Container size="xl" style={{paddingTop: '95px', display: 'flex', flexDirection: 'row', width: '100%'}}>
            <Box style={{width: '30%', marginBottom: '20px'}}>
                <Card style={{width: '100%'}} shadow="sm" padding="lg" radius="lg" withBorder>
                    <Image src={avatar} radius="lg" mb="md"/>
                    <Card.Section style={{display: 'flex', justifyContent: 'center'}}>
                        <Stack style={{display: "flex", justifyContent: "center"}}>
                            <Text fw={900} size="lg"
                                  style={{display: "flex", justifyContent: "center"}}>{currentUser?.user.username}</Text>
                            {!isOwnAccount && !isFollowed && (
                                <Button onClick={followUser} leftSection={<IconUserPlus/>} variant="filled"
                                        color="indigo">Follow</Button>
                            )}
                            {!isOwnAccount && isFollowed && (
                                <Button onClick={unfollowUser} leftSection={<IconUserMinus/>} variant="light"
                                        color="red">Unfollow</Button>
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
                                  c="dimmed">{currentUser?.user.followers_followers_who_followedTousers.length}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="md">Plays</Text>
                            <Text fw={800} size="sm"
                                  c="dimmed">{currentUser?.totalPlays}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="md">Beats</Text>
                            <Text fw={800} size="sm"
                                  c="dimmed">{currentUser?.user.beats.length}</Text>
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
                        <Button variant="default" radius="lg">{currentUser?.user.beats.length} beats</Button>
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
                        <ScrollArea h={150} offsetScrollbars>{currentUser?.user.bio}</ScrollArea>
                    </Stack>
                </Card>
            </Box>


            {currentUser && (
                <Container style={{width: '70%', paddingRight: 0}}>
                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tabs.List>
                            <Tabs.Tab value="beats" leftSection={<IconBrandTiktok/>}>
                                My Beats
                            </Tabs.Tab>
                            <Tabs.Tab value="reposts" leftSection={<IconRepeat/>}>
                                <Text>Reposts {isOwnAccount ? '' : `of ${currentUser.user.username}`}</Text>
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="beats">
                            <Grid columns={6} miw="100%" mb="20px" mt="20px">
                                {beats.beats.map(beat => (
                                    <Grid.Col span={2}>
                                        <BeatCardComponent beat={beat}/>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Tabs.Panel>

                        <Tabs.Panel value="reposts">
                            <Grid columns={6} miw="100%" mb="20px">
                                {beats.reposts.map(beat => (
                                    <Grid.Col span={2}>
                                        <BeatCardComponent beat={beat.beats}/>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Tabs.Panel>


                    </Tabs>

                </Container>
            )}
            <LoadingOverlay visible={loadingOverlayVisible} zIndex={1000} overlayProps={{radius: 'sm', blur: 2}}
                            loaderProps={{color: 'teal', type: 'bars'}}/>

        </Container>
    );
});

export default UserPage;
