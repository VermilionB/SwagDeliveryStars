import React, {useEffect, useRef, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    FileButton,
    Group,
    TextInput,
    Textarea,
    Stack,
    Divider,
    Text
} from "@mantine/core";
import {fetchAvatarFile, getUserById, updateUserData, UserData} from "../../http/usersAPI";
import {useNavigate, useParams} from "react-router-dom";
import {
    IconAt,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandSoundcloud, IconBrandTiktok, IconBrandTwitch,
    IconBrandTwitter,
    IconBrandYoutube,
    IconCirclesRelation, IconEdit,
    IconExclamationMark,
    IconPhone,
    IconUser,
    IconX
} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {USER_ROUTE} from "../../routes/consts";

const EditProfilePage = () => {
    const {userId} = useParams();
    const navigate = useNavigate()
    const [isUpdateClicked, setIsUpdateClicked] = useState(false);

    const [avatar, setAvatar] = useState<string | null>('');
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);

    const resetRef = useRef<() => void>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [contactInfo, setContactInfo] = useState('')

    const [youtubeLink, setYoutubeLink] = useState('')
    const [soundcloudLink, setSoundcloudLink] = useState('')
    const [facebookLink, setFacebookLink] = useState('')
    const [twitterLink, setTwitterLink] = useState('')
    const [instagramLink, setInstagramLink] = useState('')
    const [tiktokLink, setTiktokLink] = useState('')
    const [twitchLink, setTwitchLink] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (userId) {
                    const data = await getUserById(userId);
                    if (!currentUser && data) {
                        setCurrentUser(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser().then(() => {
            const avatarFetch = async () => {
                if (currentUser) {
                    const avatar = await fetchAvatarFile(currentUser.user.avatar_url);
                    setAvatar(avatar);
                }
            }
            avatarFetch();
        });
    }, [currentUser, userId]);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.user.username)
            setBio(currentUser.user.bio)
            setContactInfo(currentUser.user.contact_info)
            setYoutubeLink(currentUser.user.social_links.youtube)
            setSoundcloudLink(currentUser.user.social_links.soundcloud)
            setFacebookLink(currentUser.user.social_links.facebook)
            setTwitterLink(currentUser.user.social_links.twitter)
            setInstagramLink(currentUser.user.social_links.instagram)
            setTiktokLink(currentUser.user.social_links.tiktok)
            setTwitchLink(currentUser.user.social_links.twitch)
        }
    }, [currentUser]);

    const onFileChange = (newFile: File | null) => {
        setImageFile(newFile);
        setAvatar(newFile !== null ? URL.createObjectURL(newFile) : null);
    };

    const updateUser = async () => {
        setIsUpdateClicked(true);

        if (username.length < 3) {
            notifications.show({
                icon: <IconExclamationMark/>,
                title: 'Warning',
                message: `Username must have at least 3 letters`,
                color: 'yellow',
            });
            return;
        }

        if (bio && bio.length > 1000) {
            notifications.show({
                icon: <IconExclamationMark/>,
                title: 'Warning',
                message: `Bio is too long`,
                color: 'yellow',
            });
            return;
        }

        if (contactInfo && contactInfo.length > 150) {
            notifications.show({
                icon: <IconExclamationMark/>,
                title: 'Warning',
                message: `Contact info is too long`,
                color: 'yellow',
            });
            return;
        }

        const boundary = 'blob_boundary';
        const config = {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
        };

        const formData = new FormData();

        try {
            if (imageFile) {
                formData.append(`image_file`, imageFile);
            }
            formData.append('username', username);
            formData.append('bio', bio);
            formData.append('contact_info', contactInfo);

            if (youtubeLink) {
                formData.append('youtube', youtubeLink);
            }

            if (soundcloudLink) {
                formData.append('soundcloud', soundcloudLink);
            }
            if (facebookLink) {
                formData.append('facebook', facebookLink);
            }
            if (twitterLink) {
                formData.append('twitter', twitterLink);
            }
            if (instagramLink) {
                formData.append('instagram', instagramLink);
            }
            if (tiktokLink) {
                formData.append('tiktok', tiktokLink);
            }
            if (twitchLink) {
                formData.append('twitch', twitchLink);
            }

            const data = await updateUserData(formData, config);

            if (data) {
                navigate(USER_ROUTE + `/${currentUser?.user.id}`);
            }

        } catch (err: any) {
            notifications.show({
                icon: <IconX/>,
                title: 'Error',
                message: `Failed to update user: ${err.response.data.message}`,
                color: 'red',
            });
        }
    }


    return (
        <Container size="xl"
                   style={{
                       paddingTop: '95px',
                       marginBottom: '20px',
                       display: 'flex',
                       flexDirection: 'row',
                       justifyContent: 'center',
                       width: '100%'
                   }}>
            <Box w="50%">
                <Group mb="20px" style={{position: 'relative'}} justify="center">
                    <Avatar src={avatar} radius="xl" size="xl" p={0}/>

                    <Avatar style={{position: 'absolute', border: 0}} p={0} radius="xl" size="xl" variant="transparent">
                        <FileButton resetRef={resetRef} onChange={onFileChange} accept="image/png,image/jpeg">
                            {(props) =>
                                <Button {...props} variant="subtle" color="gray" w="100%" h="100%" radius="xl"
                                        style={{backdropFilter: 'blur(2px)', border: 0, padding: 0}}>
                                    <IconEdit/>
                                </Button>
                            }
                        </FileButton>
                    </Avatar>
                </Group>

                <Divider
                    my="xs"
                    size="md"
                    variant="dashed"
                    labelPosition="center"
                    label={
                        <>
                            <IconUser size={16}/>
                            <Box ml={5} size="xl">
                                <Text fw={700} size="md">Profile data</Text>
                            </Box>
                        </>
                    }
                />
                <Stack gap="sm" mb="20px">
                    <TextInput w="100%" placeholder="Username"
                               label="Username"
                               error={isUpdateClicked && !username ? 'Invalid username' : ''}
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={username}
                               radius="md"
                               leftSection={<IconAt size={16}/>}
                               onChange={e => setUsername(e.target.value)}/>
                    <Textarea w="100%" placeholder="Write something about you"
                              label="Biography"
                              value={bio}
                              autosize
                              minRows={3}
                              maxRows={9}
                              inputWrapperOrder={['label', 'input', 'error']}
                              radius="md"
                              onChange={e => setBio(e.target.value)}/>
                    <TextInput w="100%" placeholder="Contacts"
                               label="Contact info"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={contactInfo}
                               radius="md"
                               leftSection={<IconPhone size={16}/>}
                               onChange={e => setContactInfo(e.target.value)}/>
                </Stack>

                <Divider
                    my="xs"
                    size="md"
                    variant="dashed"
                    labelPosition="center"
                    label={
                        <>
                            <IconCirclesRelation size={16}/>
                            <Box ml={5} size="xl">
                                <Text fw={700} size="md">Social links</Text>
                            </Box>
                        </>
                    }
                />

                <Stack gap="sm" mb="20px">
                    <TextInput w="100%" placeholder="Youtube"
                               label="Youtube"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={youtubeLink}
                               radius="md"
                               leftSection={<IconBrandYoutube size={16}/>}
                               onChange={e => setYoutubeLink(e.target.value)}/>
                    <TextInput w="100%" placeholder="Soundcloud"
                               label="Soundcloud"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={soundcloudLink}
                               radius="md"
                               leftSection={<IconBrandSoundcloud size={16}/>}
                               onChange={e => setSoundcloudLink(e.target.value)}/>
                    <TextInput w="100%" placeholder="Facebook"
                               label="Facebook"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={facebookLink}
                               radius="md"
                               leftSection={<IconBrandFacebook size={16}/>}
                               onChange={e => setFacebookLink(e.target.value)}/>
                    <TextInput w="100%" placeholder="Twitter"
                               label="Twitter"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={twitterLink}
                               radius="md"
                               leftSection={<IconBrandTwitter size={16}/>}
                               onChange={e => setTwitterLink(e.target.value)}/>
                    <TextInput w="100%" placeholder="Instagram"
                               label="Instagram"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={instagramLink}
                               radius="md"
                               leftSection={<IconBrandInstagram size={16}/>}
                               onChange={e => setInstagramLink(e.target.value)}/>
                    <TextInput w="100%" placeholder="TikTok"
                               label="TikTok"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={tiktokLink}
                               radius="md"
                               leftSection={<IconBrandTiktok size={16}/>}
                               onChange={e => setTiktokLink(e.target.value)}/>
                    <TextInput w="100%" placeholder="Twitch"
                               label="Twitch"
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={twitchLink}
                               radius="md"
                               leftSection={<IconBrandTwitch size={16}/>}
                               onChange={e => setTwitchLink(e.target.value)}/>

                </Stack>

                <Button variant="outline" color="indigo" onClick={updateUser}>
                    Apply
                </Button>
            </Box>
        </Container>
    );
};

export default EditProfilePage;