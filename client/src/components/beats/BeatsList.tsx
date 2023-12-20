import React from 'react';
import {Grid, Text} from "@mantine/core";
import {observer} from "mobx-react-lite";
import {BeatsInterface} from "../../store/beatStore";

import '../../App.css'
import BeatCardComponent from "./BeatCardComponent";

interface BeatsListProps {
    beats: BeatsInterface[]
}

const BeatsList: React.FC<BeatsListProps> = observer(({beats}) => {
    return (
        <Grid columns={6} miw="100%" mb="20px">
            {beats && beats.map(b => (
                <Grid.Col span={2} className="singleBeat">
                    <BeatCardComponent key={b.id} beat={b}/>
                </Grid.Col>
            ))}
        </Grid>
    );
});

export default BeatsList;