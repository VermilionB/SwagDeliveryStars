import {
    ThemeIcon,
    SegmentedControl,
    SegmentedControlItem,
    SegmentedControlProps
} from "@mantine/core";

import { IconX, IconCheck } from "@tabler/icons-react";

const data: SegmentedControlItem[] = [
    {
        value: "false",
        label: (
            <ThemeIcon variant="light" radius="xl" color="red">
                <IconX />
            </ThemeIcon>
        )
    },
    {
        value: "",
        label: (
            <ThemeIcon variant="subtle">
                <div />
            </ThemeIcon>
        )
    },
    {
        value: "true",
        label: (
            <ThemeIcon variant="light" radius="xl" color="green">
                <IconCheck />
            </ThemeIcon>
        )
    }
];

export function SegmentedSwitch(props: Omit<SegmentedControlProps, "data">) {
    return <SegmentedControl data={data} defaultValue="" radius="xl" {...props} />;
}