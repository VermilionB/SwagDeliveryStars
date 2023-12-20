import React, {useEffect, useState} from 'react';
import {Container, Stack, Group, Table} from "@mantine/core";
import {getAllUsers} from "../../http/usersAPI";
import SmallUserCard from "../../components/user-button/SmallUserCard";
import {Button, TextInput} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";
import {jwtDecode} from "jwt-decode";

export interface UserDataProps {
    id: string,
    email: string,
    avatar_url: string,
    username: string,
    is_banned: boolean
}

const AllUsersPage = () => {
    const [users, setUsers] = useState<UserDataProps[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [userToken, setUserToken] = useState<{ id?: string, email?: string, role?: number }>({});

    useEffect(() => {
        if(userToken) {
            getAllUsers(searchValue, userToken.id).then(data => setUsers(data))
        }
        else getAllUsers(searchValue).then((data => setUsers(data)))
    }, [userToken]);

    const search = async () => {
        if(userToken) {
            getAllUsers(searchValue, userToken.id).then(data => setUsers(data))
        }
        else getAllUsers(searchValue).then((data => setUsers(data)))
    }

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

    return (
        <Container size="xl" style={{marginTop: '95px', width: '100%'}}>
            <Group mb="20px">
                <TextInput
                    placeholder="Search by username"
                    leftSection={<IconSearch/>}
                    value={searchValue}
                    radius="md"
                    size="md"
                    style={{flexGrow: 1}} // add this
                    onChange={e => setSearchValue(e.target.value)}/>
                <Button variant="light" size="md" radius="md" color="indigo" style={{display: 'inline-block'}}
                        onClick={search}>Search</Button>
            </Group>
            <Table highlightOnHover striped withRowBorders={false} verticalSpacing="md">
                {users.map(user => (
                    <SmallUserCard email={user.email} avatar_url={user.avatar_url} username={user.username} id={user.id} is_banned={user.is_banned} userToken={userToken}/>
                ))}
            </Table>


        </Container>
    );
};

export default AllUsersPage;