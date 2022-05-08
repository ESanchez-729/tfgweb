import { BrowserRouter, Routes, Route } from "react-router-dom";
import Skeleton from './Skeleton';

const Router = () => {

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/search-page" element={<Skeleton contenido={<h1>Search</h1>}/>}/>
                <Route path="*" element={<Skeleton contenido={<div></div>}/>}/>
            </Routes>
        </BrowserRouter>

    )
}

export default Router