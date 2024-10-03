import {useState} from 'react'
import './index.css'
import {Navbar} from "./components/Navbar/Navbar.tsx";
import {Main} from "./pages/Main/Main.tsx";
import {Footer} from "./components/Footer/Footer.tsx";
import {Route, Routes, useLocation} from "react-router-dom";
import {Sidebar} from "./components/Sidebar/Sidebar.tsx";
import {Profile} from "./pages/Profile/Profile.tsx";
import {Headquarters} from "./pages/MyHeadquarters/Headquarters.tsx";
import {RegionalTeam} from "./pages/RegionalTeam/RegionalTeam.tsx";
import {AllHeadquarters} from "./pages/AllHeadquarters/AllHeadquarters.tsx";
import {AllVolunteers} from "./pages/AllVolunteers/AllVolunteers.tsx";
import {AllEvents} from "./pages/AllEvents/AllEvents.tsx";
import {AllEquipment} from "./pages/AllEquipment/AllEquipment.tsx";
import {AllCenters} from "./pages/AllCenters/AllCenters.tsx";
import {HeadquartersDocuments} from "./pages/HeadquartersDocumets/HeadquartersDocuments.tsx";
import {VolunteerProfile} from "./pages/VolunteerProfile/VolunteerProfile.tsx";
import {EventParticipants} from "./pages/EventParticipants/EventParticipants.tsx";
import {CenterHeadParticipants} from "./pages/CenterHeadParticipants/CenterHeadParticipants.tsx";
import {HeadCentEquipment} from "./pages/AllEquipment/HeadCentEquipment.tsx";

function App() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <>
        <Navbar onMenuClick={() => setIsMenuOpen(prev => !prev)}/>
        <div className={"flex h-full md:bg-[#F6F8FC]"}>
            {location.pathname !== "/" && <Sidebar isOpenMenu={isMenuOpen} onMenuClick={() => setIsMenuOpen(prev => !prev)}/>}
            <Routes>
                <Route element={<Main/>} path={"/"}/>
                <Route element={<Profile/>} path={"/profile"}/>
                <Route element={<Headquarters/>} path={"/:type/:id"}/>
                <Route element={<RegionalTeam/>} path={"/participants/regional_team/:id"}/>
                <Route element={<CenterHeadParticipants/>} path={"/participant/:type/:id"}/>
                <Route element={<AllHeadquarters/>} path={"/all_headquarters"}/>
                <Route element={<AllVolunteers/>} path={"/all_volunteers"}/>
                <Route element={<AllEvents/>} path={"/events"}/>
                <Route element={<AllEquipment/>} path={"/all_equipment"}/>
                <Route element={<HeadCentEquipment/>} path={"/equipment/:type/:id"}/>
                <Route element={<AllCenters/>} path={"/all_centers"}/>
                <Route element={<HeadquartersDocuments/>} path={"/documents/:type/:id"}/>
                <Route element={<VolunteerProfile/>} path={"/volunteer/:id"}/>
                <Route element={<EventParticipants/>} path={"/event_participants/:id"}/>
            </Routes>
        </div>
        {location.pathname === "/" && <Footer/>}
    </>
  )
}

export default App
