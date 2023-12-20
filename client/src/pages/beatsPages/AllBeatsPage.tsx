import React, {useContext, useEffect, useState} from 'react';
import {
    Button, Card, Checkbox, CheckIcon,
    Container, Flex, Group, Loader, NumberInput, Pagination, Radio, Text, TextInput,
} from "@mantine/core";
import {observer} from "mobx-react-lite";

import BeatsList from "../../components/beats/BeatsList";
import {allBeatsCount, getAllBeats} from "../../http/beatsAPI";
import {Context} from "../../index";
import {IconMinus, IconSearch} from "@tabler/icons-react";
import {SegmentedSwitch} from "../../components/beats/SegmentedSwitch";

const AllBeatsPage = observer(() => {
    const {beats} = useContext(Context)

    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)

    const [priceFrom, setPriceFrom] = useState(0.00)
    const [priceTo, setPriceTo] = useState(0.00)

    const [radioFreeDownloaded, setRadioFreeDownloaded] = useState('')
    const pageSize = 6;

    useEffect(() => {
        const fetchData = async () => {
            const beatsData = await getAllBeats(currentPage, pageSize);
            await beats.setBeats(beatsData);

            const countData = await allBeatsCount(searchValue);
            const calculatedTotalPages = Math.ceil(+countData.data / pageSize);
            setTotalPages(calculatedTotalPages);
        };

        fetchData();
    }, [beats, currentPage, searchValue]);

    useEffect(() => {
        if (searchValue.length === 0) {
            getAllBeats(currentPage, pageSize, searchValue, priceFrom, priceTo, radioFreeDownloaded).then(data => beats.setBeats(data))
            allBeatsCount(searchValue, priceFrom, priceTo, radioFreeDownloaded).then(countData => {
                setTotalPages(Math.ceil(+countData.data / pageSize))
            })
        }
    }, [beats, currentPage, searchValue]);

    const search = async () => {
        getAllBeats(currentPage, pageSize, searchValue).then(data => beats.setBeats(data))
        allBeatsCount(searchValue).then(countData => {
            setTotalPages(Math.ceil(+countData.data / pageSize))
        })
    }

    const filter = async () => {
        const beatsData = await getAllBeats(currentPage, pageSize, searchValue, priceFrom, priceTo, radioFreeDownloaded);
        await beats.setBeats(beatsData);

        const countData = await allBeatsCount('', priceFrom, priceTo, radioFreeDownloaded);
        const calculatedTotalPages = Math.ceil(+countData.data / pageSize);
        setTotalPages(calculatedTotalPages);

    }


    return (
        <Container size="xl" style={{marginTop: '95px', width: '100%'}}>
            <Group mb="20px">
                <TextInput
                    placeholder="Search by beat name"
                    leftSection={<IconSearch/>}
                    value={searchValue}
                    radius="md"
                    size="md"
                    style={{flexGrow: 1}} // add this
                    onChange={e => setSearchValue(e.target.value)}/>
                <Button variant="light" size="md" radius="md" color="indigo" style={{display: 'inline-block'}}
                        onClick={search}>Search</Button>
            </Group>

            <Container w="100%" style={{display: 'flex', flexDirection: 'row'}} fluid p={0}>
                <Container w="25%" fluid p={0} pr="20px">
                    <Card withBorder shadow="sm" radius="md">
                        <Text size="sm" fw={800} mb="5px">Price</Text>
                        <Group w="100%" mb="20px" gap="xs">
                            <NumberInput
                                hideControls={true}
                                placeholder="from"
                                decimalScale={2}
                                fixedDecimalScale
                                style={{flexBasis: '48%'}}
                                value={priceFrom}
                                onChange={(value) => setPriceFrom(+value)}
                            />
                            <NumberInput
                                hideControls={true}
                                placeholder="to"
                                decimalScale={2}
                                fixedDecimalScale
                                style={{flexBasis: '48%'}}
                                value={priceTo}
                                onChange={(value) => setPriceTo(+value)}
                            />
                        </Group>

                        <Text size="sm" fw={800} mb="5px">Can be free downloaded</Text>
                        <SegmentedSwitch onChange={setRadioFreeDownloaded}/>

                        <Button mt="20px" variant="light" radius="md" color="indigo" onClick={filter}>Filter</Button>
                    </Card>
                </Container>

                <Container w="75%" fluid p={0}>
                    {!beats.beats.length && (
                        <Text style={{textAlign: "center"}} size="lg" fw={800}>No beats found</Text>
                    )}
                    <BeatsList beats={beats.beats}/>
                </Container>
            </Container>

            <Group w="100%" justify="flex-end" mb="10px">
                <Pagination value={currentPage} onChange={setCurrentPage} total={!totalPages ? 1 : totalPages}/>
            </Group>

        </Container>
    );
});

export default AllBeatsPage;
