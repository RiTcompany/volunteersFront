import styles from './RegionalTeam.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import document from "../../assets/document.svg"
import search from "../../assets/search.svg"
import highlight from "../../assets/highlight.svg"
import lightHighlight from "../../assets/lightHighlight.svg"
import filter from "../../assets/filter.svg"
import filters from "../../assets/filters.svg"
import cross from "../../assets/darkCross.svg";
const cn = classNames;

const data = {
    region: "Команда Такого-то региона",
    people: [
    {id: 1374, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Желтый", events: ["Мероприятие 1", "Мероприятие 2", "Мероприятие 3", "Мероприятие 3", "Мероприятие 3",],},
    {id: 1375, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Зеленый", events: ["Мероприятие 1",]},
    {id: 1375, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Красный", events: ["Мероприятие 1", "Мероприятие 2"],},
    {id: 1375, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Зеленый", events: ["Мероприятие 1",],},
]}

export function RegionalTeam(): React.JSX.Element {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    useEffect(() => {
        !localStorage.getItem("auth") && navigate("/")
    })

    useEffect(() => {
        console.log(isFilterOpen)
    })

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.regionalTeam__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-3"}>
                        <img src={document} alt="document"/>
                        <p>{data.region}</p>
                    </div>
                    <button className={"flex md:hidden"}><img src={lightHighlight} alt={"highlight"}/></button>
                </div>
                <div className={"flex justify-between gap-5 w-full"}>
                    <div className={"flex gap-5 w-full md:w-auto"}>
                        <div className={"relative w-full md:w-auto"}>
                            <img src={search} alt="search" className={"absolute left-2 top-1"}/>
                            <input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.regionalTeam__input)} />
                            <img src={filters} alt="filters" className={"absolute right-2 top-1 flex md:hidden"}/>
                        </div>
                        <button onClick={() => setIsFilterOpen(true)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__filterButton)}>
                            <img src={filter} alt="filter"/>Фильтры
                        </button>
                    </div>
                    <button className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__highlightButton)}>
                        <img src={highlight} alt="highlight"/>Редактировать
                    </button>
                </div>
                <div className="overflow-y-auto max-h-full">
                    <table className={"w-full overflow-auto min-w-[900px]"}>
                        <thead>
                        <tr className={cn("h-[60px] bg-[#F7F7FD] border-b-[1px]", styles.regionalTeam__tableHead)}>
                            <th className={cn(styles.regionalTeam__tableId, "sticky left-0 z-10 bg-[#F7F7FD]")}>ID</th>
                            <th className={cn(styles.regionalTeam__tableName, "sticky left-[48px] z-10 bg-[#F7F7FD] border-r-[1px]")}>ФИО</th>
                            <th className={cn(styles.regionalTeam__tableDate)}>Дата рождения</th>
                            <th className={cn(styles.regionalTeam__tableLink)}>Ссылка Telegram</th>
                            <th className={cn(styles.regionalTeam__tableLink)}>Ссылка ВКонтакте</th>
                            <th className={cn(styles.regionalTeam__tableColor)}>Светофор</th>
                            <th className={cn(styles.regionalTeam__tableEvents)}>Мероприятия</th>
                            <th className={cn(styles.regionalTeam__tableButton)}></th>
                        </tr>
                        </thead>
                        <tbody className={""}>
                        {data.people && data.people.map(person =>
                            <tr className={cn("h-[50px] border-b-[1px]", styles.regionalTeam__tableBody)}>
                                <th className={cn("sticky left-0 z-10 bg-white border-b-[1px]")}>{person.id}</th>
                                <th className={cn("sticky left-[48px] z-10 bg-white border-r-[1px] border-b-[1px]")}>{person.name}</th>
                                <th>{person.date}</th>
                                <th>{person.tg}</th>
                                <th>{person.vk}</th>
                                <th className={"flex justify-center items-center h-16"}>
                                    <div className={cn("w-3/4 rounded-2xl text-[12px]",
                                        person.color === "Желтый" ? "bg-[#FFF4E4] text-[#E99518]"
                                            : person.color === "Зеленый" ? "bg-[#EBF6EB] text-[#31AA27]"
                                                : person.color === "Красный" ? "bg-[#FFE3DD] text-[#FF2E00]"
                                                    : "bg-[#F1F1F1] text-[#777777]")}>
                                        {person.color}
                                    </div>
                                </th>
                                <th className={cn(styles.regionalTeam__tableEvents)} title={person.events.join(", ")}>{person.events.join(", ")}</th>
                                <th><button className={cn("bg-[#4471C9] text-white", styles.regionalTeam__newPassword)}>Выдать новый логин/пароль</button></th>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isFilterOpen ? '' : 'hidden'}`} onClick={() => setIsFilterOpen(false)}></div>
            {isFilterOpen &&
                <div className={"flex flex-col absolute right-0 top-0 bg-[#FCFCFC] h-full w-96 z-50 gap-1 overflow-y-auto"}>
                    <div className={"flex justify-between my-4 items-center sticky z-55 top-0 bg-[#FCFCFC] p-4"}>
                        <p className={cn("text-center text-[20px]", styles.regionalTeam__filtersTitle)}>Фильтры</p>
                        <img src={cross} className={""} onClick={() => setIsFilterOpen(false)} alt="close"/>
                    </div>
                    <div className={"flex flex-col gap-5 mx-4"}>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Отображать колонки</p>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
                                <p>Все</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"name"} className={styles.regionalTeam__checkbox}/>
                                <p>ФИО</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"date"} className={styles.regionalTeam__checkbox}/>
                                <p>Дата рождения</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"tg"} className={styles.regionalTeam__checkbox}/>
                                <p>Ссылка Telegram</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"vk"} className={styles.regionalTeam__checkbox}/>
                                <p>Ссылка ВКонтакте</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"color"} className={styles.regionalTeam__checkbox}/>
                                <p>Светофор</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"events"} className={styles.regionalTeam__checkbox}/>
                                <p>Мероприятия</p>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Возраст</p>
                            <div className={"flex gap-5 justify-between"}>
                                <div className={"flex flex-col flex-1 self-start gap-2"}>
                                    <label>От</label>
                                    <input className={styles.regionalTeam__ageInput} name={"ageFrom"} type={"number"}/>
                                </div>
                                <div className={"flex flex-col flex-1 self-start gap-2"}>
                                    <label>До</label>
                                    <input className={styles.regionalTeam__ageInput} name={"ageTo"} type={"number"}/>
                                </div>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"ageAsc"} className={styles.regionalTeam__checkbox}/>
                                <p>По возрастанию</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"ageDesc"} className={styles.regionalTeam__checkbox}/>
                                <p>По убыванию</p>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Светофор</p>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
                                <p>Все</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"name"} className={styles.regionalTeam__checkbox}/>
                                <p>Зелёный</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"date"} className={styles.regionalTeam__checkbox}/>
                                <p>Жёлтый</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input type="checkbox" name={"tg"} className={styles.regionalTeam__checkbox}/>
                                <p>Красный</p>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Мероприятия</p>
                            <div className={"relative w-full"}>
                                <img src={search} alt="search" className={"absolute left-2 top-1"}/>
                                <input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.regionalTeam__input)} />
                            </div>
                        </div>
                    </div>
                    <div className={"flex justify-center my-4 items-center sticky z-55 bottom-0 bg-white h-24 p-4 gap-5"}>
                        <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#F1F1F5] text-[#5E5E5E]")}>Сбросить все</button>
                        <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#3B64B3] text-white")}>Применить</button>
                    </div>
                </div>
            }
        </div>
    )
}
