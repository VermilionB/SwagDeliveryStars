import React, {useContext, useEffect, useState} from 'react';
import {Container, Stack} from "@mantine/core";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {fetchAvatarFile, findFollowed, getUserById, UserData} from "../../http/usersAPI";
import {jwtDecode} from "jwt-decode";
import SmallBeatCardComponent from "../../components/beats/SmallBeatCardComponent";

const MyMediaPage = observer(() => {
    const {beats} = useContext(Context);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});

    useEffect(() => {
        if (currentUser) {
            beats.setBeats(currentUser?.user.beats)
        }
    }, [currentUser]);


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

        fetchUser()
    }, [userToken]);

    return (
        <Container size="xl" style={{paddingTop: '95px', width: '100%'}}>
            <Stack style={{display: 'flex', width: '100%', flexDirection: 'column'}}>
                {beats.beats.map(beat => (
                    <SmallBeatCardComponent key={beat.id} beat={beat}/>
                ))}
            </Stack>
        </Container>
    );
});

export default MyMediaPage;