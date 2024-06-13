import React, {useContext, useRef, useState} from 'react';
import {
    Alert,
    Avatar,
    Button,
    CloseButton,
    FileButton,
    Flex,
    Group,
    Input,
    Loader,
    Text,
    TextInput
} from "@mantine/core";
import {IconAt, IconExclamationCircle, IconLock, IconUser} from '@tabler/icons-react';
import {ALL_BEATS_ROUTE, LOGIN_ROUTE, MAIN_ROUTE} from "../routes/consts";
import LinkComponent from "../components/router/LinkComponent";
import {registration} from "../http/usersAPI";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {notifications} from "@mantine/notifications";

const RegistrationPage = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [file, setFile] = useState<File | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isRegisterClicked, setIsRegisterClicked] = useState(false);

    const resetRef = useRef<() => void>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [username, setUsername] = useState('')
    const clearFile = () => {
        setFile(null);
        setImageURL(null);
        resetRef.current?.();
    };
    const onFileChange = (newFile: File | null) => {
        if (newFile) {
            setFile(newFile);
            setImageURL(URL.createObjectURL(newFile));
        } else {
            setFile(null);
            setImageURL(null);
        }
    };

    const onRegister = async () => {
        setIsRegisterClicked(true);

        if (!email || !password || !username) {
            setAlertMessage('Please enter all the required data to register.');
            setShowAlert(true);
            return;
        }

        if(email.length > 40 || email.length < 5) {
            setAlertMessage('Email length is invalid (min length is 5 and max length is 50 symbols')
            setShowAlert(true);
            return;
        }

        if(password !== confirmedPassword) {
            setAlertMessage('Passwords don\'\t match')
            setShowAlert(true);
            return;
        }

        if(username.length > 40 || username.length < 5) {
            setAlertMessage('Username length is invalid (min length is 5 and max length is 50 symbols')
            setShowAlert(true);
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
            if(file) {
                formData.append(`file`, file);
            }
            formData.append('email', email);
            formData.append('password', password);
            formData.append('username', username);


            const data = await registration(formData, config);

            if(data){
                user.setUser(data);
                user.setIsAuth(true);
                navigate(ALL_BEATS_ROUTE);
            }

        }catch (err: any) {
            console.log(err.response.data.message)
            notifications.show({
                title: 'Error',
                message: `Failed to register: ${err.response.data.message}`,
                color: 'red',
            });
        }
        setAlertMessage('')
        setShowAlert(false)
    }

    const closeError = () => {
        setAlertMessage('')
        setShowAlert(false)
        setIsRegisterClicked(false)
    }


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
        <>
            {showAlert && (
                <Alert radius="md" title="Error" color="red" icon={<IconExclamationCircle/>} withCloseButton onClick={closeError}>
                    {alertMessage}
                </Alert>
            )}
                <Group gap="sm" style={{display: 'flex', flexDirection: 'column', padding: '0', marginTop: '10px'}}>
                    <Group justify="center" gap="sm">
                        {
                            imageURL ? (
                                <Avatar src={imageURL} alt="it's me" radius="xl" size="xl"/>
                            ) : (
                                <Avatar radius="xl" size="xl"/>
                            )
                        }
                    </Group>
                    <Group justify="center">
                        <FileButton resetRef={resetRef} onChange={onFileChange} accept="image/png,image/jpeg">
                            {(props) => <Button {...props} variant="outline" color="indigo">Upload image</Button>}
                        </FileButton>
                        <Button disabled={!file} color="red" variant="outline" onClick={clearFile}>
                            Reset
                        </Button>
                    </Group>
                    <TextInput w="80%" placeholder="Enter your email"
                               label="Email"
                               error={isRegisterClicked && !email ? 'Email is required' : ''}
                               inputWrapperOrder={['label', 'input', 'error']}
                               value={email}
                               radius="md"
                               leftSection={<IconAt size={16}/>}
                               onChange={e => setEmail(e.target.value)}/>
                    <TextInput w="80%" placeholder="Enter your password"
                               label="Password"
                               error={isRegisterClicked && !password ? 'Password is required' : ''}
                               inputWrapperOrder={['label', 'input', 'error']}
                               radius="md" type='password'
                               leftSection={<IconLock size={16}/>} value={password}
                               onChange={e => setPassword(e.target.value)}/>
                    <TextInput w="80%" placeholder="Confirm your password"
                               label="Confirm your password"
                               error={isRegisterClicked && !confirmedPassword ? 'Confirm your password' : ''}
                               inputWrapperOrder={['label', 'input', 'error']}
                               radius="md" type='password'
                               leftSection={<IconLock size={16}/>} value={confirmedPassword}
                               onChange={e => setConfirmedPassword(e.target.value)}/>
                    <TextInput w="80%" placeholder="Enter your username"
                               label="Username"
                               error={isRegisterClicked && !username ? 'Username is required' : ''}
                               inputWrapperOrder={['label', 'input', 'error']}
                               radius="md"
                               leftSection={<IconUser size={16}/>} value={username}
                               onChange={e => setUsername(e.target.value)}/>
                    <Group justify="space-between" w="80%">
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text size="sm">Already have an account?</Text>
                            <LinkComponent to={LOGIN_ROUTE} size="sm" underline="hover"
                                           style={{color: 'indigo', textDecoration: 'none', marginLeft: '5px'}}>
                                Sign In!
                            </LinkComponent>
                        </div>
                        <Button variant="outline" color="indigo" onClick={onRegister}>
                            Register
                        </Button>
                    </Group>
                </Group>
        </>

    );
});

export default RegistrationPage;
