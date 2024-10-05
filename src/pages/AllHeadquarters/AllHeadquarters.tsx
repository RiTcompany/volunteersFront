import styles from './AllHeadquarters.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
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
const cn = classNames;
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialColumns = [
    // { id: 'federalId', title: 'ID', change: false  },
    { id: 'name', title: 'Название', change: true  },
    { id: 'participantCount', title: 'Количество участников', change: false  },
    { id: 'location', title: 'Адрес', change: true  },
    { id: 'contact', title: 'Контакт', change: true  },
    { id: 'teamLeader', title: 'Лидер', change: false  },
    { id: 'delete', title: '', change: false }
];

const columnsListFilter = [
    // { key: 'federalId', label: 'ID'},
    { key: 'name', label: 'Название'},
    { key: 'participantCount', label: 'Кол-во участников'},
    { key: 'location', label: 'Место'},
    { key: 'contact', label: 'Контакты'},
    { key: 'teamLeader', label: 'Лидер' },
    { key: 'delete', label: 'Удаление'}
];

interface FilterColumnsType {
    all: boolean, name: boolean, participantCount: boolean, location: boolean, contact: boolean, teamLeader: boolean, delete: boolean, [key: string]: boolean;
}

interface TableDataType {
    id?: number,
    federalId: number,
    rank: number,
    name: string,
    participantCount: number,
    location: string,
    contact: string,
    teamLeaderVolunteerId: number,
    [key: string]: any;
}

export function AllHeadquarters(): React.JSX.Element {
    const [tableData, setTableData] = useState<TableDataType[]>([])

    const [editedCenters, setEditedCenters] = useState<TableDataType[]>([]);

    const [newCenter, setNewCenter] = useState<TableDataType>({
        federalId: 0, rank: 0, teamLeaderVolunteerId: 0, contact: "", participantCount: 0, name: "", location: ""})

    const [columns, setColumns] = useState(initialColumns);
    const [filterColumns, setFilterColumns] = useState<FilterColumnsType>({
        // federalId: true,
        teamLeader: true,
        all: true, name: true, participantCount: true, location: true, contact: true, delete: true});
    const [isOpenDelete, setIsOpenDelete] = useState<{ id: number, open: boolean }>({id: -1, open: false})

    useEffect(() => {
        const allChecked: boolean = Object.keys(filterColumns).every(key => key === 'all' || filterColumns[key as keyof FilterColumnsType]);
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
                all: newAll, name: newAll, participantCount: newAll, location: newAll, contact: newAll, teamLeader: newAll, delete: newAll
            };

            return newColumns;
        });
    };

    const handleChangeNewCenter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCenter(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleAddButtonClick = async () => {
        console.log(newCenter)
        try {
            const response = await fetch('http://195.133.197.53:8082/headquarters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCenter)
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

    const handleInputChange = (id: number, field: string, value: string | number) => {
        setEditedCenters((prev: TableDataType[]) => {
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
        const editedEvent = editedCenters.find(event => event.id === id);
        return editedEvent ? (editedEvent as any)[field] : null;
    };

    const handleSave = async () => {
        try {
            console.log(editedCenters)
            const response = await fetch('http://195.133.197.53:8082/headquarters', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include"
                },
                body: JSON.stringify(editedCenters),
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const result = await response.json();
            console.log('Изменения сохранены:', result);
            setEditedCenters([]);
            setIsEditorMode(false);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const handleDeleteButtonClick = async (id: number) => {
        try {
            const response = await fetch(`http://195.133.197.53:8082/headquarters/${id}`, {
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

    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("http://195.133.197.53:8082/headquarters", {
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

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.allHeadquarters__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Таблица всех штабов</p>
                    </div>
                    <button className={"flex md:hidden"}>
                        {isEditorMode ?
                            <img src={cancel} alt={"cancel"} onClick={() => setIsEditorMode(false)}/>
                            : <img src={lightHighlight} alt={"highlight"} onClick={() => setIsEditorMode(true)}/>
                        }

                    </button>
                </div>
                <div className={"flex justify-between gap-5 w-full"}>
                    <div className={"flex w-full md:w-auto"}>
                        <div className={"relative w-full md:w-auto"}>
                            {/*<img src={search} alt="search" className={"absolute left-2 top-1"}/>*/}
                            {/*<input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.allHeadquarters__input)} />*/}
                            <img src={filters} alt="filters" className={" flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
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
                            <button onClick={() => {setIsEditorMode(false); setEditedCenters([])}}
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
                        <button onClick={() => setIsOpenNew(true)} className={cn(styles.allHeadquarters__addButton, "flex text-white text-center bg-[#4A76CB] justify-center gap-2")}><p className={"hidden md:flex"}>Добавить</p><img src={plus} alt=""/></button>
                        <button onClick={() => setIsEditorMode(false)} className={cn("flex md:hidden justify-center gap-3 border-none bg-[#31AA27] text-white", styles.allHeadquarters__highlightButton)}>
                            Сохранить
                        </button>
                    </div>
                }
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenNew ? '' : 'hidden'}`} onClick={() => setIsOpenNew(false)}></div>
                {isOpenNew &&
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[850px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите ID</label>
                                <input name={"federalId"} onChange={handleChangeNewCenter} placeholder={"ID"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите рейтинг</label>
                                <input name={"rank"} onChange={handleChangeNewCenter} placeholder={"Рейтинг"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите название</label>
                                <input name={"name"} onChange={handleChangeNewCenter} placeholder={"Название"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            {/*<div className={"flex flex-col gap-3"}>*/}
                            {/*    <label className={"text-[#5E5E5E]"}>Введите количество участников</label>*/}
                            {/*    <input name={"participantCount"} onChange={handleChangeNewCenter} placeholder={"Количество учатников"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>*/}
                            {/*</div>*/}
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите адрес</label>
                                <input name={"location"} onChange={handleChangeNewCenter} placeholder={"Адрес"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите контакты</label>
                                <input name={"contact"} onChange={handleChangeNewCenter} placeholder={"Контакты"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите ID лидера</label>
                                <input name={"teamLeaderVolunteerId"} onChange={handleChangeNewCenter} placeholder={"ID"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <button onClick={handleAddButtonClick} className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>Добавить</button>
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
                <p className={"text-gray-500"}>Всего результатов: {tableData.length}</p>
                <div className="overflow-y-auto max-h-full">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="overflow-y-auto max-h-full"
                                >
                                    <table className="w-full overflow-auto min-w-[900px]">
                                        <thead>
                                        <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]")}>
                                            {columns.filter(column => filterColumns[column.id as keyof FilterColumnsType] && column.id !== 'delete').map((column, index) => {
                                                console.log(columns, filterColumns)
                                                if (!filterColumns[column.id]) return null;
                                                return (
                                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                                        {(provided) => (
                                                            <th
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={cn("cursor-move", {
                                                                    [styles.allHeadquarters__tableName]: column.id === 'name',
                                                                    [styles.allHeadquarters__tablePeopleCount]: column.id === 'participantCount',
                                                                    [styles.allHeadquarters__tableAddress]: column.id === 'location',
                                                                    [styles.allHeadquarters__tablePhone]: column.id === 'contact',
                                                                    [styles.allHeadquarters__tablePhone]: column.id === 'teamLeader',
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
                                        {tableData && tableData.map((hq: TableDataType) => (
                                            <tr key={hq.id} className={cn("h-[50px] border-b-[1px]")}>
                                                {columns.filter(column => filterColumns[column.id]).filter(column => column.id !== 'delete').map((column) => (
                                                    <td key={column.id}>
                                                        {column.id === 'name' ? (
                                                            <div className={"w-full flex justify-center items-center"}>
                                                                {isEditorMode ? (
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            (hq.id && column.id && getEditedValue(hq.id, column.id)) ??
                                                                            (column.id in hq ? hq[column.id as keyof typeof hq] : null)
                                                                        }
                                                                        onChange={(e) => hq.id && column.id && handleInputChange(hq.id, column.id, e.target.value)}
                                                                        className="border-[1px] bg-white w-full px-1 text-center text-black h-14"
                                                                    />
                                                                ) : (
                                                                    <a
                                                                        href={`/headquarters/${hq.id}`}
                                                                        className={cn(
                                                                            "border-0 bg-white w-full px-1 text-center text-black h-full",
                                                                            "text-blue-500 underline cursor-pointer"
                                                                        )}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            navigate(`/headquarters/${hq.id}`);
                                                                        }}
                                                                        style={{ textDecoration: 'none' }}
                                                                    >
                                                                        {(hq.id && column.id && getEditedValue(hq.id, column.id)) ??
                                                                            (column.id in hq ? hq[column.id as keyof typeof hq] : null)}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        ) : column.id !== 'delete' && column.change ? (
                                                            <input
                                                                value={(hq.id && column.id && getEditedValue(hq.id, column.id)) ?? (column.id in hq ? hq[column.id as keyof typeof hq] : null)}
                                                                onChange={(e) => hq.id && column.id && handleInputChange(hq.id, column.id, e.target.value)}
                                                                // value={hq[column.id]}
                                                                className={cn("border-0 h-14 bg-white w-full px-1 text-center text-black", isEditorMode && "border-[1px]")}
                                                                disabled={!isEditorMode}
                                                            />
                                                        ) : column.id !== 'delete' && !column.change ? (
                                                            <p className={cn("border-0 h-full bg-white w-full px-1 text-center text-black", isEditorMode && "text-gray-300" )}>
                                                                {column.id && (column.id in hq && typeof hq[column.id] === 'object' ?
                                                                    (hq[column.id]?.name && hq[column.id]?.name) : hq[column.id])}
                                                            </p>
                                                        ) : null
                                                        }
                                                    </td>
                                                ))}
                                                {filterColumns.delete && !isEditorMode && hq.id && (
                                                    <td>
                                                        <button className="w-full flex justify-center" onClick={() => hq.id && setIsOpenDelete({id: hq.id, open: true})}>
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
                        <p className={styles.regionalTeam__miniTitle}>Отображать колонки</p>
                        <div className={"flex gap-2 items-center"}>
                            <input checked={filterColumns.all} onChange={handleAllChange} type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
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
            }
        </div>
    )
}
