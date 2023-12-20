import {Container, Stepper} from '@mantine/core';
import React, { ReactElement, Dispatch, SetStateAction } from 'react';

interface StepWrapperProps extends React.PropsWithChildren {
    activeStep: number;
    setActive: Dispatch<SetStateAction<number>>; // Используйте Dispatch и SetStateAction из React
    children: React.ReactNode;
}

const StepsBeatCreating: React.FC<StepWrapperProps> = ({ activeStep, setActive, children }) => {

    return (
        <>
            <Stepper active={activeStep} onStepClick={setActive} allowNextStepsSelect={false}>
                <Stepper.Step label="First step" description="Upload cover for your beat and audio files" >
                    {children}
                </Stepper.Step>
                <Stepper.Step label="Second step" description="Put the options and description for your beat" >
                    {children}
                </Stepper.Step>
                <Stepper.Step label="Final step" description="Describe licenses" >
                    {children}
                </Stepper.Step>
                <Stepper.Completed>
                    {children}
                </Stepper.Completed>
            </Stepper>
        </>
    );
};

export default StepsBeatCreating;