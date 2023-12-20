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
    Avatar, TextInput, Modal, Rating, Skeleton, Title
} from "@mantine/core";
import {
    checkIfBeatLiked,
    checkIfBeatReposted, deleteBeat,
    getBeatById,
    likeBeatAction, repostBeatAction,
    unlikeBeatAction,
    unrepostBeatAction
} from "../../http/beatsAPI";
import {useNavigate, useParams} from "react-router-dom";
import {fetchAvatarFile, getUserById, UserData} from "../../http/usersAPI";
import Waveform from "../../components/player/Waveform";
import {
    IconCreditCardPay, IconDownload,
    IconFileDescription, IconHash,
    IconHeart, IconHeartFilled,
    IconInfoSquareRounded, IconLicense,
    IconRepeat, IconRepeatOff, IconSend, IconShoppingCart, IconTags, IconX
} from "@tabler/icons-react";
import {getLicenseTypeById} from "../../http/licensesAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {jwtDecode} from "jwt-decode";
import {useDisclosure} from "@mantine/hooks";
import LinkComponent from "../../components/router/LinkComponent";
import {ALL_BEATS_ROUTE, ORDERS_ROUTE, USER_ROUTE} from "../../routes/consts";
import {createOrder} from "../../http/orderAPI";
import {createComment, createRating, getRatingByUserAndBeat} from "../../http/commentsRatingsAPI";
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
        id: string;
        username: string;
        avatar_url: string;
        role_id: number;
    };
    beat_id: string;
}


const SelectedBeatPage = observer(() => {
    const {user} = useContext(Context)
    const [opened, {open, close}] = useDisclosure(false);
    const [confirmationOpened, {open: openConfirmation, close: closeConfirmation}] = useDisclosure(false);

    const navigate = useNavigate();

    const {id} = useParams();
    const [image, setImage] = useState('');
    const [audio, setAudio] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedBeat, setSelectedBeat] = useState<BeatInterface | null>(null);
    const [selectedLicense, setSelectedLicense] = useState<LicenseTypeInterface | null>(null);
    const [userToken, setUserToken] = useState<{ id?: string, email?: string, role?: number}>({});
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

        audio.length ? setAudioLoading(false) : setAudioLoading(true)
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
                const userRatingToBeat = await getRatingByUserAndBeat(currentUser.user.id, selectedBeat.id)
                if(userRatingToBeat) {
                    setRating(userRatingToBeat)
                }
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
            navigate(ORDERS_ROUTE)
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
                const updatedComments = [...comments, newComment];
                setComments(updatedComments);
                setComment('');
            }
        } catch (err: any) {
            notifications.show({
                icon: <IconX/>,
                title: 'Error',
                message: `Failed to comment beat: ${err.response.data.message}`,
                color: 'red',
            });
        }
    }

    const sendRating = async () => {
        try {
            if (rating === 0) {
                return;
            }
            if (selectedBeat) {
                await createRating(rating, selectedBeat?.id);
            }
        } catch (err: any) {
            notifications.show({
                icon: <IconX/>,
                title: 'Error',
                message: `Failed to rate beat: ${err.response.data.message}`,
                color: 'red',
            });
        }
    }

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

    const handleDelete = async () => {
        try {
            if(selectedBeat) {
                const deleted = await deleteBeat(selectedBeat.id);
                if(deleted){
                    closeConfirmation();
                    navigate(ALL_BEATS_ROUTE)
                }
            }
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: `Failed to delete beat: ${err.response.data.message}`,
                color: 'red',
            });
        }
    };

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

            <Modal opened={confirmationOpened} onClose={closeConfirmation} title="Confirm Deletion" centered
                   miw="400px">
                <Stack align="center" w="100%">
                    <Text>Are you sure you want to delete this beat?</Text>
                    <Group>
                        <Button onClick={handleDelete} color="red">
                            Yes, Delete
                        </Button>
                        <Button onClick={closeConfirmation}>Cancel</Button>
                    </Group>
                </Stack>
            </Modal>

            {selectedBeat.is_available ? (
                <>
                    <Box style={{width: '30%', marginBottom: '20px'}}>
                        <Card style={{width: '100%'}} shadow="sm" padding="lg" radius="lg" withBorder>
                            <Skeleton radius="lg" height="345px" visible={imageLoading} mb="md">
                                <Image src={image} onLoad={() => setImageLoading(false)} radius="lg" />
                            </Skeleton>
                            <Card.Section style={{display: 'flex', justifyContent: 'center'}}>
                                <Group justify="center">
                                    <Stack align="center" gap={1}>
                                        {!isLiked ? (
                                            <Button variant="default" style={{border: 0}} title="Like" size="lg" radius="xl"
                                                    pr="md"
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
                                <Stack align="center" gap={2} w="100%" px="lg"
                                       style={{display: 'flex', justifyContent: 'stretch'}}>
                                    <Text fw={800} size="lg" truncate="end" w="100%"
                                          style={{textAlign: 'center'}}>{selectedBeat.name}</Text>
                                    <LinkComponent to={USER_ROUTE + `/${selectedBeat.users.id}`} underline="never"
                                                   style={{
                                                       textDecoration: 'none'
                                                   }}>
                                        <Text fw={500} size="lg" c="dimmed">{selectedBeat.users.username}</Text>
                                    </LinkComponent>

                                    {userToken.role === 2 && (
                                        <Button variant="light" color="red" onClick={openConfirmation}>Delete beat</Button>
                                    )}
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
                    </Box>
                {selectedBeat && audio &&
                <Container w="70%" mb="20px" pr={0}>
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
                                    {selectedBeat.is_free && (
                                        <Button size="xs"
                                                leftSection={<IconDownload/>}
                                                onClick={() => downloadFile(selectedBeat?.beat_files.mp3_file, 'mp3')}>
                                            Free Download
                                        </Button>
                                    )}
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

                    <Card radius="xl" withBorder mt="20px">
                        <Group justify="space-between">
                            <Group>
                                <Text>Set rating for the beat: </Text>
                                <Rating value={rating} onChange={setRating} color="indigo"/>
                            </Group>
                            <Button variant="light" radius="lg" color="indigo" onClick={sendRating}>Rate</Button>
                        </Group>

                    </Card>
                    <Card w="100%" radius="xl" withBorder mt="20px">
                        <Group justify="space-between">
                            <Text fw={900}>Comments</Text>

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
                                value={comment}
                                style={{borderBottom: '1px solid #909296', flexGrow: 1}}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <Button variant="default" style={{border: 0}} radius="xl" pr="md" pl="md"
                                    size="lg" onClick={sendComment} disabled={!comment.length}><IconSend
                                size="22px"/></Button>
                        </Group>
                        {comments.map((comment, index) => (
                            <CommentComponent comment={comment} key={index}/>
                        ))}
                    </Card>
                </Container>

            }
            </>) : (
                <Container size="xl" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                    <Title>This beat is unavailable</Title>
                </Container>
            )}

        </Container>
    );
});

export default SelectedBeatPage;