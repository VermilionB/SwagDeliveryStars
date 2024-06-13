import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Alert,
    Image,
    Button,
    Container,
    FileButton,
    Group,
    Text,
    TextInput,
    Stack,
    Select,
    Textarea, NumberInput, CloseButton, Checkbox, LoadingOverlay, Title
} from "@mantine/core";
import {jwtDecode} from "jwt-decode";
import {createBeat} from "../http/beatsAPI";
import {IconCheck, IconCurrencyDollar, IconExclamationCircle, IconX} from "@tabler/icons-react";
import {getAllGenres} from "../http/genresAPI";

import missingImage from '../images/missing.png'
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import StepsBeatCreating from "../components/stepper/StepsBeatCreating";
import {getAllKeys} from "../http/keysAPi";
import {getAllLicensesTypes} from "../http/licensesAPI";
import {ALL_BEATS_ROUTE} from "../routes/consts";
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";
import {getUserById, UserData} from "../http/usersAPI";


const CreateBeatPage = observer(() => {
    const {beats} = useContext(Context)
    const navigate = useNavigate();

    const [mp3File, setMp3File] = useState<File | null>(null);
    const [wavFile, setWavFile] = useState<File | null>(null);
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isCreateClicked, setIsCreateClicked] = useState(false)

    const [selectedGenre, setSelectedGenre] = useState<string | null>('');
    const [selectedKey, setSelectedKey] = useState<string | null>('');
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [bpm, setBpm] = useState<string | number>(140)
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [licensePrices, setLicensePrices] = useState<{ [key: number]: number }>({});
    const [isFree, setIsFree] = useState(false)

    const resetRef = useRef<() => void>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);

    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);

    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [nextStepDisabled, setNextStepDisabled] = useState(true)

    const [loadingOverlayVisible, {toggle: toggleLoadingOverlay}] = useDisclosure(false); // State to control loading overlay

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

    const nextStep = () => setActiveStep((current) => (current <= 3 ? current + 1 : current));
    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));
    const clearFile = () => {
        setImageFile(null);
        setImageURL(null);
        resetRef.current?.();
    };

    const onFileChange = (newFile: File | null) => {
        setImageFile(newFile);
        setImageURL(newFile !== null ? URL.createObjectURL(newFile) : null);
    };

    const clearMp3File = () => setMp3File(null)
    const onMp3FileChange = (newFile: File | null) => setMp3File(newFile)
    const clearWavFile = () => setWavFile(null)
    const onWavFileChange = (newFile: File | null) => setWavFile(newFile);

    const clearZipFile = () => setZipFile(null);

    const onZipFileChange = (newFile: File | null) => setZipFile(newFile);

    const create = async () => {
        const boundary = 'blob_boundary_beat';
        const config = {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
        };

        const formData = new FormData();
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setUserToken(jwtDecode(storedToken));
        } else {
            setUserToken({});
        }

        try {

            if (!mp3File || !wavFile || !zipFile || !imageFile || !title || !selectedGenre || !licensePrices || !bpm || !selectedKey) {
                notifications.show({
                    icon: <IconX/>,
                    title: 'Error',
                    message: `Please provide data to all fields`,
                    color: 'red',
                });
                return;
            }
            if(title.length > 70) {
                notifications.show({
                    icon: <IconX/>,
                    title: 'Error',
                    message: `Title is too long (max length 70 symbols)`,
                    color: 'red',
                });
                return;
            }
            if(description.length > 1000) {
                notifications.show({
                    icon: <IconX/>,
                    title: 'Error',
                    message: `Description is too long (max length 1000 symbols)`,
                    color: 'red',
                });
                return;
            }

            formData.append(`mp3_file`, mp3File);
            formData.append(`wav_file`, wavFile);
            formData.append(`zip_file`, zipFile);
            formData.append(`image_file`, imageFile);

            if (selectedGenre) {
                formData.append('genreId', selectedGenre);
            }
            formData.append('name', title);
            formData.append('description', description);
            formData.append('bpm', bpm.toString());
            if (selectedKey) {
                formData.append('key', selectedKey);
            }
            tags.map(tag => {
                formData.append('tags', tag);
            })

            formData.append('isFree', isFree ? isFree.toString() : '')
            formData.append('licenses', JSON.stringify(licensePrices))

            // toggleLoadingOverlay()
            const data = await createBeat(formData, config);
            // toggleLoadingOverlay()

            if (data) {
                navigate(ALL_BEATS_ROUTE);
                notifications.show({
                    icon: <IconCheck/>,
                    title: 'Success',
                    message: `Your beat successfully loaded`,
                    color: 'green',
                });
            }
        } catch (err: any) {
            setAlertMessage(err.message);
            setShowAlert(true);
        }
    }

    const closeError = () => {
        setAlertMessage('')
        setShowAlert(false)
        setIsCreateClicked(false)
    }

    const addTag = () => {
        if (currentTag.trim() !== "") {
            setTags((prevTags) => [...prevTags, currentTag.trim()]);
            setCurrentTag("");
        }
    }

    const removeTag = (index: number) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    }

    const handlePriceChange = (licenseId: number, value: number) => {
        setLicensePrices((prevPrices) => ({...prevPrices, [licenseId]: value}));
    };

    useEffect(() => {
        getAllGenres().then(gnrs => beats.setGenres(gnrs))
        getAllKeys().then(keys => beats.setKeys(keys))
        getAllLicensesTypes().then(lt => beats.setLicensesTypes(lt))
    }, []);

    useEffect(() => {
        if (imageFile && mp3File && wavFile && zipFile && activeStep === 0) {
            setNextStepDisabled(false)
        } else if (title && selectedGenre && description && bpm && tags && selectedKey && activeStep === 1) {
            setNextStepDisabled(false)
        } else if (activeStep === 2 && licensePrices) {
            setNextStepDisabled(false)
        } else if (activeStep === 3) {
            setNextStepDisabled(false)
        } else setNextStepDisabled(true)
    }, [imageFile, mp3File, wavFile, zipFile, description, bpm, tags, selectedGenre, activeStep, licensePrices]);


    return (
        <Container fluid style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '100%',
            paddingTop: '95px'
        }}>
            {currentUser && !currentUser?.user.is_banned ? (
                <>
                    {showAlert && (
                        <Alert radius="md" title="Error" color="red" icon={<IconExclamationCircle/>} withCloseButton
                               onClick={closeError}>
                            {alertMessage}
                        </Alert>
                    )}

                    <StepsBeatCreating activeStep={activeStep} setActive={setActiveStep}>
                        {activeStep === 0 && (
                            <Container mt={10} size="xs" style={{padding: "25px"}}>
                                <Stack>
                                    <Group justify="center" gap="sm">
                                        <Image src={imageURL ?? missingImage} h={200} w={200} radius="md"/>
                                    </Group>
                                    <Group justify="center">
                                        <FileButton resetRef={resetRef} onChange={onFileChange}
                                                    accept="image/png,image/jpeg">
                                            {(props) => <Button {...props} variant="outline" color="indigo">Upload
                                                image</Button>}
                                        </FileButton>
                                        <Button disabled={!imageFile} color="red" variant="outline" onClick={clearFile}>
                                            Reset
                                        </Button>
                                    </Group>

                                    <Group justify="center">
                                        {!mp3File ? (
                                            <FileButton onChange={onMp3FileChange} accept="audio/mpeg">
                                                {(props) =>
                                                    <Button {...props} variant="outline" color="indigo" w="150px"
                                                            h="50px">MP3
                                                        file</Button>
                                                }
                                            </FileButton>
                                        ) : (
                                            <Button onClick={clearMp3File} color="red" variant="outline" w="150px"
                                                    h="50px">Reset
                                                MP3 file</Button>
                                        )}

                                        {!wavFile ? (
                                            <FileButton onChange={onWavFileChange} accept="audio/wav">
                                                {(props) =>
                                                    <Button {...props} variant="outline" color="indigo" w="150px"
                                                            h="50px">WAV
                                                        file</Button>
                                                }
                                            </FileButton>
                                        ) : (
                                            <Button onClick={clearWavFile} color="red" variant="outline" w="150px"
                                                    h="50px">Reset
                                                WAV file</Button>
                                        )}

                                        {!zipFile ? (
                                            <FileButton onChange={onZipFileChange}
                                                        accept="application/zip,application/vnd.rar">
                                                {(props) =>
                                                    <Button {...props} variant="outline" color="indigo" w="150px"
                                                            h="50px">ZIP
                                                        archive</Button>
                                                }
                                            </FileButton>
                                        ) : (
                                            <Button onClick={clearZipFile} color="red" variant="outline" w="150px"
                                                    h="50px">Reset
                                                ZIP archive</Button>
                                        )}
                                    </Group>

                                </Stack>
                            </Container>
                        )}
                        {activeStep === 1 && (
                            <Container mt={10} size="md" style={{padding: "25px"}}>
                                <Stack gap="sm" mt={10}>
                                    <Group justify="space-between">
                                        <TextInput label="Title"
                                                   placeholder="Enter title"
                                                   value={title}
                                                   radius="md"
                                                   style={{flexGrow: 1}} // add this
                                                   onChange={e => setTitle(e.target.value)}/>
                                        <Select
                                            label="Genre"
                                            radius="md"
                                            data={beats.genres.map((genre) => ({value: genre.id, label: genre.genre}))}
                                            value={selectedGenre}
                                            onChange={setSelectedGenre}
                                            style={{flexGrow: 1}} // and this
                                            placeholder="Pick genre"
                                            searchable
                                        />
                                    </Group>


                                    <Group justify="center">
                                        <Textarea w="100%"
                                                  radius="md"
                                                  label="Description"
                                                  autosize
                                                  minRows={5}
                                                  maxRows={10}
                                                  value={description}
                                                  onChange={e => setDescription(e.target.value)}/>
                                    </Group>

                                    <Group justify="center">
                                        <NumberInput
                                            value={bpm}
                                            onChange={setBpm}
                                            radius="md"
                                            label="Bpm"
                                            style={{flexGrow: 1}} // and this
                                            placeholder="Choose bpm for your beat"
                                            min={1}
                                            max={999}
                                        />
                                        <Select
                                            label="Key"
                                            radius="md"
                                            data={beats.keys.map((key) => ({value: key.id.toString(), label: key.key}))}
                                            value={selectedKey}
                                            onChange={setSelectedKey}
                                            style={{flexGrow: 1}} // and this
                                            placeholder="Pick genre"
                                            searchable
                                        />
                                    </Group>

                                    <Group justify="center" style={{alignItems: 'flex-end'}}>
                                        <TextInput
                                            style={{flexGrow: 1}}
                                            radius="md"
                                            label="Tag"
                                            placeholder="Enter tag"
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                        />
                                        <Button onClick={addTag}>Add Tag</Button>
                                    </Group>

                                    <Group gap="sm">
                                        <Text>Tags: </Text>
                                        {tags.map((tag, index) => (
                                            <Button key={index}
                                                    style={{alignItems: 'center', padding: '0 3px'}}
                                                    variant="default" size="xs" radius="lg">
                                                <CloseButton
                                                    size="sm"
                                                    radius="lg"
                                                    mr="2px"
                                                    onClick={() => removeTag(index)}
                                                />
                                                <Text pr="10px" style={{lineHeight: '205px'}}>{tag}</Text>
                                            </Button>
                                        ))}
                                    </Group>
                                </Stack>
                            </Container>
                        )}
                        {activeStep === 2 && (
                            <Container mt={10} size="md" style={{padding: "25px"}}>
                                <Stack gap="sm" mt={10}>
                                    {beats.licensesTypes.slice().sort((a, b) => +a.id - +b.id).map((lt) => (
                                        <Group key={lt.id} justify="space-between">
                                            <NumberInput
                                                leftSection={<IconCurrencyDollar/>}
                                                label={lt.license_type}
                                                decimalScale={2}
                                                fixedDecimalScale
                                                defaultValue={50}
                                                allowNegative={false}
                                                placeholder="Enter price"
                                                value={licensePrices[+lt.id] || ''}
                                                radius="sm"
                                                size="lg"
                                                style={{flexGrow: 1}}
                                                onChange={(value) => handlePriceChange(+lt.id, +value)}
                                            />
                                        </Group>
                                    ))}
                                    <Checkbox checked={isFree}
                                              label="Can be free downloaded"
                                              onChange={(event) => setIsFree(event.currentTarget.checked)}/>
                                </Stack>
                            </Container>
                        )}
                    </StepsBeatCreating>
                    <Group justify="center">
                        <Group mt="xl" style={{
                            position: 'relative',
                            bottom: '20px',
                            width: '90%',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Button variant="default" onClick={prevStep} disabled={activeStep < 1}>Back</Button>
                            {activeStep === 3 ? (
                                <Button onClick={create} disabled={nextStepDisabled}>Finish</Button>
                            ) : (
                                <Button onClick={nextStep} disabled={nextStepDisabled}>Next step</Button>
                            )}
                        </Group>
                    </Group>
                    <LoadingOverlay visible={loadingOverlayVisible} zIndex={1000} overlayProps={{radius: 'sm', blur: 2}}
                                    loaderProps={{color: 'teal', type: 'bars'}}/>
                </>
            ) : (
                <Title order={1}>You are banned and can't upload beats</Title>
            )}
        </Container>
    );
});

export default CreateBeatPage;