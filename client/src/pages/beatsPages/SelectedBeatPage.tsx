import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Group,
    Image,
    Loader,
    Stack,
    Text,
    Divider,
    Accordion,
    Avatar, TextInput, Modal, Rating, Skeleton
} from "@mantine/core";
import {
    checkIfBeatLiked,
    checkIfBeatReposted,
    getBeatById,
    likeBeatAction, repostBeatAction,
    unlikeBeatAction,
    unrepostBeatAction
} from "../../http/beatsAPI";
import {useNavigate, useParams} from "react-router-dom";
import {fetchAvatarFile, getUserById, UserData} from "../../http/usersAPI";
import Waveform from "../../components/player/Waveform";
import {
    IconCreditCardPay,
    IconFileDescription, IconHash,
    IconHeart, IconHeartFilled,
    IconInfoSquareRounded, IconLicense,
    IconRepeat, IconRepeatOff, IconSend, IconShoppingCart, IconTags
} from "@tabler/icons-react";
import {getLicenseTypeById} from "../../http/licensesAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {jwtDecode} from "jwt-decode";
import {useDisclosure} from "@mantine/hooks";
import LinkComponent from "../../components/router/LinkComponent";
import {ALL_BEATS_ROUTE, USER_ROUTE} from "../../routes/consts";
import {createOrder} from "../../http/orderAPI";
import {createComment} from "../../http/commentsAPI";
import {notifications} from "@mantine/notifications";
import CommentComponent, {CommentComponentProps} from '../../components/comments/CommentComponent'


interface BeatInterface {
    id: string;
    name: string;
    users: {
        id: string;
        username: string;
    }
    image_url: string;
    duration: number;
    bpm: number;
    keys: {
        key: string;
    }
    genres: {
        genre: string;
    }

    description: string;
    is_free: boolean;
    is_available: boolean;
    licenses: [
        {
            id: string;
            license_types: {
                id: number,
                license_type: string;
                description: string;
            },
            price: string;
        }
    ],
    comments: CommentComponentProps[],
    beat_files: {
        mp3_file: string;
    },
    tags: string[],
    _count: {
        likes: number,
        plays: number,
        reposts: number
    }
}

interface LicenseTypeInterface {
    id: number,
    license_type: string;
    description: string;
}

interface CommentInterface {
    comment: string;
    users: {
        username: string;
        avatar_url: string;
    };
}


const SelectedBeatPage = observer(() => {
    const {user} = useContext(Context)
    const [opened, {open, close}] = useDisclosure(false);
    const navigate = useNavigate();

    const {id} = useParams();
    const [image, setImage] = useState('');
    const [audio, setAudio] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedBeat, setSelectedBeat] = useState<BeatInterface | null>(null);
    const [selectedLicense, setSelectedLicense] = useState<LicenseTypeInterface | null>(null);
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [avatar, setAvatar] = useState('')

    const [isOwnAccount, setIsOwnAccount] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isReposted, setIsReposted] = useState(false);
    const [audioLoading, setAudioLoading] = useState(true)

    const [imageLoading, setImageLoading] = useState(true)

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<CommentInterface[]>([]);


    useEffect(() => {
        getLicenseTypeById(1).then(data => {
            setSelectedLicense(data)
        })
    }, []);

    useEffect(() => {
        console.log(audio)
        audio.length ? setAudioLoading(false) : setAudioLoading(true)
        console.log(audioLoading)
    }, [audio]);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const beatPromise = getBeatById(id);
                    const beat = await beatPromise;
                    setSelectedBeat(beat);

                    if (beat) {
                        const imgPromise = fetchAvatarFile(beat.image_url);
                        const audioPromise = fetchAvatarFile(beat.beat_files.mp3_file);

                        const [img, audio] = await Promise.all([imgPromise, audioPromise]);

                        setComments(beat.comments)
                        setImage(img);
                        setAudio(audio);
                        console.log(audio)
                    }
                } catch (error) {
                    console.error("Error fetching beat:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (selectedBeat && currentUser) {
            const check = async () => {
                const liked = await checkIfBeatLiked(selectedBeat.id);
                const reposted = await checkIfBeatReposted(selectedBeat.id)
                if (liked) {
                    setIsLiked(true)
                } else setIsLiked(false)

                if (reposted) {
                    setIsReposted(true)
                } else setIsReposted(false)
            }
            check()
        }
    }, [currentUser, selectedBeat]);

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (userToken.id) {
                    const data = await getUserById(userToken.id);
                    console.log(data)
                    setCurrentUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser().then(data => {
            const avatarFetch = async () => {
                if (currentUser) {
                    const avatar = await fetchAvatarFile(currentUser.user.avatar_url);
                    setAvatar(avatar);
                }
            }
            avatarFetch()
        });
    }, [userToken]);

    useEffect(() => {

        const fetchAvatar = async () => {
            try {
                if (currentUser) {
                    setIsOwnAccount(userToken.id === currentUser.user.id);
                    const data = await fetchAvatarFile(currentUser.user.avatar_url);
                    user.setCurrentUser(currentUser)
                    setAvatar(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchAvatar();
    }, [currentUser, user]);

    const buyBeat = async () => {
        if (!selectedLicense || !selectedBeat || !currentUser) {
            return;
        }
        setLoading(true)
        const order = await createOrder(
            selectedBeat.users.id,
            currentUser.user.id,
            selectedBeat.licenses.find(
                license => license.license_types.id === selectedLicense.id
            )?.id,
            selectedBeat.id
        )

        if (order) {
            setLoading(false)
            navigate(ALL_BEATS_ROUTE)
            close()
        }
    }
    const likeBeat = async () => {
        try {
            if (selectedBeat && currentUser) {
                // Send the request to like the beat
                await likeBeatAction(selectedBeat.id);

                // Fetch the updated beat information after liking
                const updatedBeat = await getBeatById(selectedBeat.id);
                setSelectedBeat(updatedBeat);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error liking beat:', error);
        }
    };

    const unlikeBeat = async () => {
        try {
            if (selectedBeat && currentUser) {
                // Send the request to unlike the beat
                await unlikeBeatAction(selectedBeat.id);

                // Fetch the updated beat information after unliking
                const updatedBeat = await getBeatById(selectedBeat.id);
                setSelectedBeat(updatedBeat);
                setIsLiked(false);
            }
        } catch (error) {
            console.error('Error unliking beat:', error);
        }
    };

    const repostBeat = async () => {
        try {
            if (selectedBeat && currentUser) {
                // Send the request to like the beat
                await repostBeatAction(selectedBeat.id);

                // Fetch the updated beat information after liking
                const updatedBeat = await getBeatById(selectedBeat.id);
                setSelectedBeat(updatedBeat);
                setIsReposted(true);
            }
        } catch (error) {
            console.error('Error liking beat:', error);
        }
    };

    const unrepostBeat = async () => {
        try {
            if (selectedBeat && currentUser) {
                // Send the request to unlike the beat
                await unrepostBeatAction(selectedBeat.id);

                // Fetch the updated beat information after unliking
                const updatedBeat = await getBeatById(selectedBeat.id);
                setSelectedBeat(updatedBeat);
                setIsReposted(false);
            }
        } catch (error) {
            console.error('Error unliking beat:', error);
        }
    };

    const sendComment = async () => {
        try {
            if (comment === '') {
                return;
            }
            if (selectedBeat) {
                const newComment = await createComment(comment, selectedBeat?.id);
                console.log(newComment)
                const updatedComments = [...comments, newComment];
                setComments(updatedComments);
                setComment('');
            }
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: `Failed to comment beat: ${err.response.data.message}`,
                color: 'red',
            });
        }

    }

    if (loading || !selectedBeat || !audio || !image || !selectedLicense) {
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
            <Modal opened={opened} onClose={close} title="Order details" centered>
                <Card>
                    <Stack>
                        <Group justify="space-between">
                            <Text>Seller:</Text>
                            <Text fw={800}>{selectedBeat.users.username}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text>Consumer:</Text>
                            <Text fw={800}>{currentUser?.user.username}</Text>
                        </Group>

                        <Divider my="xs"/>
                        <Group justify="space-between">
                            <Stack style={{display: 'inline-block'}}>
                                <Text size="sm" c="indigo">Total price</Text>
                                <Text fw={800} size="lg">${selectedBeat.licenses.find(
                                    (license) => license.license_types.id === selectedLicense.id
                                )?.price}</Text>
                            </Stack>
                            <Button variant="subtle" color="cyan" leftSection={<IconCreditCardPay/>} size="md"
                                    onClick={buyBeat}>Purchase beat</Button>
                        </Group>
                    </Stack>
                </Card>
            </Modal>

            <Card style={{width: '30%', marginBottom: '20px'}} shadow="sm" padding="lg" radius="lg" withBorder>
                <Skeleton radius="lg" height="100%" visible={imageLoading}>
                    <Image src={image} onLoad={() => setImageLoading(false)} radius="lg" mb="md"/>
                </Skeleton>
                <Card.Section style={{display: 'flex', justifyContent: 'center'}}>
                    <Group justify="center">
                        <Stack align="center" gap={1}>
                            {!isLiked ? (
                                <Button variant="default" style={{border: 0}} title="Like" size="lg" radius="xl" pr="md"
                                        pl="md" onClick={likeBeat}>
                                    <IconHeart size="30px"/>
                                </Button>
                            ) : (
                                <Button variant="default" style={{border: 0}} title="Disike" size="lg" radius="xl"
                                        pr="md"
                                        pl="md" onClick={unlikeBeat}>
                                    <IconHeartFilled size="30px"/>
                                </Button>
                            )}

                            {selectedBeat._count.likes}
                        </Stack>
                        <Stack align="center" gap={1}>
                            {!(currentUser?.user.id === selectedBeat.users.id) ? (
                                <>
                                    {!isReposted ? (
                                        <Button variant="default" style={{border: 0}} title="Repost" size="lg"
                                                radius="xl"
                                                pr="md"
                                                pl="md" onClick={repostBeat}>
                                            <IconRepeat size="30px"/>
                                        </Button>
                                    ) : (
                                        <Button variant="default" style={{border: 0}} title="Repost" size="lg"
                                                radius="xl"
                                                pr="md"
                                                pl="md" onClick={unrepostBeat}>
                                            <IconRepeatOff size="30px"/>
                                        </Button>
                                    )}
                                </>) : (
                                <Button variant="default" style={{border: 0}} title="Repost" size="lg" radius="xl"
                                        pr="md"
                                        pl="md">
                                    <IconRepeat size="30px"/>
                                </Button>
                            )}
                            {selectedBeat._count.reposts}
                        </Stack>
                    </Group>
                </Card.Section>
                <Card.Section py="xs" style={{display: 'flex', justifyContent: 'center'}}>
                    <Stack align="center" gap={2} w="100%" px="lg" style={{display: 'flex', justifyContent: 'stretch'}}>
                        <Text fw={800} size="lg" truncate="end" w="100%">{selectedBeat.name}</Text>
                        <LinkComponent to={USER_ROUTE + `/${selectedBeat.users.id}`} underline="never"
                                       style={{
                                           textDecoration: 'none'
                                       }}>
                            <Text fw={500} size="lg" c="dimmed">{selectedBeat.users.username}</Text>
                        </LinkComponent>
                    </Stack>
                </Card.Section>
                <Divider
                    my="xs"
                    labelPosition="center"
                    label={
                        <>
                            <IconInfoSquareRounded size={16}/>
                            <Box ml={5}>Information</Box>
                        </>
                    }
                />
                <Card.Section py="xs" style={{display: 'flex'}}>
                    <Stack py="xs" style={{display: 'flex', width: '100%'}} px="lg">
                        <Group justify="space-between">
                            <Text c="dimmed">Key</Text>
                            <Text fw={500}>{selectedBeat.keys.key}</Text>
                        </Group>
                        <Group justify="space-between" w="100%">
                            <Text c="dimmed">Bpm</Text>
                            <Text fw={500}>{selectedBeat.bpm}</Text>
                        </Group>
                        <Group justify="space-between" w="100%">
                            <Text c="dimmed">Plays</Text>
                            <Text fw={500}>{selectedBeat._count.plays}</Text>
                        </Group>
                    </Stack>
                </Card.Section>
                <Divider
                    my="xs"
                    labelPosition="center"
                    label={
                        <>
                            <IconFileDescription size={16}/>
                            <Box ml={5}>Description</Box>
                        </>
                    }
                />
                <Card.Section>
                    <Stack py="xs" style={{display: 'flex', justifyContent: 'flex-start'}} px="lg">
                        <Text fw={500} size="sm">{selectedBeat.description}</Text>
                    </Stack>
                </Card.Section>
                <Divider
                    my="xs"
                    labelPosition="center"
                    label={
                        <>
                            <IconTags size={16}/>
                            <Box ml={5}>Tags</Box>
                        </>
                    }
                />
                <Card.Section>
                    <Group py="xs" style={{display: 'flex', justifyContent: 'flex-start'}} px="lg">
                        {selectedBeat.tags.map(tag => (
                            <Button variant="default" size="xs" radius="lg"><IconHash size="14px"/>{tag}</Button>
                        ))}
                    </Group>
                </Card.Section>
            </Card>
            {selectedBeat && audio &&
                <Container w="70%" pr={0}>
                    <Card w="100%" radius="xl" h="75px" withBorder
                          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} pt="15px"
                          pb="15px">
                        <Waveform audio={audio} beat={selectedBeat.id}/>
                    </Card>

                    <Card w="100%" radius="xl" withBorder mt="20px">
                        {!(currentUser?.user.id === selectedBeat.users.id) &&

                            <Group justify="space-between">
                                <Text fw={900}>Licensing</Text>
                                <Group h="100%">
                                    <Stack style={{display: 'inline-block'}}>
                                        <Text size="sm">Total price</Text>
                                        <Text fw={800}
                                              size="lg">$ {selectedBeat.licenses[selectedLicense.id - 1].price}</Text>
                                    </Stack>
                                    <Button variant="subtle" color="cyan" leftSection={<IconShoppingCart/>} size="md"
                                            onClick={open}>Buy
                                        license</Button>
                                </Group>
                            </Group>
                        }

                        <Divider
                            my="sm"
                            labelPosition="center"
                            label={
                                <>
                                    <IconLicense size={16}/>
                                    <Box ml={5}>Licenses</Box>
                                </>
                            }
                        />

                        <Group justify="space-between">
                            {selectedBeat.licenses.sort((a, b) => a.license_types.id - b.license_types.id).map(lic => (
                                <Button onClick={() => setSelectedLicense(lic.license_types)} p={10}
                                        style={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}
                                        variant={selectedLicense.id === lic.license_types.id ? "filled" : "light"}
                                        color="indigo" size="xl">
                                    <Stack style={{display: 'inline-block'}}>
                                        <Text
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start'
                                            }}>{lic.license_types.license_type}</Text>
                                        <Text c="dimmed"
                                              style={{
                                                  display: 'flex',
                                                  justifyContent: 'flex-start'
                                              }}>${lic.price}</Text>
                                    </Stack>
                                </Button>
                            ))}
                        </Group>

                        <Group style={{flexGrow: 1}} mt="10px">
                            <Accordion style={{flexGrow: 1}} variant="contained">
                                <Accordion.Item value={selectedLicense.license_type}>
                                    <Accordion.Control>
                                        <Text fw={900}>Usage Terms</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>{selectedLicense?.description}</Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Group>
                    </Card>

                    <Card w="100%" radius="xl" withBorder mt="20px">
                        <Group justify="space-between">
                            <Text fw={900}>Comments</Text>
                            <Group>
                                <Text>Rating: </Text>
                                <Rating value={rating} onChange={setRating} color="indigo"/>
                            </Group>
                        </Group>
                        <Divider
                            my="sm"
                            labelPosition="center"
                        />

                        <Group>
                            <Avatar src={avatar}/>
                            <TextInput
                                variant="unstyled"
                                placeholder="Write a comment..."
                                style={{borderBottom: '1px solid #909296', flexGrow: 1}}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <Button variant="default" style={{border: 0}} radius="xl" pr="md" pl="md"
                                    size="lg" onClick={sendComment} disabled={!comment.length}><IconSend size="22px"/></Button>
                        </Group>
                        {comments.map((comment, index) => (
                            <CommentComponent comment={comment} key={index}/>
                        ))}
                    </Card>


                </Container>
            }
        </Container>
    );
});

export default SelectedBeatPage;