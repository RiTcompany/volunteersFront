import styles from './Profile.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {parseJwt} from "../../utils/parseJWT.ts";
const cn = classNames;

interface dataType {
    name: string,
    who: string,
    id: number,
    date: string,
    tg: string,
    vk: string,
    rate: number,
    events: string[],
    center: string
}

const data: dataType = {
    name: "Иванов Иван Иванович",
    who: "Руководитель какого-то региона",
    id: 1374,
    date: "21.05.2002",
    tg: "https://t.me/vvoroby",
    vk: "https://vk.com/voroebushek",
    rate: 5,
    events: [
        "Мероприятие 1",
        "Мероприятие 2",
        "Мероприятие 3"
    ],
    center: "Название штаба/центра региональной команды"
}

export function Profile(): React.JSX.Element {
    const navigate = useNavigate()
    const [user, setUser] = useState<string>("")

    // const [volunteerData, setVolunteerData] = useState()

    const token = localStorage.getItem("authToken")

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            const parsedToken = parseJwt(token);

            if (parsedToken && parsedToken.sub) {
                setUser(parsedToken.sub);
            }
        }
    })

    return (
        <div className={cn("h-full mx-auto my-0 flex w-full", styles.profile__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-8 gap-5 overflow-y-auto"}>
                <div className={"flex flex-col items-center text-center md:text-left md:flex-row gap-5 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <div className={cn("rounded-full flex justify-center items-center", styles.profile__circle)}>ИИ</div>
                    <div className={cn("flex flex-col justify-center")}>
                        <p className={cn(styles.profile__name)}>{user}</p>
                        <p className={cn(styles.profile__post)}>{data.who}</p>
                    </div>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Личные данные:</p>
                    <p className={styles.profile__data}>ID: {data.id}</p>
                    <p className={styles.profile__data}>Дата рождения: {data.date}</p>
                    <p className={styles.profile__data}>Telegram: <Link to={data.tg}>{data.tg}</Link></p>
                    <p className={styles.profile__data}>ВКонтакте: <Link to={data.vk}>{data.vk}</Link></p>
                    <p className={styles.profile__data}>Рейтинг: {data.rate}</p>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Мои мероприятия:</p>
                    {data.events && data.events.map(event =>
                        <p className={styles.profile__data}>
                            {event}
                        </p>
                    )}
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Мой штаб/центр/региональная команда:</p>
                    <p className={styles.profile__data}>{data.center}</p>
                </div>
            </div>
        </div>
    )
}
