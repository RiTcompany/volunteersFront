import React, {useState} from "react";

interface DataType {
    adminId: number | '',
    eventId: number | '',
    volunteerId: number | '',
    equipmentId: number | ''
}

export function EquipmentReturn(): React.JSX.Element {
    const [data, setData] = useState<DataType>({adminId: '', volunteerId: '', eventId: '', equipmentId: ''})

    const [error, setError] = useState<string>('')

    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        if (!data.adminId || !data.volunteerId || !data.equipmentId || !data.eventId) {
            setError('Заполните все данные')
            return
        } else
            setError('')
            try {
                const res = await fetch(`https://rit-test.ru/api/v1/volunteer/${data.volunteerId}/return_equipment`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        adminId: data.adminId,
                        equipmentId: data.equipmentId,
                        eventId: data.eventId
                    })
                })

                console.log(await res.json())

                if (res.ok) {
                    setError('Данные отправлены')
                } else {
                    setError('Ошибка отправки данных')
                }
            } catch (error) {
                console.log(error)
            }
    }

    return (
        <div className={'flex justify-center w-full'} style={{height: 'calc(100vh - 160px)'}}>
            <div className={"flex flex-col justify-center gap-5 md:w-[500px] p-5"}>
                <p className={"text-center text-[20px]"}>Возврат инвентаря</p>
                <div className={"flex flex-col gap-3 overflow-y-auto"}>
                    <label className={"text-[#5E5E5E]"}>Введите свой ID (принимающий инвентарь)</label>
                    <input type={'number'} name={'adminId'} value={data.adminId} onChange={(e) => handleChange(e)} placeholder={"Ваш ID"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID волонтера (возращающий инвентарь)</label>
                    <input type={'number'} name={'volunteerId'} value={data.volunteerId} onChange={(e) => handleChange(e)} placeholder={"ID волонтера"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID инвентря</label>
                    <input type={'number'} name={'equipmentId'} value={data.equipmentId} onChange={(e) => handleChange(e)} placeholder={"ID инвентря"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID мероприятия</label>
                    <input type={'number'} name={'eventId'} value={data.eventId} onChange={(e) => handleChange(e)} placeholder={"ID мероприятия"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <div className={"h-5"}>
                        <p>{error}</p>
                    </div>

                    <button onClick={handleSubmit} className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>Сохранить</button>
                </div>
            </div>
        </div>
    )
}
