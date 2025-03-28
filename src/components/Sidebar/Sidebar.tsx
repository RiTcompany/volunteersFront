import React, {useEffect, useState} from "react";
import classNames from 'classnames'
const cn = classNames;
import profile from "../../assets/profile.svg"
import bag from "../../assets/bag.svg"
import document from "../../assets/document.svg"
import {useLocation, useNavigate} from "react-router-dom";
import darkLogo from "../../assets/darkLogo.svg";
import cross from "../../assets/darkCross.svg";
import {parseJwt} from "../../utils/parseJWT.ts";

interface SidebarProps {
    isOpenMenu: boolean,
    onMenuClick: () => void;
}

interface DataType {
    headquartersLink?: {
        id: string;
    };
    centerLink?: {
        id: string;
    };
    districtTeamId: number
}

export function Sidebar({isOpenMenu, onMenuClick}: SidebarProps): React.JSX.Element {
    const token = parseJwt(String(localStorage.getItem("authToken")))

    const [data, setData] = useState<DataType | null>(null)
    console.log(token)

    useEffect(() => {
        (async function fetchData() {
            setData(null)
            try {
                // const token: string | null = localStorage.getItem("authToken");
                const response = await fetch(`https://spb-zapobedu.ru/api/v1/my_personal_account/${token.id}`, {
                    method: "GET",
                    credentials: "include",
                    // headers: {
                    //     "Authorization": `Bearer ${token}`
                    // },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log(result)
                setData(result);
            } catch (e: any) {
                console.error(e);
                setData(null);
            }
        })();
    }, []);

    console.log(data)

    const buttons = [
        {name: "Личный кабинет", icon: profile, link: `/profile/${token.id}`},
        {name: "Мой штаб", icon: bag, link: data?.headquartersLink?.id ? `/headquarters/${data.headquartersLink.id}` : null},
        {name: "Мой центр", icon: bag, link: data?.centerLink?.id ? `/center/${data.centerLink.id}` : null},
        {name: "Региональная команда", icon: document, link: data?.districtTeamId ? `/participants/regional_team/${data.districtTeamId}` : null},
        {name: "Все волонтёры", icon: document, link: "/all_volunteers"},
        {name: "Все штабы", icon: document, link: "/all_headquarters"},
        {name: "Все центры", icon: document, link: "/all_centers"},
        // {name: "Документы штаба", icon: document, link: data?.headquartersLink?.id ? `/documents/headquarters/${data.headquartersLink.id}` : null},
        // {name: "Документы центра", icon: document, link: data?.headquartersLink?.id ? `/documents/center/${data.centerLink?.id}` : null},
        {name: "Мероприятия", icon: document, link: "/events"},
        // {name: "Инвентарь", icon: document, link: "/all_equipment"},
    ].filter(button => button.link !== null);

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
                       onClick={() => button.link && handleButtonClick(index, button.link, false)}
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
                            onClick={() => (button.link && handleButtonClick(index, button.link, true))}
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
