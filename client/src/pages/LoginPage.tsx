import React, {useContext, useState} from 'react';
import {Button, Group, TextInput, Text, Alert} from "@mantine/core";
import {IconAt, IconExclamationCircle, IconLock, IconUser} from "@tabler/icons-react";
import { useNavigate} from "react-router-dom";
import {MAIN_ROUTE, REGISTRATION_ROUTE} from "../routes/consts";
import LinkComponent from "../components/router/LinkComponent";
import {login} from "../http/usersAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const LoginPage = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isLoginClicked, setIsLoginClicked] = useState(false);
    const onLogin = async () => {
        setIsLoginClicked(true)

        if (!email || !password) {
            setAlertMessage('Please enter all the required data to register.');
            setShowAlert(true);
            return;
        }
        try {
            setAlertMessage('')
            setShowAlert(false)
        } catch (err: any) {
            setAlertMessage(err.message)
            setShowAlert(true)
        }
        const data = await login(email, password)
        if(data){
            user.setUser(data);
            user.setIsAuth(true);
            navigate(MAIN_ROUTE);
        }
    }
    const closeError = () => {
        setAlertMessage('')
        setShowAlert(false)
        setIsLoginClicked(false)
    }


    return (
        <>
            {showAlert && (
                <Alert radius="md" title="Error" color="red" icon={<IconExclamationCircle/>} withCloseButton onClick={closeError}>
                    {alertMessage}
                </Alert>
            )}
            <Group gap="sm" style={{display: 'flex', flexDirection: 'column', padding: '0'}}>
                <TextInput w="80%" placeholder="Enter your email"
                           label="Email"
                           error={isLoginClicked && !email ? 'Email is required' : ''}
                           inputWrapperOrder={['label', 'input', 'error']}
                           value={email}
                           radius="md"
                           leftSection={<IconAt size={16}/>}
                           onChange={e => setEmail(e.target.value)}/>
                <TextInput w="80%" placeholder="Enter your password"
                           label="Password"
                           error={isLoginClicked && !password ? 'Password is required' : ''}
                           inputWrapperOrder={['label', 'input', 'error']}
                           radius="md" type='password'
                           leftSection={<IconLock size={16}/>} value={password}
                           onChange={e => setPassword(e.target.value)}/>
                <Group justify="space-between" w="80%">
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text size="sm">No account?</Text>
                        <LinkComponent to={REGISTRATION_ROUTE} size="sm" underline="hover"
                                       style={{color: 'indigo', textDecoration: 'none', marginLeft: '5px'}}>
                            Sign Up!
                        </LinkComponent>
                    </div>
                    <Button variant="outline" color="indigo" onClick={onLogin}>
                        Login
                    </Button>
                </Group>
            </Group>
        </>

    );
});

export default LoginPage;