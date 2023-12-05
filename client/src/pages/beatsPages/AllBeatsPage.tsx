import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Container, Flex, Group, Loader, Pagination, TextInput,
} from "@mantine/core";
import {observer} from "mobx-react-lite";

import BeatsList from "../../components/beats/BeatsList";
import {allBeatsCount, getAllBeats} from "../../http/beatsAPI";
import {Context} from "../../index";
import {IconSearch} from "@tabler/icons-react";

const AllBeatsPage = observer(() => {
    const {beats} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true);

    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            const beatsData = await getAllBeats(currentPage, pageSize);
            await beats.setBeats(beatsData);

            const countData = await allBeatsCount();
            console.log(countData);

            const calculatedTotalPages = Math.ceil(+countData.data / pageSize);
            setTotalPages(calculatedTotalPages);
            console.log(calculatedTotalPages);

            if (beats.beats) setIsLoading(false);
        };

        fetchData();
    }, [currentPage]);



    if (isLoading || !totalPages) {
        return (
            <Flex
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: window.screen.height - 154,
                }}
            >
                <Loader color="blue" type="bars"/>
            </Flex>
        );
    }


    return (
        <Container size="xl" style={{marginTop: '95px', width: '100%'}}>
            <TextInput label="Search"
                       placeholder="Search by beat name"
                       leftSection={<IconSearch/>}
                       value={searchValue}
                       radius="sm"
                       size="lg"
                       style={{flexGrow: 1, width: '100%', marginBottom: '20px'}} // add this
                       onChange={e => setSearchValue(e.target.value)}/>

            <BeatsList searchValue={searchValue}/>
            <Group w="100%" justify="center" mb="10px">
                <Pagination value={currentPage} onChange={setCurrentPage} total={!totalPages ? 1 : totalPages}/>
            </Group>

        </Container>
    );
});

export default AllBeatsPage;
