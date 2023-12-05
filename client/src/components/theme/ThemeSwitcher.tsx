import React from 'react';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

function Demo() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const handleClick = () => {
        setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ActionIcon
            ml="5px"
            onClick={handleClick}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
            style={{ cursor: 'pointer' }}
        >
            {computedColorScheme === 'light' ? (
                <IconSun style={{ stroke: '0.5', color: 'black' }} />
            ) : (
                <IconMoon style={{ stroke: '0.5', color: 'white' }} />
            )}
        </ActionIcon>
    );
}

export default Demo;
