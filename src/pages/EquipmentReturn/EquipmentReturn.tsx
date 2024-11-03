import React, {useState} from "react";

interface DataType {
    yourId: number | '',
    volunteerId: number | '',
    equipmentId: number | ''
}

export function EquipmentReturn(): React.JSX.Element {
    const [data, setData] = useState<DataType>({yourId: '', volunteerId: '', equipmentId: ''})

    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        try {
            const res = await fetch('', {
                method: 'POST',
                body: JSON.stringify(data)
            })

            console.log(await res.json())
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
                    <input type={'number'} name={'yourId'} value={data.yourId} onChange={(e) => handleChange(e)} placeholder={"Ваш ID"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID волонтера (возращающий инвентарь)</label>
                    <input type={'number'} name={'volunteerId'} value={data.volunteerId} onChange={(e) => handleChange(e)} placeholder={"ID волонтера"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <label className={"text-[#5E5E5E]"}>Введите ID инвентря</label>
                    <input type={'number'} name={'equipmentId'} value={data.equipmentId} onChange={(e) => handleChange(e)} placeholder={"ID инвентря"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>

                    <button onClick={handleSubmit} className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>Сохранить</button>
                </div>
            </div>
        </div>
    )
}
