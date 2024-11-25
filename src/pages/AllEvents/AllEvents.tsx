import styles from './AllEvents.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import InputMask from "react-input-mask";
import document from "../../assets/document.svg"
// import search from "../../assets/search.svg"
import highlight from "../../assets/highlight.svg"
import lightHighlight from "../../assets/lightHighlight.svg"
import filter from "../../assets/filter.svg"
import filters from "../../assets/filters.svg"
import cross from "../../assets/darkCross.svg";
import bin from "../../assets/delete.svg";
import plus from "../../assets/plus.svg";
import cancel from "../../assets/cancel.svg";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {convertToISO, formatDateTime} from "../../utils/formatDate.ts";
const cn = classNames;


const initialColumns = [
    { id: 'name', title: 'Название', change: true  },
    { id: 'startTime', title: 'Дата/время начала', change: true  },
    { id: 'endTime', title: 'Дата/время конца', change: true  },
    { id: 'location', title: 'Адрес', change: true  },
    { id: 'teamLeader', title: 'Тим-лидер', change: false  },
    { id: 'participants', title: 'Данные об участниках', change: false  },
    { id: 'registrationLink', title: 'Регистрация', change: false  },
    { id: 'delete', title: '', change: false }
];

const columnsListFilter = [
    { key: 'name', label: 'Название'},
    { key: 'startTime', label: 'Дата/время начала'},
    { key: 'endTime', label: 'Дата/время конца'},
    { key: 'location', label: 'Адрес'},
    { key: 'teamLeader', label: 'Тим-лидер' },
    { key: 'participants', label: 'Данные об участниках' },
    { key: 'registrationLink', label: 'Регистрация'},
    { key: 'delete', label: 'Удаление'}
];

interface ColumnsType {
    all: boolean,
    name: boolean,
    startTime: boolean,
    endTime: boolean,
    location: boolean,
    participants: boolean,
    registrationLink: boolean,
    teamLeader: boolean,
    delete: boolean,
    [key: string]: boolean
}

interface TableDataType {
    id?: number,
    name: string,
    startTime: string,
    endTime: string,
    location: string,
    teamLeader: string,
    setParticipantLink: string,
    groupChatLink: string,
    federalId: number,
    settingParticipantLink: string,
    answerableVolunteerId: number,
    registrationLink: string,
    [key: string]: any;
}

export function AllEvents(): React.JSX.Element {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [isOpenDelete, setIsOpenDelete] = useState<{ open: boolean, id: number }>({open: false, id: -1})
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [newEvent, setNewEvent] = useState<TableDataType>({
        setParticipantLink: "",
        answerableVolunteerId: 0,
        federalId: 0,
        groupChatLink: "",
        id: 0,
        registrationLink: "",
        settingParticipantLink: "",
        name: "", startTime: "", endTime: "", location: "", teamLeader: ""})
    const [editedEvents, setEditedEvents] = useState<TableDataType[]>([]);

    const [filterColumns, setFilterColumns] = useState<ColumnsType>({all: true, name: true, startTime: true, endTime: true, location: true, participants: true, registrationLink: true, teamLeader: true, delete: true})
    const [columns, setColumns] = useState(initialColumns);

    useEffect(() => {
        const allChecked: boolean = Object.keys(filterColumns).every(key => key === 'all' || filterColumns[key as keyof ColumnsType]);
        if (allChecked !== filterColumns.all) {
            setFilterColumns(prevState => ({
                ...prevState,
                all: allChecked
            }));
        }
    }, [filterColumns]);

    const handleAllChange = () => {
        setFilterColumns(prevState => {
            const newAll = !prevState.all;
            const newColumns = {
                all: newAll, name: newAll, startTime: newAll, endTime: newAll, location: newAll, participants: newAll, registrationLink: newAll, teamLeader: newAll, delete: newAll
            };

            return newColumns;
        });
    };

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    const handleInputChange = (id: number, field: string, value: string | number) => {
        setEditedEvents((prev: TableDataType[]) => {
            const existingEvent = prev.find(event => event.id === id);
            if (existingEvent) {
                return prev.map(event =>
                    event.id === id
                        ? { ...event, [field]: value }
                        : event
                );
            } else {
                return [...prev, { id, [field]: value } as unknown as TableDataType];
            }
        });
    };


    const getEditedValue = (id: number | undefined, field: string) => {
        const editedEvent = editedEvents.find(event => event.id === id);
        return editedEvent ? (editedEvent as any)[field] : null;
    };

    const handleSave = async () => {
        const formattedEvents = editedEvents.map(event => ({...event, startTime: convertToISO(event.startTime), endTime: convertToISO(event.endTime) }));
        try {
            console.log(editedEvents)
            const response = await fetch('https://rit-test.ru/api/v1/event', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include"
                },
                body: JSON.stringify(formattedEvents),
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const result = await response.json();
            console.log('Изменения сохранены:', result);
            setEditedEvents([]);
            setIsEditorMode(false);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("https://rit-test.ru/api/v1/event", {
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
    }, [isOpenNew, isOpenDelete, isEditorMode]);

    useEffect(() => {
        console.log(newEvent)
    })

    const handleChangeNewEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleAddButtonClick = async () => {
        const startTimeISO = convertToISO(newEvent.startTime);
        const endTimeISO = convertToISO(newEvent.endTime);

        const dataToSend = {
            ...newEvent,
            startTime: startTimeISO,
            endTime: endTimeISO
        };

        try {
            const response = await fetch('https://rit-test.ru/api/v1/event', {
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
            const response = await fetch(`https://rit-test.ru/api/v1/event/${id}`, {
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

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };

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
                            <img src={cancel} alt={"cancel"} onClick={() => {setIsEditorMode(false); setEditedEvents([])}}/>
                            : <img src={lightHighlight} alt={"highlight"} onClick={() => setIsEditorMode(true)}/>
                        }

                    </button>
                </div>
                <div className={"flex justify-between gap-5 w-full"}>
                    <div className={"flex w-full md:w-auto"}>
                        <div className={"relative w-full md:w-auto"}>
                            {/*<img src={search} alt="search" className={"absolute left-2 top-1"}/>*/}
                            {/*<input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.allHeadquarters__input)} />*/}
                            <img src={filters} alt="filters" className={"right-2 top-1 flex md:hidden"}
                                 onClick={() => setIsFilterOpen(true)}/>
                        </div>
                        <button onClick={() => setIsFilterOpen(true)} className={cn("hidden md:flex " +
                            "justify-center gap-3 border-none bg-[#E8E8F0]", styles.allHeadquarters__filterButton)}>
                            <img src={filter} alt="filter"/>Фильтры
                        </button>
                    </div>
                    {!isEditorMode &&
                        <button onClick={() => setIsEditorMode(true)} className={cn("hidden md:flex " +
                            "justify-center gap-3 border-none bg-[#E8E8F0]", styles.allHeadquarters__highlightButton)}>
                            <img src={highlight} alt="highlight"/>Редактировать
                        </button>
                    }
                    {isEditorMode &&
                        <div className={"flex gap-5"}>
                            <button onClick={() => {setIsEditorMode(false); setEditedEvents([])}}
                                    className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]",
                                        styles.allHeadquarters__highlightButton)}>
                                Отменить
                            </button>
                            <button onClick={handleSave} className={cn("hidden md:flex justify-center gap-3 " +
                                "border-none bg-[#31AA27] text-white", styles.allHeadquarters__highlightButton)}>
                                Сохранить
                            </button>
                        </div>
                    }
                </div>
                {isEditorMode &&
                    <div className={"flex justify-between"}>
                        <button onClick={() => setIsOpenNew(true)} className={cn(styles.allHeadquarters__addButton,
                            "flex text-white text-center bg-[#4A76CB] justify-center gap-2")}>
                            <p className={"hidden md:flex"}>Добавить</p><img src={plus} alt=""/>
                        </button>
                        <button onClick={handleSave} className={cn("flex md:hidden " +
                            "justify-center gap-3 border-none bg-[#31AA27] text-white", styles.allHeadquarters__highlightButton)}>
                            Сохранить
                        </button>
                    </div>
                }
                <p className={"text-gray-500"}>Всего результатов: {tableData.length}</p>
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenNew ? '' : 'hidden'}`}
                     onClick={() => setIsOpenNew(false)}></div>
                {isOpenNew &&
                    <div className={"absolute rounded-lg flex flex-col md:justify-start gap-5 z-50 w-full h-4/5 left-0 " +
                        "bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:max-h-[90vh] md:transform md:-translate-x-1/2 " +
                        "md:-translate-y-1/2 p-5 overflow-y-auto"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите ID</label>
                                <input
                                    name="federalId"
                                    value={newEvent.federalId}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"ID"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
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
                                <label className={"text-[#5E5E5E]"}>Введите ID</label>
                                <input
                                    name="setParticipantLink"
                                    value={newEvent.setParticipantLink}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"Регистрация?"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Ссылка на чат</label>
                                <input
                                    name="groupChatLink"
                                    value={newEvent.groupChatLink}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"Ссылка на чат"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Ссылка</label>
                                <input
                                    name="settingParticipantLink"
                                    value={newEvent.settingParticipantLink}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"Ссылка"}
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
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>ID волонтера</label>
                                <input
                                    name="answerableVolunteerId"
                                    value={newEvent.answerableVolunteerId}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"ID"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Регистрация</label>
                                <input
                                    name="registrationLink"
                                    value={newEvent.registrationLink}
                                    onChange={handleChangeNewEvent}
                                    placeholder={"Регистрация"}
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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="overflow-y-auto max-h-full"
                                >
                                    <table className="w-full overflow-auto min-w-[300px] md:min-w-[900px]">
                                        <thead>
                                        <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]")}>
                                            {columns.filter(column => filterColumns[column.id as keyof ColumnsType] && column.id !== 'delete').map((column, index) => {
                                                console.log(columns, filterColumns)
                                                if (!filterColumns[column.id as keyof ColumnsType]) return null;
                                                return (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={cn("cursor-move", {
                                                                    [styles.allHeadquarters__tableName]: column.id === 'name',
                                                                    [styles.allHeadquarters__tablePeopleCount]: column.id === 'startTime',
                                                                    [styles.allHeadquarters__tablePeopleCount]: column.id === 'endTime',
                                                                    [styles.allHeadquarters__tableAddress]: column.id === 'location',
                                                                    [styles.allHeadquarters__tablePhone + " min-w-[200px]"]: column.id === 'participants',
                                                                    [styles.allHeadquarters__tablePhone + " min-w-[150px]"]: column.id === 'registrationLink',
                                                                    [styles.allHeadquarters__tablePhone + " min-w-[200px]"]: column.id === 'teamLeader',
                                                                    ['min-w-8']: column.id === 'delete',
                                                                    ["hidden"]: column.id === 'delete' && isEditorMode
                                                                })}
                                                            >
                                                                {column.title}
                                                            </th>
                                                        )}
                                                    </Draggable>
                                                )})}
                                            {filterColumns.delete && !isEditorMode && (
                                                <th className="min-w-8"/>
                                            )}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableData && tableData.map((hq, index) => (
                                            <tr key={index} className={cn("h-[50px] border-b-[1px]")}>
                                                {columns.filter(column => filterColumns[column.id] && column.id !== 'delete').map((column) => (
                                                    <td key={column.id}>
                                                        {column.id === "endTime" || column.id === "startTime" ? (
                                                            <InputMask
                                                                name={column.id}
                                                                mask="99.99.9999  99:99"
                                                                value={hq.id && column.id && (getEditedValue(hq.id, column.id) ?? formatDateTime(hq[column.id]))}
                                                                onChange={(e) => hq.id && column.id && handleInputChange(hq.id, column.id, e.target.value)}
                                                                className={cn("border-0 rounded-none h-14 bg-white w-full px-1 text-center min-w-max", isEditorMode && "border-[1px]" )}
                                                                placeholder={"ДД.ММ.ГГГГ ЧЧ:ММ"}
                                                                disabled={!isEditorMode}/>
                                                        ) : column.id === "participants" ? (
                                                            <Link to={`/event_participants/${hq.id}`}>Данные об участниках</Link>
                                                        ) : column.id !== 'delete' && column.change ? (
                                                            <input
                                                                value={(hq.id && column.id && getEditedValue(hq.id, column.id)) ?? (column.id in hq ? hq[column.id as keyof typeof hq] : null)}
                                                                onChange={(e) => hq.id && column.id && handleInputChange(hq.id, column.id, e.target.value)}
                                                                // value={hq[column.id]}
                                                                className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]")}
                                                                disabled={!isEditorMode}
                                                            />
                                                        ) : column.id !== 'delete' && !column.change ? (
                                                            <p className={cn("border-0 h-full bg-white w-full px-1 text-center text-black", isEditorMode && "text-gray-300")}>
                                                                {column.id && (column.id in hq && typeof hq[column.id] === 'object' ?
                                                                    (hq[column.id]?.name && hq[column.id]?.name) : hq[column.id])}
                                                            </p>
                                                        ) : (
                                                            !isEditorMode && (
                                                                <button className="w-full flex justify-center">
                                                                    <img src={bin} alt="delete" className="self-center" />
                                                                </button>
                                                            )
                                                        )}
                                                    </td>
                                                ))}
                                                {filterColumns.delete && !isEditorMode && (
                                                    <td>
                                                        <button onClick={() => hq.id && setIsOpenDelete({id: hq.id, open: true})}>
                                                            <img src={bin} alt="delete" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
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
                                <input checked={filterColumns.all} onChange={handleAllChange}  type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
                                <p>Все</p>
                            </div>
                            {columnsListFilter.map((column) => (
                                <div key={column.key} className={"flex gap-2 items-center"}>
                                    <input
                                        checked={filterColumns[column.key]}
                                        onClick={() => setFilterColumns({...filterColumns, [column.key]: !filterColumns[column.key]})}
                                        type="checkbox"
                                        name={column.key}
                                        className={styles.regionalTeam__checkbox}
                                    />
                                    <p>{column.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
