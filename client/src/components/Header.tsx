import React, {useState, useEffect, useContext} from 'react';
import {Button, Container, Group, Image} from '@mantine/core';
import LinkComponent from './router/LinkComponent';
import {
    ABOUT_ROUTE,
    ALL_BEATS_ROUTE, ALL_USERS_ROUTE,
    CREATE_MEDIA_ROUTE,
    LOGIN_ROUTE,
    MAIN_ROUTE,
    ORDERS_ROUTE,
    SALES_ROUTE,
} from '../routes/consts';
import ThemeSwitcher from './theme/ThemeSwitcher';
import {observer} from 'mobx-react-lite';
import {Context} from '../index';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {fetchAvatarFile, getUserById, UserData} from '../http/usersAPI';
import UserMenu from "./user-button/UserMenu";
import logo from "../images/sdstars.svg";


const Header: React.FC = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [userToken, setUserToken] = useState<{ id?: string, email?: string }>({});
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [activeLink, setActiveLink] = useState('');
    const [avatar, setAvatar] = useState('')

    const handleLinkClick = (link: React.SetStateAction<string>) => {
        setActiveLink(link);
    };

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


    return (
        <div className="header-container">
            <Container
                fluid
                className="header-container"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                size="xl"
                h="75px"
            >

                <Container
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                    }}
                    size="xl"
                    h="75px"
                >
                    <Image src={logo} h={100}
                           w="170px"
                           fit="contain"/>

                    <Group style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '40%',
                        height: '75px',
                        margin: '0 auto'
                    }}>
                        <LinkComponent
                            to={MAIN_ROUTE}
                            onClick={() => handleLinkClick(MAIN_ROUTE)}
                            className="custom-link"
                            activeClassName="active"
                            size="lg"
                            underline="never"
                            style={{
                                color: 'teal',
                                textDecoration: 'none',
                            }}
                        >
                            Home
                        </LinkComponent>
                        <LinkComponent
                            to={ALL_BEATS_ROUTE}
                            onClick={() => handleLinkClick(ALL_BEATS_ROUTE)}
                            className="custom-link"
                            activeClassName="active"
                            size="lg"
                            underline="never"
                            style={{
                                color: 'teal',
                                textDecoration: 'none',
                            }}
                        >
                            Beats
                        </LinkComponent>
                        <LinkComponent
                            to={ALL_USERS_ROUTE}
                            onClick={() => handleLinkClick(ALL_USERS_ROUTE)}
                            className="custom-link"
                            activeClassName="active"
                            size="lg"
                            underline="never"
                            style={{
                                color: 'teal',
                                textDecoration: 'none',
                            }}
                        >
                            Producers
                        </LinkComponent>
                        <LinkComponent
                            to={ABOUT_ROUTE}
                            onClick={() => handleLinkClick(ABOUT_ROUTE)}
                            className="custom-link"
                            activeClassName="active"
                            size="lg"
                            underline="never"
                            style={{
                                color: 'teal',
                                textDecoration: 'none',
                            }}
                        >
                            About Us
                        </LinkComponent>
                    </Group>
                    {user.isAuth ? (
                        <Group>
                            <LinkComponent to={CREATE_MEDIA_ROUTE}
                                           className="custom-link"
                                           activeClassName="active"
                                           size="lg"
                                           underline="never"
                                           style={{color: 'indigo', textDecoration: 'none'}}>
                                <Button variant="filled" disabled={currentUser?.user.is_banned}>
                                    Create Media
                                </Button>
                            </LinkComponent>
                            <UserMenu image={avatar}
                                      name={currentUser?.user.username as string}
                                      email={userToken.email as string}
                            />
                        </Group>
                    ) : (
                        <Button variant="light"
                                ml='5px' onClick={() => navigate(LOGIN_ROUTE)}>Sign In</Button>
                    )}

                    <ThemeSwitcher/>

                </Container>
            </Container>
            <div style={{
                backgroundImage: 'linear-gradient(to right, teal , indigo)',
                height: '3px',
                marginTop: '78px'
            }}></div>
        </div>
    )
});

export default Header;
