import { BrowserRouter, Routes, Route } from "react-router-dom";
import FriendsView from "../views/FriendsView";
import LibraryView from "../views/LibraryView";
import SearchGamesView from "../views/SearchGamesView";
import SearchUsersView from "../views/SearchUsersView";
import GameView from "./GameView";
import MenuView from "./MenuView";
import Skeleton from './Skeleton';

const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/search_games" element={<Skeleton contenido={<SearchGamesView/>}/>}/>
                <Route path="/search_users" element={<Skeleton contenido={<SearchUsersView/>}/>}/>
                <Route path="/library" element={<Skeleton contenido={<LibraryView/>}/>}/>
                <Route path="/friends" element={<Skeleton contenido={<FriendsView/>}/>}/>
                <Route path="/game" element={<Skeleton contenido={<GameView/>}/>}/>
                <Route path="*" element={<Skeleton contenido={<MenuView/>}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router