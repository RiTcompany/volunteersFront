import styles from './Headquarters.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {formatDateTime} from "../../utils/formatDate.ts";
const cn = classNames;

// interface dataType {
//     name: string,
//     who: string,
//     id: number,
//     date: string,
//     tg: string,
//     vk: string,
//     rate: number,
//     events: string[],
//     center: string
// }

export function Headquarters(): React.JSX.Element {
    const navigate = useNavigate()
    const {type, id} = useParams()

    const [data, setData] = useState({ federalId: 0, createDate: "", tgLinkList: [], vkLinkList: [], rank: 0,
        eventLinkList: [], documentLinkList: [], participantLinkList: [], equipmentLinkList: []})

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    useEffect(() => {
        (async function() {
            const request = `${type}/${id}`
            try {
                const response = await fetch(`http://195.133.197.53:8082/${request}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                let result = await response.json()
                console.log(result)
                setData(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, []);

    return (
        <div className={cn("h-full mx-auto my-0 flex w-full", styles.profile__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-8 gap-5 overflow-y-auto"}>
                <div className={cn("flex flex-col items-center text-center md:text-left md:flex-row gap-5 bg-[#F6F8FC] rounded-2xl p-8", styles.myHeadquarters__bigTitle)}>
                    {type === "headquarters" ? <p>Штаб</p> : <p>Центр</p>}
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Данные {type === "headquarters" ? <span>штаба:</span> : <span>центра:</span>}</p>
                    <p className={styles.profile__data}>ID: {data.federalId}</p>
                    <p className={styles.profile__data}>Дата создания: {formatDateTime(data.createDate).slice(0, 10)}</p>
                    <p className={styles.profile__data}>Telegram:
                        {data.tgLinkList && data.tgLinkList.map((link) => <Link to={link}> {link} </Link>)}
                    </p>
                    <p className={styles.profile__data}>ВКонтакте:
                        {data.vkLinkList && data.vkLinkList.map((link) => <Link to={link}> {link} </Link>)}
                    </p>
                    <p className={styles.profile__data}>Рейтинг: {data.rank}</p>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Проводимые мероприятия:</p>
                    {data.eventLinkList[0] ? data.eventLinkList.map(event =>
                        <p className={styles.profile__data}>
                            {event}
                        </p>
                    ) : <p>Нет мероприятий</p>}
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Документы штаба/центра:</p>
                    <Link className={cn(styles.profile__data, "text-blue-500")} to={`/documents/${type}/${id}`}>Документы</Link>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Участники штаба/центра:</p>
                    <p className={styles.profile__data}>Участники</p>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Инвентарь штаба/центра:</p>
                    <p className={styles.profile__data}>Инвентарь</p>
                </div>
            </div>
        </div>
    )
}
