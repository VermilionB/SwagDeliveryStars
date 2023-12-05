import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import App from './App';
import {MantineProvider} from '@mantine/core';
import UserStore from './store/userStore';
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import '@mantine/carousel/styles.css';
import BeatStore from "./store/beatStore";
import OrdersStore from "./store/orderStore";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

interface AppContextType {
    user: UserStore;
    beats: BeatStore;
    orders: OrdersStore;
}

export const Context = createContext<AppContextType>({
    user: new UserStore(),
    beats: new BeatStore(),
    orders: new OrdersStore()
});

root.render(
    <React.StrictMode>
        <Context.Provider value={{
            user: new UserStore(),
            beats: new BeatStore(),
            orders: new OrdersStore()
        }}>
            <MantineProvider defaultColorScheme="dark">
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </MantineProvider>
        </Context.Provider>
    </React.StrictMode>
);
