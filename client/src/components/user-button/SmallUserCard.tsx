import React, {FC, useEffect, useState} from 'react';
import {Avatar, Button, Modal, Stack, Group, Table, Text, Skeleton} from "@mantine/core";
import {UserDataProps} from "../../pages/usersPages/AllUsersPage";
import {blockUser, fetchAvatarFile, unblockUser} from "../../http/usersAPI";
import {jwtDecode} from "jwt-decode";
import {IconHandOff, IconHandStop, IconTrash} from "@tabler/icons-react";
import {deleteBeat} from "../../http/beatsAPI";
import {notifications} from "@mantine/notifications";
import {useDisclosure} from "@mantine/hooks";
import {useNavigate} from "react-router-dom";
import {USER_ROUTE} from "../../routes/consts";
import LinkComponent from "../router/LinkComponent";

interface UserCardProps extends UserDataProps {
    userToken: { id?: string, email?: string, role?: number }
}

const SmallUserCard: FC<UserCardProps> = ({id, username, email, avatar_url, is_banned, userToken}) => {
    const [avatar, setAvatar] = useState('')
    const [confirmationOpened, {open: openConfirmation, close: closeConfirmation}] = useDisclosure(false);
    const [imageLoading, setImageLoading] = useState(true)

    useEffect(() => {
        fetchAvatarFile(avatar_url).then(data => setAvatar(data))
    }, [avatar_url]);

    const handleBlock = async () => {
        try {
            await blockUser(id);
            closeConfirmation();
            window.location.reload();
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: `Failed to block user: ${err.response.data.message}`,
                color: 'red',
            });
        }
    };

    const handleUnblock = async () => {
        try {
            await unblockUser(id);
            closeConfirmation();
            window.location.reload();
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: `Failed to block user: ${err.response.data.message}`,
                color: 'red',
            });
        }
    }

    return (
        <>
            <Modal opened={confirmationOpened} onClose={closeConfirmation} title="Confirm Blocking" centered
                   miw="400px">
                <Stack align="center" w="100%">
                    <Text>Are you sure you want to block {username}?</Text>
                    <Group>
                        <Button onClick={handleBlock} color="red">
                            Yes, Block
                        </Button>
                        <Button onClick={closeConfirmation}>Cancel</Button>
                    </Group>
                </Stack>
            </Modal>

            <Table.Tr>
                <Table.Td w="5%">
                    <Skeleton visible={imageLoading} radius="xl">
                        <Avatar size="md" src={avatar} onLoad={() => setImageLoading(false)}/>
                    </Skeleton>
                </Table.Td>
                <Table.Td w="20%">
                    <Text lineClamp={1}>{email}</Text>
                </Table.Td>
                <Table.Td w="75%" align='center'>
                    <Group justify="space-between" wrap="nowrap">
                        <LinkComponent to={USER_ROUTE + `/${id}`} underline="never"
                                       style={{
                                           textDecoration: 'none'
                                       }}>
                            <Text lineClamp={1}>{username}</Text>
                        </LinkComponent>
                        {userToken && userToken.role === 2 && userToken.id !== id && (
                            <>
                                {!is_banned ? (
                                    <Button variant="light" style={{border: 0}} title="Block" size="md" radius="xl"
                                            pr="md"
                                            color="red"
                                            pl="md" onClick={openConfirmation}>
                                        <IconHandStop/>
                                    </Button>
                                ) : (
                                    <Button variant="light" style={{border: 0}} title="Unblock" size="md"
                                            radius="xl" pr="md"
                                            color="teal"
                                            pl="md" onClick={handleUnblock}>
                                        <IconHandOff/>
                                    </Button>
                                )}
                            </>

                        )}
                    </Group>
                </Table.Td>
            </Table.Tr>
        </>

    );
};

export default SmallUserCard;