import React, {useState, useEffect, useRef} from "react";
import Wavesurfer from "wavesurfer.js";
import {IconPlayerPause, IconPlayerPlay} from "@tabler/icons-react";
import {Button, Flex, Group, Loader, Skeleton, UnstyledButton} from "@mantine/core";
import {playBeat} from "../../http/beatsAPI";

const Waveform = ({audio, beat, user}) => {
    const waveform = useRef(null);

    const [isPlaying, setIsPlaying] = useState(true)
    const [playDisabled, setPlayDisabled] = useState(true)

    useEffect(() => {
        // Check if wavesurfer object is already created.
        if (!waveform.current) {
            // Create a wavesurfer object
            // More info about options here https://wavesurfer-js.org/docs/options.html
            waveform.current = Wavesurfer.create({
                container: "#waveform",
                progressColor: "#567FFF",
                barGap: 2,
                barWidth: 1,
                barRadius: 1,
                cursorWidth: 2,
                barHeight: 0.7,
                responsive: true,
                cursorColor: "#567FFF",
                height: 70,

                // renderFunction: (channels, ctx) => {
                //     const { width, height } = ctx.canvas
                //     const scale = channels[0].length / width
                //     const step = 5
                //
                //     ctx.translate(0, height / 2)
                //     ctx.strokeStyle = ctx.fillStyle
                //     ctx.beginPath()
                //
                //     for (let i = 0; i < width; i += step * 2) {
                //         const index = Math.floor(i * scale)
                //         const value = Math.abs(channels[0][index])
                //         let x = i
                //         let y = value * height
                //
                //         ctx.moveTo(x, 0)
                //         ctx.lineTo(x, y)
                //         ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true)
                //         ctx.lineTo(x + step, 0)
                //
                //         x = x + step
                //         y = -y
                //         ctx.moveTo(x, 0)
                //         ctx.lineTo(x, y)
                //         ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false)
                //         ctx.lineTo(x + step, 0)
                //     }
                //
                //     ctx.stroke()
                //     ctx.closePath()
                // }


            });

            // Load audio from a remote url.
            waveform.current.load(audio);
            /* To load a local audio file
                  1. Read the audio file as a array buffer.
                  2. Create a blob from the array buffer
                  3. Load the audio using wavesurfer's loadBlob API
           */
            waveform.current.on('ready', () => {
                setPlayDisabled(false)
            })

        }
    }, []);


    const playAudio = () => {
        if(user) {
            playBeat(beat)
        }
        // Check if the audio is already playing
        if (waveform.current.isPlaying()) {
            setIsPlaying(true)
            waveform.current.pause();
        } else {
            setIsPlaying(false)
            waveform.current.play();
        }
    };

    return (
        <Skeleton radius="xl" height="75px" visible={playDisabled}>
            <Group w="100%" align="center">
                <Button onClick={playAudio} variant="default" disabled={playDisabled} style={{border: 0}}
                        title="PLay/pause" size="lg"
                        radius="xl" pr="md" pl="md">
                    {isPlaying ? <IconPlayerPlay/> : <IconPlayerPause/>}
                </Button>
                <div id="waveform" style={{flexGrow: 1}}/>
            </Group>
        </Skeleton>
    );
};

export default Waveform;
