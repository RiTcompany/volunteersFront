import styles from './Navbar.module.css'
import whiteLogo from "../../assets/whiteLogo.svg"
import darkLogo from "../../assets/darkLogo.svg"
import phone from "../../assets/phone.svg"
import mail from "../../assets/mail.svg"
import location from "../../assets/location.svg"
import tg from "../../assets/tg.svg"
import vk from "../../assets/vk.svg"
import youtube from "../../assets/youtube.svg"
import menu from "../../assets/menu.svg"
import darkMenu from "../../assets/darkMenu.svg"
import cross from "../../assets/cross.svg"
import logout from "../../assets/logout.svg"
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {parseJwt} from "../../utils/parseJWT.ts";
const cn = classNames;

interface ModalProps {
    closeModal?: () => void;
}

interface NavbarProps {
    onMenuClick: () => void;
}

function Modal({ closeModal }: ModalProps): React.JSX.Element {
    const [showContacts, setShowContacts] = useState<boolean>(true);
    return (
        <div className={cn("absolute flex flex-col border-x md:justify-between gap-5 md:gap-0 z-50", styles.navbar__modal)} onClick={(e) => e.stopPropagation()}>
            <button className={"md:hidden absolute top-5 right-5"} onClick={closeModal}>
                <img src={cross} alt="cross"/>
            </button>
            <p className={cn("underline text-[20px] self-start md:hidden mt-20", styles.navbar__city)}>Санкт-Петербург</p>
            <button className={cn("text-white text-[20px] border-none flex justify-between md:hidden mb-2")} onClick={() => setShowContacts(!showContacts)}>
                Контакты
            </button>
            {showContacts && (
                <>
                    <div className={"flex gap-5 text-center"}>
                        <img src={phone} alt="phone-icon"/>
                        <p>+7 (499) 649 47 77</p>
                    </div>
                    <hr className={styles.navbar__modalLine}/>
                    <div className={"flex gap-5"}>
                        <img src={mail} alt="mail-icon"/>
                        <p>info@vsezapobedu.com</p>
                    </div>
                    <hr className={styles.navbar__modalLine}/>
                    <div className={"flex gap-5"}>
                        <img src={location} alt="location-icon"/>
                        <p className={cn("leading-4 text-start")}>101000, г. Москва, ул. Мясницкая, д. 46, стр. 1</p>
                    </div>
                    <hr className={styles.navbar__modalLine}/>
                    <div className={"flex justify-between"}>
                        <a href="#"><img src={tg} alt="tg-icon"/></a>
                        <a href="#"><img src={vk} alt="vk-icon"/></a>
                        <a href="#"><img src={youtube} alt="youtube-icon"/></a>
                    </div>
                </>
            )}
        </div>
    );
}

export function Navbar({onMenuClick}: NavbarProps): React.JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation().pathname;
    const navigate = useNavigate()
    // const [navColor, setNavColor] = useState<string>()


    const [user, setUser] = useState<string>("")

    const token = localStorage.getItem("authToken")

    useEffect(() => {
        if (location === "/event_check" || location === "/return_equipment") {
            return
        } else if (!token) {
            navigate("/");
        } else {
            const parsedToken = parseJwt(token);

            if (parsedToken && parsedToken.sub) {
                setUser(parsedToken.sub);
            }
        }
    })

    useEffect(() => {
        function handleClickOutside() {
            setIsModalOpen(false);
        }
        if (isModalOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isModalOpen]);

    function handleContactButton(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        setIsModalOpen(prev => !prev);
    }

    function handleLogout() {
        localStorage.removeItem("authToken")
        navigate("/")
    }

    return (
        <header className={cn("w-full flex justify-center", styles.navbar__container)} style={user ? {backgroundColor: "#F7F8FC"} : {backgroundColor: "#0C428C"}}>
            {
                location === "/" || location === "/event_check" || location === "/return_equipment" ?
                <div className={cn("flex justify-between items-center", styles.navbar__content)}>
                    <img src={whiteLogo} alt="logo"/>
                    <div className={cn("hidden md:flex gap-10 relative")}>
                        <p className={cn("underline text-[20px]", styles.navbar__city)}>Санкт-Петербург</p>
                        <button className={cn("text-white text-[20px] border-none")} onClick={handleContactButton}>
                            Контакты
                        </button>
                        {isModalOpen && <Modal />}
                    </div>
                    <button className={"md:hidden border-none"} onClick={handleContactButton}>
                        <img src={menu} alt="menu"/>
                    </button>
                    {isModalOpen &&
                        <div className={cn("md:hidden")}>
                            <Modal closeModal={() => setIsModalOpen(false)} />
                        </div>
                    }
                </div>
                    :
                <div className={cn("flex justify-between items-center w-full px-8")}>
                    <div className={cn("flex gap-8")}>
                        <button className={cn("border-none")} onClick={onMenuClick}>
                            <img src={darkMenu} alt="menu"/>
                        </button>
                        <img className={cn("hidden md:flex")} src={darkLogo} alt="logo"/>
                    </div>
                    <div className={cn("flex items-center gap-4")}>
                        <div className={cn("rounded-full flex justify-center items-center", styles.navbar__nameIcon)}>ИИ</div>
                        <div className={cn("hidden md:flex flex-col w-2/4")}>
                            <p className={cn("text-[14px] leading-[14px]")}>{user.split(' ').length === 3 ? `${user.split(' ')[0]} ${user.split(' ')[1][0]}. ${user.split(' ')[2][0]}.` : user}</p>
                            <p className={cn("text-[12px] leading-[12px] text-[#B0B0C1]")}>Руководитель какого-то региона</p>
                        </div>
                        <button className={cn("border-l-2 border-[#B0B0C1] pl-4 h-10")} onClick={handleLogout}>
                            <img src={logout} alt="logout"/>
                        </button>
                    </div>
                </div>
            }
        </header>
    );
}

