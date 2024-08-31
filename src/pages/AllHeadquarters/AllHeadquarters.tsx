import styles from './AllHeadquarters.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import document from "../../assets/document.svg"
import search from "../../assets/search.svg"
import highlight from "../../assets/highlight.svg"
import lightHighlight from "../../assets/lightHighlight.svg"
import filter from "../../assets/filter.svg"
import filters from "../../assets/filters.svg"
import cross from "../../assets/darkCross.svg";
import bin from "../../assets/delete.svg";
import plus from "../../assets/plus.svg";
import cancel from "../../assets/cancel.svg";
const cn = classNames;

const data = {
    tableName: "Таблица всех штабов",
    hqs: [
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
    {id: 1374, name: "Название 1", peopleCount: 1346, address: "г. Санкт-Петербург, наб. канала Грибоедова, 32", phone: "+7 (910) 952 28 12"},
]}

export function AllHeadquarters(): React.JSX.Element {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)

    useEffect(() => {
        !localStorage.getItem("auth") && navigate("/")
    })

    useEffect(() => {
        console.log(isEditorMode)
    })

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.allHeadquarters__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>{data.tableName}</p>
                    </div>
                    <button className={"flex md:hidden"}>
                        {isEditorMode ?
                            <img src={cancel} alt={"cancel"} onClick={() => setIsEditorMode(false)}/>
                            : <img src={lightHighlight} alt={"highlight"} onClick={() => setIsEditorMode(true)}/>
                        }

                    </button>
                </div>
                <div className={"flex justify-between gap-5 w-full"}>
                    <div className={"flex gap-5 w-full md:w-auto"}>
                        <div className={"relative w-full md:w-auto"}>
                            <img src={search} alt="search" className={"absolute left-2 top-1"}/>
                            <input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.allHeadquarters__input)} />
                            <img src={filters} alt="filters" className={"absolute right-2 top-1 flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
                        </div>
                        <button onClick={() => setIsFilterOpen(true)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.allHeadquarters__filterButton)}>
                            <img src={filter} alt="filter"/>Фильтры
                        </button>
                    </div>
                    {!isEditorMode &&
                        <button onClick={() => setIsEditorMode(true)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.allHeadquarters__highlightButton)}>
                            <img src={highlight} alt="highlight"/>Редактировать
                        </button>
                    }
                    {isEditorMode &&
                        <div className={"flex gap-5"}>
                            <button onClick={() => setIsEditorMode(false)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.allHeadquarters__highlightButton)}>
                                Отменить
                            </button>
                            <button onClick={() => setIsEditorMode(false)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#31AA27] text-white", styles.allHeadquarters__highlightButton)}>
                                Сохранить
                            </button>
                        </div>
                    }
                </div>
                {isEditorMode &&
                    <div className={"flex justify-between"}>
                        <button onClick={() => setIsOpenNew(true)} className={cn(styles.allHeadquarters__addButton, "flex text-white text-center bg-[#4A76CB] justify-center gap-2")}><p className={"hidden md:flex"}>Добавить</p><img src={plus} alt=""/></button>
                        <button onClick={() => setIsEditorMode(false)} className={cn("flex md:hidden justify-center gap-3 border-none bg-[#31AA27] text-white", styles.allHeadquarters__highlightButton)}>
                            Сохранить
                        </button>
                    </div>
                }
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenNew ? '' : 'hidden'}`} onClick={() => setIsOpenNew(false)}></div>
                {isOpenNew &&
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[600px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите название штаба/центра</label>
                                <input placeholder={"Название"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите количество участников</label>
                                <input placeholder={"Количество учатников"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите адрес</label>
                                <input placeholder={"Адрес"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите контакты</label>
                                <input placeholder={"Контакты"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <button className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>Добавить</button>
                        </div>
                    </div>
                }
                <div className="overflow-y-auto max-h-full">
                    <table className={"w-full overflow-auto min-w-[900px]"}>
                        <thead>
                        <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]", styles.allHeadquarters__tableHead)}>
                            {/*<th className={cn(styles.regionalTeam__tableId, "sticky left-0 z-20 bg-[#F7F7FD]")}>ID</th>*/}
                            <th className={cn(styles.allHeadquarters__tableName, "sticky z-10 bg-[#F7F7FD] border-r-[1px] left-0")}>Название</th>
                            <th className={cn(styles.allHeadquarters__tablePeopleCount, "text-wrap")}>Количество участников</th>
                            <th className={cn(styles.allHeadquarters__tableAddress)}>Адрес</th>
                            <th className={cn(styles.allHeadquarters__tablePhone)}>Контакты</th>
                            {isEditorMode &&
                                <th className={cn("min-w-8")}></th>
                            }
                        </tr>
                        </thead>
                        <tbody className={""}>
                        {data.hqs && data.hqs.map(hq =>
                            <tr key={hq.id} className={cn("h-[50px] border-b-[1px]", styles.allHeadquarters__tableBody)}>
                                {/*<th className={cn("sticky left-0 z-10 bg-white border-b-[1px]")}>{hq.id}</th>*/}
                                <th className={cn("sticky z-10 bg-white border-r-[1px] border-b-[1px] left-0")}>
                                    <input value={hq.name} className={cn("border-0 rounded-none h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>
                                <th className={""}>
                                    <p className={cn("border-0 bg-white w-full h-full")}>{hq.peopleCount}</p>
                                </th>
                                <th>
                                    <input value={hq.address} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>
                                <th>
                                    <input value={hq.phone} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>
                                {isEditorMode &&
                                    <th className={cn("min-w-8")}><button className={"w-full flex justify-center"}><img src={bin} alt="delete" className={"self-center"}/></button></th>
                                }
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isFilterOpen ? '' : 'hidden'}`} onClick={() => setIsFilterOpen(false)}></div>
            {isFilterOpen &&
                <div className={"flex flex-col absolute right-0 top-0 bg-[#FCFCFC] h-full w-full sm:w-96 z-50 gap-1 overflow-y-auto"}>
                    <div className={"flex justify-between my-4 items-center sticky z-55 top-0 bg-[#FCFCFC] p-4"}>
                        <p className={cn("text-center text-[20px]", styles.allHeadquarters__filtersTitle)}>Фильтры</p>
                        <img src={cross} className={""} onClick={() => setIsFilterOpen(false)} alt="close"/>
                    </div>
                    <div className={"flex flex-col gap-5 mx-4"}>
                        Нет доступных фильтров
                    </div>
                </div>
            }
        </div>
    )
}
