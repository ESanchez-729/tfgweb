import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchView from "../views/SearchView";
import Skeleton from './Skeleton';

const Router = () => {

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/search-page" element={<Skeleton contenido={<SearchView/>}/>}/>
                <Route path="*" element={<Skeleton contenido={<div></div>}/>}/>
            </Routes>
        </BrowserRouter>

    )
}

export default Router