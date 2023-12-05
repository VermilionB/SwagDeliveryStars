import {
    ADMIN_ROUTE, ALL_BEATS_ROUTE, CREATE_MEDIA_ROUTE,
    LOGIN_ROUTE, MAIN_ROUTE,
    ORDERS_ROUTE,
    REGISTRATION_ROUTE, SALES_ROUTE,
    USER_ROUTE
} from "./consts";

import MainPage from "../pages/MainPage";
import AuthPage from "../pages/AuthPage";
import UserPage from "../pages/usersPages/UserPage";
import CreateBeatPage from "../pages/CreateBeatPage";
import AllBeatsPage from "../pages/beatsPages/AllBeatsPage";
import SelectedBeatPage from "../pages/beatsPages/SelectedBeatPage";
import SalesPage from "../pages/SalesPage";
import OrdersPage from "../pages/OrdersPage";


export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: MainPage
    },
    {
        path: ALL_BEATS_ROUTE,
        Component: AllBeatsPage
    },
    {
        path: LOGIN_ROUTE,
        Component: AuthPage
    },
    {
        path: REGISTRATION_ROUTE,
        Component: AuthPage
    },

    {
        path: ALL_BEATS_ROUTE + '/:id',
        Component: SelectedBeatPage
    },
    {
        path: USER_ROUTE + '/:userId',
        Component: UserPage
    },
]

export const authRoutes = [
    {
        path: SALES_ROUTE,
        Component: SalesPage
    },
    {
        path: ORDERS_ROUTE,
        Component: OrdersPage
    },
    {
        path: CREATE_MEDIA_ROUTE,
        Component: CreateBeatPage
    }
    // {
    //     path: ADMIN_ROUTE,
    //     Component: AdminPage
    // },
    // {
    //     path: USER_ROUTE,
    //     Component: UserPage
    // },
    // {
    //     path: CHAT_ROUTE,
    //     Component: Chat
    // }
]