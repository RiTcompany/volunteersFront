import styles from './AllEvents.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import InputMask from "react-input-mask";
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

interface ColumnsType {
    all: boolean,
    name: boolean,
    startDate: boolean,
    endDate: boolean,
    location: boolean,
    participants: boolean,
    teamLeader: boolean
}

interface TableDataType {
    id?: number,
    name: string,
    startTime: string,
    endTime: string,
    location: string,
    teamLeader: string
}


export function AllEvents(): React.JSX.Element {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [isOpenDelete, setIsOpenDelete] = useState<{ open: boolean, id: number }>({open: false, id: -1})
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [newEvent, setNewEvent] = useState<TableDataType>({name: "", startTime: "", endTime: "", location: "", teamLeader: ""})

    const [columns, setColumns] = useState<ColumnsType>({all: true, name: true, startDate: true, endDate: true, location: true, participants: true, teamLeader: true})

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
                all: newAll, name: newAll, startDate: newAll, endDate: newAll, location: newAll, participants: newAll, teamLeader: newAll
            };

            return newColumns;
        });
    };

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    function formatDateTime(inputDate) {
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${formattedDate} ${formattedTime}`;
    }

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("http://195.133.197.53:8082/event", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setTableData(result)
                console.log(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [isOpenNew, isOpenDelete]);

    useEffect(() => {
        console.log(newEvent)
    })

    const handleChangeNewEvent = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleAddButtonClick = async () => {
        const convertToISO = (dateStr) => {
            dateStr = dateStr.replace("  ", " ");

            const [datePart, timePart] = dateStr.split(' ');
            const [day, month, year] = datePart.split('.');
            const [hours, minutes] = timePart.split(':');

            const localDate = new Date(year, month - 1, day, hours, minutes);

            const mskOffset = -3;
            const utcDate = new Date(localDate.getTime() - (mskOffset * 60 * 60 * 1000));
            return utcDate.toISOString();
        };

        const startTimeISO = convertToISO(newEvent.startTime);
        const endTimeISO = convertToISO(newEvent.endTime);

        const dataToSend = {
            ...newEvent,
            startTime: startTimeISO,
            endTime: endTimeISO
        };

        try {
            const response = await fetch('http://195.133.197.53:8082/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            setIsOpenNew(false)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteButtonClick = async (id: number) => {
        try {
            const response = await fetch(`http://195.133.197.53:8082/event/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            setIsOpenDelete({open: false, id: -1})

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.allHeadquarters__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Таблица все мероприятий</p>
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
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[700px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите название мероприятия</label>
                                <input
                                    name="name"
                                    value={newEvent.name}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"Название"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите дату и время начала</label>
                                <InputMask
                                    name="startTime"
                                    mask="99.99.9999  99:99"
                                    value={newEvent.startTime}
                                    onChange={handleChangeNewEvent}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px] text-black"}
                                    placeholder={"ДД.ММ.ГГГГ ЧЧ:ММ"}
                                />
                                    {/*{(inputProps) => (*/}
                                    {/*    <input*/}
                                    {/*        name="startTime"*/}
                                    {/*        placeholder={"ДД.ММ.ГГГГ ЧЧ:ММ"}*/}
                                    {/*        className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}*/}
                                    {/*    />*/}
                                    {/*)}*/}
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите дату и время конца</label>
                                <InputMask
                                    name="endTime"
                                    mask="99.99.9999  99:99"
                                    value={newEvent.endTime}
                                    onChange={handleChangeNewEvent}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px] text-black"}
                                    placeholder={"ДД.ММ.ГГГГ ЧЧ:ММ"}
                                />
                                {/*<input*/}
                                {/*    name="endTime"*/}
                                {/*    value={newEvent.endTime}*/}
                                {/*    onChange={handleChangeNewEvent}*/}
                                {/*    placeholder={"ДД.ММ.ГГГГ ЧЧ:ММ"}*/}
                                {/*    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}*/}
                                {/*/>*/}
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Укажите место</label>
                                <input
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"Адрес"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Тим-лидер</label>
                                <input
                                    name="teamLeader"
                                    value={newEvent.teamLeader}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"ФИО"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <button onClick={handleAddButtonClick} className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>
                                Добавить
                            </button>
                        </div>
                    </div>
                }
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenDelete.open ? '' : 'hidden'}`} onClick={() => setIsOpenDelete({open: false, id: -1})}></div>
                {isOpenDelete.open &&
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[200px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenDelete({open: false, id: -1})}/>
                        <p className={"text-center text-[20px]"}>Вы уверены, что хотите удалить данные?</p>
                        <div className={"flex gap-3"}>
                            <button onClick={() => setIsOpenDelete({open: false, id: -1})} className={"w-2/4 p-2 text-[#5E5E5E] bg-[#E8E8F0] rounded-lg self-center mt-5"}>
                                Отмена
                            </button>
                            <button onClick={()=> handleDeleteButtonClick(isOpenDelete.id)} className={"w-2/4 p-2 text-white bg-[#FF1818] rounded-lg self-center mt-5"}>
                                Удалить
                            </button>
                        </div>
                    </div>
                }
                <div className="overflow-y-auto max-h-full">
                    <table className={"w-full overflow-auto min-w-[900px]"}>
                        <thead>
                        <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]", styles.allHeadquarters__tableHead)}>
                            {/*<th className={cn(styles.regionalTeam__tableId, "sticky left-0 z-20 bg-[#F7F7FD]")}>ID</th>*/}
                            {columns.name && <th className={cn(styles.allHeadquarters__tableName, "sticky z-10 bg-[#F7F7FD] border-r-[1px] left-0")}>Название</th>}
                            {columns.startDate && <th className={cn(styles.allHeadquarters__tablePeopleCount, "text-wrap")}>Дата/время начала</th>}
                            {columns.endDate && <th className={cn(styles.allHeadquarters__tablePeopleCount, "text-wrap")}>Дата/время конца</th>}
                            {columns.location && <th className={cn(styles.allHeadquarters__tableAddress)}>Место проведения</th>}
                            {columns.participants && <th className={cn(styles.allHeadquarters__tableName)}>Участники мероприятия</th>}
                            {columns.teamLeader && <th className={cn(styles.allHeadquarters__tablePhone)}>Тим-лидер</th>}
                            {!isEditorMode &&
                                <th className={cn("min-w-8")}></th>
                            }
                        </tr>
                        </thead>
                        <tbody className={""}>
                        {tableData && tableData.map(event =>
                            <tr key={event.id} className={cn("h-[50px] border-b-[1px]", styles.allHeadquarters__tableBody)}>
                                {/*<th className={cn("sticky left-0 z-10 bg-white border-b-[1px]")}>{hq.id}</th>*/}
                                {columns.name && <th className={cn("sticky z-10 bg-white border-r-[1px] border-b-[1px] left-0")}>
                                    <input value={event.name} className={cn("border-0 rounded-none h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.startDate && <th className={""}>
                                    <p className={cn("border-0 bg-white w-full h-full")}>{formatDateTime(event.startTime)}</p>
                                </th>}
                                {columns.endDate && <th className={""}>
                                    <p className={cn("border-0 bg-white w-full h-full")}>{formatDateTime(event.endTime)}</p>
                                </th>}
                                {columns.location && <th>
                                    <input value={event.location} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.participants && <th className={""}>
                                    <a href={"#"} className={cn("border-0 bg-white w-full h-full")}>Данные об участниках</a>
                                </th>}
                                {columns.teamLeader && <th>
                                    <input value={event.teamLeader} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {!isEditorMode &&
                                    <th className={cn("min-w-8")}><button className={"w-full flex justify-center"} onClick={() => setIsOpenDelete({open: true, id: event.id || -1})}><img src={bin} alt="delete" className={"self-center"}/></button></th>
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
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Отображать колонки</p>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.all} onChange={handleAllChange}  type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
                                <p>Все</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.name} onClick={() => setColumns({...columns, name: !columns.name})} type="checkbox" name={"name"} className={styles.regionalTeam__checkbox}/>
                                <p>Название</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.startDate} onClick={() => setColumns({...columns, startDate: !columns.startDate})} type="checkbox" name={"date"} className={styles.regionalTeam__checkbox}/>
                                <p>Дата/время начала</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.endDate} onClick={() => setColumns({...columns, endDate: !columns.endDate})} type="checkbox" name={"tg"} className={styles.regionalTeam__checkbox}/>
                                <p>Дата/время конца</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.location} onClick={() => setColumns({...columns, location: !columns.location})} type="checkbox" name={"vk"} className={styles.regionalTeam__checkbox}/>
                                <p>Место</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.participants} onClick={() => setColumns({...columns, participants: !columns.participants})} type="checkbox" name={"color"} className={styles.regionalTeam__checkbox}/>
                                <p>Участники мероприятия</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.teamLeader}  onClick={() => setColumns({...columns, teamLeader: !columns.teamLeader})} type="checkbox" name={"events"} className={styles.regionalTeam__checkbox}/>
                                <p>Тим-лидер</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
