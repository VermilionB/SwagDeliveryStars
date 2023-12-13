import React, {FC, useEffect, useState} from 'react';
import {Avatar, Card, Flex, Group, Stack, Text} from "@mantine/core";
import {fetchAvatarFile} from "../../http/usersAPI";

export interface CommentComponentProps {
    comment: {
        users: {
            username: string;
            avatar_url: string;
        },
        comment: string;
    }
}

const CommentComponent: FC<CommentComponentProps> = ({comment}) => {
    const [avatar, setAvatar] = useState()
    useEffect(() => {
        fetchAvatarFile(comment.users.avatar_url).then(url => setAvatar(url))
    }, [comment]);


    return (
        <Card w="100%" withBorder mb="sm">
            <Group>
                <Avatar src={avatar}/>
                <Stack style={{display: 'inline-block'}}>
                    <Text size="sm">{comment.users.username}</Text>
                    <Text>{comment.comment}</Text>
                </Stack>
            </Group>
        </Card>
    );
};

export default CommentComponent;