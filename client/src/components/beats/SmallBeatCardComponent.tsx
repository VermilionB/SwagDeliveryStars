import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {BeatsInterface, LicensesTypesInterface} from "../../store/beatStore";
import {
    Avatar,
    Button,
    Card,
    Group,
    Modal,
    Text,
    Stack,
    Textarea,
    TextInput,
    Checkbox,
    NumberInput,
    FileButton
} from "@mantine/core";
import {IconCurrencyDollar, IconEdit, IconTrash} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {getAllLicensesTypes} from "../../http/licensesAPI";
import {deleteBeat, updateBeat} from "../../http/beatsAPI";
import {notifications} from "@mantine/notifications";

interface SmallBeatCardComponentProps {
    beat: BeatsInterface,
}

const SmallBeatCardComponent: FC<SmallBeatCardComponentProps> = ({beat}) => {
    const [opened, {open, close}] = useDisclosure(false);
    const [confirmationOpened, {open: openConfirmation, close: closeConfirmation}] = useDisclosure(false); // Новый хук для второго модального окна

    const [description, setDescription] = useState(beat.description);
    const [title, setTitle] = useState(beat.name);

    const [file, setFile] = useState<File | null>();
    const [avatar, setAvatar] = useState(beat.image_url);

    const [isFree, setIsFree] = useState(beat.is_free);

    const [beatData, setBeatData] = useState<BeatsInterface>(beat);
    const [licensePrices, setLicensePrices] = useState<{ [key: number]: number }>({});
    const [licensesTypes, setLicensesTypes] = useState<LicensesTypesInterface[]>([]);
    const resetRef = useRef<() => void>(null);

    const clearFile = () => {
        setFile(null);
        setAvatar('');
        resetRef.current?.();
    };

    const onFileChange = (newFile: File | null) => {
        if (newFile) {
            setFile(newFile);
            setAvatar(URL.createObjectURL(newFile));
        } else {
            setFile(null);
            setAvatar('');
        }
    };

    useEffect(() => {
        getAllLicensesTypes().then((lt) => {
            setLicensesTypes(lt);

            const pricesMap: { [key: number]: number } = {};
            beat.licenses.forEach((license) => {
                pricesMap[license.license_type] = parseFloat(license.price);
            });

            setLicensePrices(pricesMap);
        });
    }, [beat.licenses]);

    const handlePriceChange = (licenseId: number, value: number) => {
        setLicensePrices((prevPrices) => ({...prevPrices, [licenseId]: value}));
    };

    const update = async () => {
        const boundary = 'blob_boundary_beat';
        const config = {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
        };
        const formData = new FormData();

        try {
            if (file) {
                formData.append(`image_file`, file);
            }
            formData.append('beatId', beat.id.toString());
            formData.append('name', title);
            formData.append('description', description);
            formData.append('isFree', isFree ? isFree.toString() : '');
            formData.append('licenses', JSON.stringify(licensePrices));

            const data = await updateBeat(formData, config);

            if (data) {
                setBeatData((prevBeat) => ({
                    ...prevBeat,
                    name: title,
                    description: description,
                    image_url: avatar || prevBeat.image_url,
                    is_free: isFree,
                }));
                close();
            }
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: `Failed to update beat: ${err.response.data.message}`,
                color: 'red',
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBeat(beat.id);
            closeConfirmation();
            window.location.reload();
        } catch (err: any) {
            notifications.show({
                title: 'Error',
                message: `Failed to delete beat: ${err.response.data.message}`,
                color: 'red',
            });
        }
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="Update beat" centered miw="400px">
                <Stack align="center" w="100%">
                    <Group justify="center" gap="sm">
                        {
                            avatar ? (
                                <Avatar src={avatar} alt="it's me" radius="xl" size="xl"/>
                            ) : (
                                <Avatar radius="xl" size="xl"/>
                            )
                        }
                    </Group>
                    <Group justify="center">
                        <FileButton resetRef={resetRef} onChange={onFileChange} accept="image/png,image/jpeg">
                            {(props) => <Button {...props} variant="outline" color="indigo">Upload image</Button>}
                        </FileButton>
                        <Button disabled={!avatar} color="red" variant="outline" onClick={clearFile}>
                            Reset
                        </Button>
                    </Group>
                    <TextInput label="Title"
                               placeholder="Enter title"
                               w="100%"
                               value={title}
                               radius="md"
                               style={{flexGrow: 1}} // add this
                               onChange={e => setTitle(e.target.value)}/>
                    <Textarea w="100%"
                              radius="md"
                              label="Description"
                              autosize
                              minRows={5}
                              value={description}
                              onChange={e => setDescription(e.target.value)}/>
                    <Stack w="100%">
                        {licensesTypes.sort((a, b) => +a.id - +b.id).map((lt) => (
                            <Group key={lt.id} justify="space-between">
                                <NumberInput
                                    leftSection={<IconCurrencyDollar/>}
                                    label={lt.license_type}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    defaultValue={50}
                                    allowNegative={false}
                                    placeholder="Enter price"
                                    value={licensePrices[+lt.id] || ''}
                                    radius="md"
                                    style={{flexGrow: 1}}
                                    onChange={(value) => handlePriceChange(+lt.id, +value)}
                                />
                            </Group>
                        ))}
                        <Checkbox checked={isFree}
                                  label="Can be free downloaded"
                                  onChange={(event) => setIsFree(event.currentTarget.checked)}/>

                        <Group>
                            <Button onClick={update}>Update beat</Button>
                        </Group>
                    </Stack>
                </Stack>
            </Modal>

            <Modal opened={confirmationOpened} onClose={closeConfirmation} title="Confirm Deletion" centered
                   miw="400px">
                <Stack align="center" w="100%">
                    <Text>Are you sure you want to delete this beat?</Text>
                    <Group>
                        <Button onClick={handleDelete} color="red">
                            Yes, Delete
                        </Button>
                        <Button onClick={closeConfirmation}>Cancel</Button>
                    </Group>
                </Stack>
            </Modal>

            <Card radius="md">
                <Group justify="space-between">
                    <Group justify="space-between" style={{flexGrow: 1}}>
                        <Group>
                            <Avatar size="md" src={beatData.image_url}/>
                            <Text>{beatData.name}</Text>
                        </Group>
                        {beatData.is_available ? (
                            <Text c="green">Available for profit</Text>
                        ) : (
                            <Text c="red">Not available for profit</Text>
                        )}
                    </Group>
                    <Group justify="space-between" w="35%">

                        <Group>
                            <Text c="dimmed">{beatData.bpm} Bpm</Text>
                            <Group><Text fw={500}>Genre:</Text> {beatData.genres.genre}</Group>
                        </Group>
                        <Group>
                            <Button variant="light" style={{border: 0}} title="Like" size="md" radius="xl" pr="md"
                                    color="indigo"
                                    pl="md" onClick={open}>
                                <IconEdit/>
                            </Button>
                            <Button variant="light" style={{border: 0}} title="Like" size="md" radius="xl" pr="md"
                                    color="red"
                                    pl="md" onClick={openConfirmation}>
                                <IconTrash/>
                            </Button>
                        </Group>
                    </Group>
                </Group>
            </Card>

        </>

    );
};

export default SmallBeatCardComponent;