import React, {useEffect, useState} from "react";
import style from "./EventCheck.module.css"
import classNames from "classnames";
import {useParams} from "react-router-dom";
const cn = classNames;

interface DataType {
    adminId: number | '',
    volunteerId: number | '',
    volunteerName: string,
    eventId: number | '',
    eventName: string,
    cloths: boolean,
    equipmentId: number | ''
}

export function EventCheck(): React.JSX.Element {
    const {volunid, eventid} = useParams()

    const [data, setData] = useState<DataType>({adminId: '', volunteerId: Number(volunid), volunteerName: '', eventId: Number(eventid), eventName: '', cloths: false, equipmentId: ''})

    const [error, setError] = useState<string>('')

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch(`http://195.133.197.53:8082/volunteer/${volunid}/event/${eventid}`, {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()

                setData((prevState) => ({
                    ...prevState,
                    volunteerName: result.volunteerName,
                    eventName: result.eventName
                }))
            } catch (e) {
                console.log(e)
            }
        })()
    }, []);

    const handleChange = (e: any) => {
        if (e.target.name === 'cloths') {
            setData(prev => ({
                ...data,
                cloths: !prev.cloths
            }))
        } else
            setData({
                ...data,
                [e.target.name]: e.target.value
            })
    }

    const handleSubmit = async () => {
        try {
            if (data.cloths && data.equipmentId) {
                setError('')
                const res = await fetch(`http://195.133.197.53:8082/volunteer/${volunid}/event/${eventid}/mark`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminId: data.adminId,
                        equipmentId: data.equipmentId
                    })
                })
                console.log(await res.json())
                if (res.ok) {
                    setError('Данные отправлены')
                } else {
                    setError('Ошибка отправки данных')
                }
            } else if (!data.cloths && !data.equipmentId) {
                setError('')
                const res = await fetch(`http://195.133.197.53:8082/volunteer/${volunid}/event/${eventid}/mark`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminId: data.adminId,
                    })
                })
                console.log(await res.json())
                if (res.ok) {
                    setError('Данные отправлены')
                } else {
                    setError('Ошибка отправки данных')
                }
            } else {
                setError('Некорректное заполение полей')
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={'flex justify-center w-full overflow-y-auto py-5 ' + style.container}>
            <div className={"flex flex-col justify-center gap-5 md:w-[500px] p-5"}>
                <p className={"text-center text-[20px]"}>Отметка участника на мероприятии</p>
                <div className={"flex flex-col gap-3 overflow-y-auto"}>
                    <label className={"text-[#5E5E5E]"}>Введите ID админа</label>
                    <input onChange={(e) => handleChange(e)} name={'adminId'} type={"number"} value={data.adminId} placeholder={"ID админа"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID волонтера</label>
                    <input onChange={(e) => handleChange(e)} name={'volunteerId'} type={"number"} value={data.volunteerId} placeholder={"ID волонтера"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ФИО волонтера</label>
                    <input onChange={(e) => handleChange(e)} name={'volunteerName'} value={data.volunteerName} placeholder={"ФИО волонтера"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID мероприятия</label>
                    <input onChange={(e) => handleChange(e)} name={'eventId'} type={"number"} value={data.eventId} placeholder={"ID мероприятия"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите название меропрития</label>
                    <input onChange={(e) => handleChange(e)} name={'eventName'} value={data.eventName} placeholder={"Название мероприятия"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <div className={'flex gap-5 my-2'}>
                        <input onChange={(e) => handleChange(e)} name={'cloths'} checked={data.cloths} type={"checkbox"} className={cn("border-0 bg-white px-1 text-center h-7 w-7 flex justify-center items-center", style.custom_checkbox)}/>
                        <label className={"text-[#5E5E5E] mt-0.5"}>Форма для волонтера</label>
                    </div>

                    <label className={"text-[#5E5E5E]"}>Укажите ID выданного инвентаря</label>
                    <input onChange={(e) => handleChange(e)} name={'equipmentId'} type={"number"} value={data.equipmentId} placeholder={"ID инвентаря"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <div className={"h-5"}>
                        <p>{error}</p>
                    </div>

                    <button onClick={handleSubmit} className={"w-2/4 p-2 text-[#5E5E5E] bg-[#EDEDF1] rounded-lg self-center mt-5"}>Сохранить</button>
                </div>
            </div>
        </div>
    )
}
