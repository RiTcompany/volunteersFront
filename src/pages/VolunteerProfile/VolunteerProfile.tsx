import styles from './VolunteerProfile.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {formatDateTime} from "../../utils/formatDate.ts";
const cn = classNames;

interface DataType {
    volunteerId: number,
    fullName: string,
    birthdayDto: { birthday: string, age: number },
    tgLink: string,
    vkLink: string,
    rank: number,
    eventLinkList: [{ id: number, name: string }],
    centerLink: { id: number, name: string },
    headquartersLink: { id: number, name: string }
}

export function VolunteerProfile(): React.JSX.Element {
    const navigate = useNavigate();
    const { id } = useParams();
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
            setData(null)
            setIsLoading(true)
            try {
                const response = await fetch(`https://rit-test.ru/api/v1/personal_account/${id}`, {
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
    }, [id]);

    return (
        <div className={cn("h-full mx-auto my-0 flex w-full", styles.profile__container)}>
            {isLoading ?
                <div className={cn("text-[24px] mt-10 w-full h-full items-center justify-center text-center")}>
                    <p>Загрузка...</p>
                </div>
                : error ?
                    <div className={cn("text-[24px] mt-10 w-full h-full items-center justify-center text-center")}>
                        <p>{error}</p>
                    </div>
                    :
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-8 gap-5 overflow-y-auto"}>
                <div className={"flex flex-col items-center text-center md:text-left md:flex-row gap-5 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <div className={cn("flex flex-col justify-center")}>
                        <p className={cn(styles.profile__name)}>{data?.fullName}</p>
                    </div>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Личные данные:</p>
                    <p className={styles.profile__data}>ID: {data?.volunteerId}</p>
                    {data?.birthdayDto && <p className={styles.profile__data}>Дата рождения: {formatDateTime(data.birthdayDto.birthday).slice(0, 10)} (Возраст: {data.birthdayDto.age})</p>}
                    <p className={styles.profile__data}>Telegram: <a>{data?.tgLink}</a></p>
                    <p className={styles.profile__data}>ВКонтакте:  <a>{data?.vkLink}</a></p>
                    <p className={styles.profile__data}>Рейтинг: {data?.rank}</p>
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Мероприятия:</p>
                    {data?.eventLinkList.length ? data?.eventLinkList.map(event =>
                        <p key={event.id} className={styles.profile__data}>
                            {event.name}
                        </p>
                    ) : <p>Нет мероприятий</p>}
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Центр:</p>
                    {data?.centerLink ? <Link to={`/center/${data?.centerLink.id}`}>{data?.centerLink.name}</Link> : <p>Не определен</p>}
                </div>
                <div className={"flex flex-col gap-2 bg-[#F6F8FC] rounded-2xl p-8"}>
                    <p className={styles.profile__title}>Штаб:</p>
                    {data?.headquartersLink ? <Link to={`/headquarters/${data?.headquartersLink.id}`}>{data?.headquartersLink.name}</Link> : <p>Не определен</p>}
                </div>
            </div>}
        </div>
    )
}
