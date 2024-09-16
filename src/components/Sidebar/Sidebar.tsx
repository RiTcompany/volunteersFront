import React, {useEffect, useState} from "react";
import classNames from 'classnames'
const cn = classNames;
import profile from "../../assets/profile.svg"
import bag from "../../assets/bag.svg"
import document from "../../assets/document.svg"
import {useLocation, useNavigate} from "react-router-dom";
import darkLogo from "../../assets/darkLogo.svg";
import cross from "../../assets/darkCross.svg";

const buttons = [
    {name: "Личный кабинет", icon: profile, link: "/profile"},
    {name: "Мой штаб", icon: bag, link: "/headquarters/1"},
    {name: "Мой центр", icon: bag, link: "/center/5"},
    {name: "Региональная команда", icon: document, link: "/regional_team"},
    {name: "Волонтёры", icon: document, link: "/all_volunteers"},
    {name: "Все штабы", icon: document, link: "/all_headquarters"},
    {name: "Все центры", icon: document, link: "/all_centers"},
    {name: "Документы", icon: document, link: "/documents/headquarters/1"},
    {name: "Мероприятия", icon: document, link: "/events"},
    {name: "Инвентарь", icon: document, link: "/all_equipment"},
]

interface SidebarProps {
    isOpenMenu: boolean,
    onMenuClick: () => void;
}

export function Sidebar({isOpenMenu, onMenuClick}: SidebarProps): React.JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()

    const [activeIndex, setActiveIndex] = useState<number>(-1);

    useEffect(() => {
        const currLocation = location.pathname;

        const foundIndex = buttons.findIndex(button => currLocation === button.link);
        if (foundIndex !== -1) {
            setActiveIndex(foundIndex);
        }
    }, [location.pathname]);

    const handleButtonClick = (index: number, link: string, isPhone: boolean) => {
        setActiveIndex(index);
        navigate(link);
        isPhone && onMenuClick()
    };

    return (
        <div className={cn("mx-auto my-0")}>
            <div className={cn("w-auto hidden md:flex flex-col gap-2 pt-5 h-full")}>
                {buttons && buttons.map((button, index) =>
                   <button
                       key={button.name}
                       className={cn(
                           "flex gap-3 h-[44px] items-center rounded-xl mx-4 min-w-max p-4",
                           {
                               'bg-[#D3E3FD]': activeIndex === index,
                               'bg-transparent': activeIndex !== index
                           },
                           )}
                       onClick={() => handleButtonClick(index, button.link, false)}
                   >
                       <img src={button.icon} alt="icon"/>
                       {isOpenMenu &&
                           <p className={cn("text-[14px] font-bold whitespace-nowrap")}>{button.name}</p>
                       }
                   </button>
                )}
            </div>
            <div className={`fixed inset-0 bg-black opacity-50 z-40 md:hidden ${isOpenMenu ? '' : 'hidden'}`} onClick={onMenuClick}></div>
            {isOpenMenu &&
                <div className={"flex flex-col md:hidden absolute left-0 top-0 bg-[#F6F8FC] w-10/12 z-50 h-[100vh] gap-1"}>
                    <div className={"flex justify-between m-4"}>
                        <img className={cn("w-[184px]")} src={darkLogo} alt="logo"/>
                        <img src={cross} className={""} onClick={onMenuClick} alt="close"/>
                    </div>
                    <hr className={"my-3"}/>

                    {buttons && buttons.map((button, index) =>
                        <button
                            key={button.name}
                            className={cn(
                                "flex gap-5 h-[44px] items-center rounded-xl mx-2 min-w-max p-3",
                                {
                                    'bg-[#D3E3FD]': activeIndex === index,
                                    'bg-transparent': activeIndex !== index
                                }
                            )}
                            onClick={() => (handleButtonClick(index, button.link, true))}
                        >
                            <img src={button.icon} alt="icon"/>
                            <p className={cn("text-[14px] font-bold whitespace-nowrap")}>{button.name}</p>
                        </button>
                    )}
                </div>
            }
        </div>
    )
}
