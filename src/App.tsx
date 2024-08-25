import React, {useEffect, useState} from 'react'
import './index.css'
import {Navbar} from "./components/Navbar/Navbar.tsx";
import {Main} from "./pages/Main/Main.tsx";
import {Footer} from "./components/Footer/Footer.tsx";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {Sidebar} from "./components/Sidebar/Sidebar.tsx";
import {Profile} from "./pages/Profile/Profile.tsx";
import {MyHeadquarters} from "./pages/Headquarters/MyHeadquarters.tsx";
import {RegionalTeam} from "./pages/RegionalTeam/RegionalTeam.tsx";

function App() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
        <Navbar onMenuClick={() => setIsMenuOpen(prev => !prev)}/>
        <div className={"flex h-full md:bg-[#F6F8FC]"}>
            {location.pathname !== "/" && <Sidebar isOpenMenu={isMenuOpen} onMenuClick={() => setIsMenuOpen(prev => !prev)}/>}
            <Routes>
                <Route element={<Main/>} path={"/"}/>
                <Route element={<Profile/>} path={"/profile"}/>
                <Route element={<MyHeadquarters/>} path={"/my_headquarters"}/>
                <Route element={<RegionalTeam/>} path={"/regional_team"}/>
            </Routes>
        </div>
        {location.pathname === "/" && <Footer/>}
    </>
  )
}

export default App
