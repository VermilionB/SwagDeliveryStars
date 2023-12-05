import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/router/AppRouter";
import Header from './components/Header';
import {Container, Flex, Loader} from '@mantine/core';
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/usersAPI";
import Footer from "./components/Footer";

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        check().then(data => {
            user.setUser(true)
            user.setIsAuth(true)
        }).catch(err => {
            console.error(err)
        }).finally(() => setLoading(false))
    }, [])

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
        <BrowserRouter>
            <div id="node">
                <Header/>
                <div className="main">
                    <AppRouter/>
                </div>
                <Footer/>
            </div>
        </BrowserRouter>
    );
});

export default App;
