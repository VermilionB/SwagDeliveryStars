import React from 'react';
import {Card, Center, Container, Group, Title} from "@mantine/core";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import {observer} from "mobx-react-lite";
import {useLocation} from "react-router-dom";
import {LOGIN_ROUTE} from "../routes/consts";


const AuthPage = observer(() => {
    const location = useLocation()
    const isLogin: boolean = location.pathname === LOGIN_ROUTE

    return (
        <div style={{width: '100%', paddingTop: "135px"}}>
            <Container size="xs" mb={20}>
                <Card shadow="sm" radius="lg" withBorder>
                    <Group justify="center" mb="20px">
                        <Title order={2}>{isLogin ? 'Sign In' : "Sign Up"}</Title>
                    </Group>
                    {isLogin ? <LoginPage/> : <RegistrationPage/>}
                </Card>
            </Container>
        </div>
    );
});

export default AuthPage;
