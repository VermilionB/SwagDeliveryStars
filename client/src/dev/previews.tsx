import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import RegistrationPage from "../pages/RegistrationPage";
import AuthPage from "../pages/AuthPage";
import AppRouter from "../components/router/AppRouter";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/RegistrationPage">
                <RegistrationPage/>
            </ComponentPreview>
            <ComponentPreview path="/AuthPage">
                <AuthPage/>
            </ComponentPreview>
            <ComponentPreview path="/AppRouter">
                <AppRouter/>
            </ComponentPreview>

        </Previews>
    );
};

export default ComponentPreviews;