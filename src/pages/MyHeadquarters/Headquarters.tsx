import styles from './Headquarters.module.css'
import classNames from 'classnames'
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "../../utils/formatDate.ts";
const cn = classNames;

interface DataType {
    federalId: number,
    createDate: string,
    tgLinkList: string[],
    vkLinkList: string[],
    rank: number,
    eventLinkList: { id: number, name: string }[],
    documentLinkList: { id: number, name: string }[],
    participantLinkList: { id: number, name: string }[],
    equipmentLinkList: { id: number, name: string }[]
}

export function Headquarters(): React.JSX.Element {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const [data, setData] = useState<DataType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        (async function fetchData() {
            const request = `${type}/${id}`;
            try {
                const response = await fetch(`http://195.133.197.53:8082/${request}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
                setError(null);
            } catch (e: any) {
                console.error(e);
                setError('Ошибка загрузки данных');
                setData(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [type, id]);

    if (isLoading) {
        return (
            <div className={cn("h-full flex items-center justify-center")}>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("h-full flex items-center justify-center")}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={cn("h-full mx-auto my-0 flex w-full", styles.profile__container)}>
            {data && (
                <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-8 gap-5 overflow-y-auto"}>
                    <div className={cn("flex flex-col items-center text-center md:text-left md:flex-row gap-5 bg-[#F6F8FC] rounded-2xl p-8", styles.myHeadquarters__bigTitle)}>
                        {type === "headquarters" ? <p>Штаб</p> : <p>Центр</p>}
                    </div>
                    <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                        <p className={styles.profile__title}>Данные {type === "headquarters" ? <span>штаба:</span> : <span>центра:</span>}</p>
                        <p className={styles.profile__data}>ID: {data.federalId}</p>
                        <p className={styles.profile__data}>Дата создания: {formatDateTime(data.createDate).slice(0, 10)}</p>
                        <p className={styles.profile__data}>Telegram:
                            {data.tgLinkList && data.tgLinkList.map((link) => <Link key={link} to={link}> {link} </Link>)}
                        </p>
                        <p className={styles.profile__data}>ВКонтакте:
                            {data.vkLinkList && data.vkLinkList.map((link) => <Link key={link} to={link}> {link} </Link>)}
                        </p>
                        <p className={styles.profile__data}>Рейтинг: {data.rank}</p>
                    </div>
                    <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                        <p className={styles.profile__title}>Проводимые мероприятия:</p>
                        {data.eventLinkList.length > 0 ? data.eventLinkList.map(event =>
                            <p key={event.id} className={styles.profile__data}>
                                {event.name}
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
            )}
        </div>
    );
}
