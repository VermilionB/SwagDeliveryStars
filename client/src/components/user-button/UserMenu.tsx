import React, {useContext} from 'react';
import {
    IconArrowsLeftRight,
    IconBrandTiktok,
    IconChartHistogram,
    IconChevronRight, IconLogout,
    IconSettings, IconShoppingCart, IconShoppingCartShare, IconTrash,
    IconUser
} from '@tabler/icons-react';
import {Group, Avatar, Text, Menu, UnstyledButton, Button} from '@mantine/core';
import UserButton from "./UserButton";
import LinkComponent from "../router/LinkComponent";
import {MAIN_ROUTE, MY_MEDIA_ROUTE, MY_STATS_ROUTE, ORDERS_ROUTE, SALES_ROUTE, USER_ROUTE} from "../../routes/consts";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface UserMenuProps extends React.ComponentPropsWithoutRef<'button'> {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
}

const UserMenu: React.FC<UserMenuProps> = observer(({image, name, email}) => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuth(false);
        navigate(MAIN_ROUTE);
    };

    const userToken: string | null = localStorage.getItem('token');
    const userId = userToken ? (jwtDecode(userToken) as { id: string }) : null;

    return (
        <Menu withArrow>
            <Menu.Target>
                <UserButton
                    image={image}
                    name={name}
                    email={email}
                />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Profile</Menu.Label>
                <LinkComponent
                    to={USER_ROUTE + `/${userId?.id || ''}`}
                    underline="never"
                    style={{textDecoration: 'none'}}
                >
                    <Menu.Item
                        leftSection={<IconUser/>}
                        component="a"
                        target="_blank"
                    >
                        My profile
                    </Menu.Item>
                </LinkComponent>
                <LinkComponent to={MY_STATS_ROUTE} underline="never"
                               style={{textDecoration: 'none'}}
                >
                    <Menu.Item
                        leftSection={<IconChartHistogram/>}
                        component="a"
                        target="_blank"
                    >
                        My statistics
                    </Menu.Item>
                </LinkComponent>
                <LinkComponent to={MY_MEDIA_ROUTE} underline="never"
                               style={{textDecoration: 'none'}}
                >
                    <Menu.Item
                        leftSection={<IconBrandTiktok/>}
                        component="a"
                        target="_blank"
                    >
                        My media
                    </Menu.Item>
                </LinkComponent>

                <Menu.Divider/>
                <Menu.Label>Management</Menu.Label>
                <LinkComponent to={ORDERS_ROUTE} underline="never"
                               style={{textDecoration: 'none'}}>
                    <Menu.Item
                        leftSection={<IconArrowsLeftRight/>}
                    >
                        Order history
                    </Menu.Item>
                </LinkComponent>

                <LinkComponent to={SALES_ROUTE} underline="never"
                               style={{textDecoration: 'none'}}>
                    <Menu.Item
                        leftSection={<IconShoppingCartShare/>}
                    >
                        Sales history
                    </Menu.Item>
                </LinkComponent>

                <Menu.Divider/>
                {/*<Menu.Label>Danger zone</Menu.Label>*/}

                {user.isAuth &&
                    <Menu.Item
                        color="red"
                        leftSection={<IconLogout/>}
                        onClick={() => logOut()}
                    >
                        Log Out
                    </Menu.Item>
                }

            </Menu.Dropdown>
        </Menu>
    );
});

export default UserMenu;