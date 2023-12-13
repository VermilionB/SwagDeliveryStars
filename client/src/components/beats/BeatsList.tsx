import React, {useContext, useEffect, useState} from 'react';
import {Grid} from "@mantine/core";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {BeatsInterface} from "../../store/beatStore";

import '../../App.css'
import BeatCardComponent from "./BeatCardComponent";

interface BeatsListProps {
    searchValue: string
}

const BeatsList: React.FC<BeatsListProps> = observer(({searchValue}) => {
    const {beats} = useContext(Context);

    const [filteredBeats, setFilteredBeats] = useState<BeatsInterface[]>();

    useEffect(() => {
        const filtered = beats.beats.filter(b => b.name.toLowerCase().includes(searchValue.toLowerCase()));
        console.log(filtered)
        setFilteredBeats(filtered);
    }, [searchValue, beats.beats])

    return (
        <Grid columns={10} miw="100%" mb="20px">
            {filteredBeats && filteredBeats.map(b => (
                <Grid.Col span={2} className="singleBeat">
                    <BeatCardComponent key={b.id} beat={b}/>
                </Grid.Col>
            ))}
        </Grid>
    );
});

export default BeatsList;