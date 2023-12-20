import React, {FC, useEffect, useState} from 'react';
import {Avatar, Card, Group, Rating, Stack, Text} from "@mantine/core";
import {fetchAvatarFile} from "../../http/usersAPI";
import {getRatingByUserAndBeat} from "../../http/commentsRatingsAPI";

export interface CommentComponentProps {
    comment: {
        users: {
            id: string
            username: string;
            avatar_url: string;
            role_id: number;
        },
        beat_id: string;
        comment: string;
    }
}

const CommentComponent: FC<CommentComponentProps> = ({comment}) => {
    const [avatar, setAvatar] = useState('')
    const [rating, setRating] = useState(0)

    useEffect(() => {
        fetchAvatarFile(comment.users.avatar_url).then(url => setAvatar(url))
        getRatingByUserAndBeat(comment.users.id, comment.beat_id).then(data => {
            if(data) setRating(data.rating)
        })
    }, [comment]);

    return (
        <Card w="100%" withBorder mt="sm" radius="lg">
            <Group justify="space-between">
                <Group>
                    <Avatar src={avatar}/>
                    <Stack style={{display: 'inline-block'}}>
                        <Text c="dimmed" size="sm">{comment.users.username} | {comment.users.role_id === 1 ? 'producer' : (comment.users.role_id === 2 ? 'admin' : '')}</Text>
                        <Text lineClamp={1}>{comment.comment}</Text>
                    </Stack>
                </Group>
                <Rating value={rating} color="indigo" readOnly/>
            </Group>
        </Card>
    );
};

export default CommentComponent;