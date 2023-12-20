import React, {FC, useState} from 'react';
import {ALL_BEATS_ROUTE} from "../../routes/consts";
import {Badge, Card, Group, Image, Skeleton, Stack, Text} from "@mantine/core";
import {IconBrandShopee, IconDownload, IconPointFilled} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {BeatsInterface} from "../../store/beatStore";

interface BeatCardComponentProps {
    beat: BeatsInterface
}

const BeatCardComponent: FC<BeatCardComponentProps> = ({beat}) => {
    const navigate = useNavigate()
    const [imageLoading, setImageLoading] = useState(true)

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{flexGrow: 1, cursor: 'pointer'}}
              miw="200px" onClick={() => navigate(ALL_BEATS_ROUTE + '/' + beat.id)}>
            <Card.Section>
                <Skeleton radius="lg" height="100%" visible={imageLoading}>
                    <Image src={beat.image_url} onLoad={() => setImageLoading(false)} alt="No image"/>
                </Skeleton>
            </Card.Section>
            <Card.Section p="lg">
                <Stack gap="xs">
                    <Group>
                        <Badge leftSection={<IconBrandShopee/>}
                               variant="gradient"
                               style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                               color="indigo"
                               size="lg"
                        >
                            <Text>{beat.licenses.filter(l => l.license_type === 1)[0].price}</Text>
                        </Badge>
                        <IconPointFilled size="10px"/>
                        <Text c="dimmed">{beat.bpm} Bpm</Text>
                    </Group>
                    <Group justify="space-between" style={{flexWrap: 'nowrap'}}>
                        <Text fw={900} lineClamp={1}>{beat.name}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text c="dimmed">{beat.users.username}</Text>
                        {beat.is_free && (
                            <Badge leftSection={<IconDownload/>}
                                   variant="gradient"
                                   style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                                   color="teal"
                                   size="lg">Is Free</Badge>
                        )}
                    </Group>
                </Stack>

            </Card.Section>
        </Card>
    );
};

export default BeatCardComponent;