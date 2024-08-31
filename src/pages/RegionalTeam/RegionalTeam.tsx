import styles from './RegionalTeam.module.css'
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
import arrowSmall from "../../assets/arrowSmall.svg";
import bin from "../../assets/delete.svg";
import plus from "../../assets/plus.svg";
import cancel from "../../assets/cancel.svg";
const cn = classNames;

interface dataType {
    id: number,
    name: string,
    date: string,
    tg: string,
    vk: string,
    color: string,
    events: string[],
}

interface ColumnsType {
    all: boolean, id: boolean, name: boolean, date: boolean, tg: boolean, vk: boolean, color: boolean, events: boolean, button: boolean
}

const data: dataType[] = [
    {id: 1374, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Желтый", events: ["Мероприятие 1", "Мероприятие 2", "Мероприятие 3", "Мероприятие 3", "Мероприятие 3",],},
    {id: 1375, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Зеленый", events: ["Мероприятие 1",]},
    {id: 1376, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Красный", events: ["Мероприятие 1", "Мероприятие 2"],},
    {id: 1377, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Not found", events: ["Мероприятие 1",],},
        {id: 1378, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Желтый", events: ["Мероприятие 1", "Мероприятие 2", "Мероприятие 3", "Мероприятие 3", "Мероприятие 3",],},
        {id: 1379, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Зеленый", events: ["Мероприятие 1",]},
        {id: 1380, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Красный", events: ["Мероприятие 1", "Мероприятие 2"],},
        {id: 1381, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Not found", events: ["Мероприятие 1",],},
        {id: 1382, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Желтый", events: ["Мероприятие 1", "Мероприятие 2", "Мероприятие 3", "Мероприятие 3", "Мероприятие 3",],},
        {id: 1383, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Зеленый", events: ["Мероприятие 1",]},
        {id: 1384, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Красный", events: ["Мероприятие 1", "Мероприятие 2"],},
        {id: 1385, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Not found", events: ["Мероприятие 1",],},
        {id: 1386, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Желтый", events: ["Мероприятие 1", "Мероприятие 2", "Мероприятие 3", "Мероприятие 3", "Мероприятие 3",],},
        {id: 1387, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Зеленый", events: ["Мероприятие 1",]},
        {id: 1388, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Красный", events: ["Мероприятие 1", "Мероприятие 2"],},
        {id: 1389, name: "Иванов Иван Иванович", date: "21.05.2002(22 года)", tg: "https://t.me/vvoroby", vk: "https://vk.com/voroebushek", color: "Not found", events: ["Мероприятие 1",],},
]

export function RegionalTeam(): React.JSX.Element {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnsType>({all: true, id: true, name: true, date: true, tg: true, vk: true, color: true, events: true, button: true})

    const [openCell, setOpenCell] = useState<number>(-1);


    useEffect(() => {
        const allChecked: boolean = Object.keys(columns).every(key => key === 'all' || columns[key as keyof ColumnsType]);
        if (allChecked !== columns.all) {
            setColumns(prevState => ({
                ...prevState,
                all: allChecked
            }));
        }
    }, [columns]);

    const handleAllChange = () => {
        setColumns(prevState => {
            const newAll = !prevState.all;
            const newColumns = {
                all: newAll, id: newAll, name: newAll, date: newAll, tg: newAll, vk: newAll, color: newAll, events: newAll, button: newAll
            };

            return newColumns;
        });
    };


    // const handleAddNewPerson = () => {
    //
    // }

    const toggleDropdown = (cellId: number) => {
        setOpenCell(openCell === cellId ? -1 : cellId);
    };

    const handleColorSelect = (color: string, cellId: number) => {
        console.log(color, cellId)
        setOpenCell(-1);
    };

    const getColorClass = (color: string) => {
        return color === "Желтый" ? "bg-[#FFF4E4] text-[#E99518]"
            : color === "Зеленый" ? "bg-[#EBF6EB] text-[#31AA27]"
                : color === "Красный" ? "bg-[#FFE3DD] text-[#FF2E00]"
                    : "bg-[#F1F1F1] text-[#777777]";
    };

    useEffect(() => {
        !localStorage.getItem("auth") && navigate("/")
    })

    useEffect(() => {
        console.log(isEditorMode)
    })

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.regionalTeam__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Команда Такого-то региона</p>
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
                            <input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.regionalTeam__input)} />
                            <img src={filters} alt="filters" className={"absolute right-2 top-1 flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
                        </div>
                        <button onClick={() => setIsFilterOpen(true)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__filterButton)}>
                            <img src={filter} alt="filter"/>Фильтры
                        </button>
                    </div>
                    {!isEditorMode &&
                        <button onClick={() => setIsEditorMode(true)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__highlightButton)}>
                            <img src={highlight} alt="highlight"/>Редактировать
                        </button>
                    }
                    {isEditorMode &&
                        <div className={"flex gap-5"}>
                            <button onClick={() => setIsEditorMode(false)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__highlightButton)}>
                                Отменить
                            </button>
                            <button onClick={() => setIsEditorMode(false)} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#31AA27] text-white", styles.regionalTeam__highlightButton)}>
                                Сохранить
                            </button>
                        </div>
                    }
                </div>
                {isEditorMode &&
                    <div className={"flex justify-between"}>
                        <button onClick={() => setIsOpenNew(true)} className={cn(styles.regionalTeam__addButton, "flex text-white text-center bg-[#4A76CB] justify-center gap-2")}><p className={"hidden md:flex"}>Добавить</p><img src={plus} alt=""/></button>
                        <button onClick={() => setIsEditorMode(false)} className={cn("flex md:hidden justify-center gap-3 border-none bg-[#31AA27] text-white", styles.regionalTeam__highlightButton)}>
                            Сохранить
                        </button>
                    </div>
                }
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenNew ? '' : 'hidden'}`} onClick={() => setIsOpenNew(false)}></div>
                {isOpenNew &&
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[250px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <label className={"text-[#5E5E5E]"}>Введите ID нового участника</label>
                            <input placeholder={"ID"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            <button className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>Добавить</button>
                        </div>
                    </div>
                }
                <div className="overflow-y-auto max-h-full">
                    <table className={"w-full overflow-auto min-w-[900px]"}>
                        <thead>
                        <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]", styles.regionalTeam__tableHead)}>
                            {columns.id && <th className={cn(styles.regionalTeam__tableId, "sticky left-0 z-20 bg-[#F7F7FD]")}>ID</th>}
                            {columns.name && <th className={cn(styles.regionalTeam__tableName, "sticky z-10 bg-[#F7F7FD] border-r-[1px]", !columns.id ? "left-0" : "left-[48px]" )}>ФИО</th>}
                            {columns.date && <th className={cn(styles.regionalTeam__tableDate)}>Дата рождения</th>}
                            {columns.tg && <th className={cn(styles.regionalTeam__tableLink)}>Ссылка Telegram</th>}
                            {columns.vk && <th className={cn(styles.regionalTeam__tableLink)}>Ссылка ВКонтакте</th>}
                            {columns.color && <th className={cn(styles.regionalTeam__tableColor)}>Светофор</th>}
                            {columns.events && <th className={cn(styles.regionalTeam__tableEvents)}>Мероприятия</th>}
                            {columns.button && <th className={cn(styles.regionalTeam__tableButton)}></th>}
                            {isEditorMode &&
                                <th className={cn("min-w-8")}></th>
                            }
                        </tr>
                        </thead>
                        <tbody className={""}>
                        {data && data.map(person =>
                            <tr key={person.id} className={cn("h-[50px] border-b-[1px]", styles.regionalTeam__tableBody)}>
                                {columns.id && <th className={cn("sticky left-0 z-10 bg-white border-b-[1px]")}>{person.id}</th>}
                                {columns.name && <th className={cn("sticky z-10 bg-white border-r-[1px] border-b-[1px]", !columns.id ? "left-0" : "left-[48px]")}>
                                    <input value={person.name} className={cn("border-0 rounded-none h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.date && <th>
                                    <input value={person.date} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.tg && <th>
                                    <input value={person.tg} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.vk && <th>
                                    <input value={person.vk} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.color && <th className={"flex justify-center items-center h-16"}>
                                    <div className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 relative",
                                        person.color === "Желтый" ? "bg-[#FFF4E4] text-[#E99518]"
                                            : person.color === "Зеленый" ? "bg-[#EBF6EB] text-[#31AA27]"
                                                : person.color === "Красный" ? "bg-[#FFE3DD] text-[#FF2E00]"
                                                    : "bg-[#F1F1F1] text-[#777777]")}>
                                        {person.color}
                                        {isEditorMode &&
                                            <img src={arrowSmall} alt={"arrow"} onClick={() => toggleDropdown(person.id)} />
                                        }
                                        {openCell === person.id && (
                                            <div className="absolute z-50 w-32 mt-7 pb-2 flex flex-col items-center gap-2 bg-white">
                                                {["Желтый", "Зеленый", "Красный", "Not found"].map(color => (
                                                    <div
                                                        key={color}
                                                        className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 cursor-pointer", getColorClass(color))}
                                                        onClick={() => handleColorSelect(color, person.id)}
                                                    >
                                                        {color}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </th>}
                                {columns.events && <th className={cn(styles.regionalTeam__tableEvents)} title={person.events.join(", ")}>{person.events.join(", ")}</th>}
                                {columns.button && <th><button className={cn("bg-[#4471C9] text-white", isEditorMode && "cursor-no-drop bg-[#ABABAB]", styles.regionalTeam__newPassword)} disabled={!isEditorMode}>Выдать новый логин/пароль</button></th>}
                                {isEditorMode &&
                                    <th className={cn("min-w-8 ")}><button className={"w-full flex justify-center"}><img src={bin} alt="delete" className={"self-center"}/></button></th>
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
                        <p className={cn("text-center text-[20px]", styles.regionalTeam__filtersTitle)}>Фильтры</p>
                        <img src={cross} className={""} onClick={() => setIsFilterOpen(false)} alt="close"/>
                    </div>
                    <div className={"flex flex-col gap-5 mx-4"}>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Отображать колонки</p>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.all} onChange={handleAllChange}  type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
                                <p>Все</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.id} onClick={() => setColumns({...columns, id: !columns.id})} type="checkbox" name={"id"} className={styles.regionalTeam__checkbox}/>
                                <p>ID</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.name} onClick={() => setColumns({...columns, name: !columns.name})} type="checkbox" name={"name"} className={styles.regionalTeam__checkbox}/>
                                <p>ФИО</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.date} onClick={() => setColumns({...columns, date: !columns.date})} type="checkbox" name={"date"} className={styles.regionalTeam__checkbox}/>
                                <p>Дата рождения</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.tg} onClick={() => setColumns({...columns, tg: !columns.tg})} type="checkbox" name={"tg"} className={styles.regionalTeam__checkbox}/>
                                <p>Ссылка Telegram</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.vk} onClick={() => setColumns({...columns, vk: !columns.vk})} type="checkbox" name={"vk"} className={styles.regionalTeam__checkbox}/>
                                <p>Ссылка ВКонтакте</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.color} onClick={() => setColumns({...columns, color: !columns.color})} type="checkbox" name={"color"} className={styles.regionalTeam__checkbox}/>
                                <p>Светофор</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.events}  onClick={() => setColumns({...columns, events: !columns.events})} type="checkbox" name={"events"} className={styles.regionalTeam__checkbox}/>
                                <p>Мероприятия</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.button}  onClick={() => setColumns({...columns, button: !columns.button})} type="checkbox" name={"button"} className={styles.regionalTeam__checkbox}/>
                                <p>Выдать новый логин/пароль</p>
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
