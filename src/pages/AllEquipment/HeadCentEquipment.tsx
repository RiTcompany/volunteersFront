import styles from './AllEquipment.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
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
const cn = classNames;

interface ColumnsType {
    all: boolean,
    equipmentId: boolean,
    type: boolean,
    year: boolean,
    currentOwner: boolean,
    history: boolean,
    delete: boolean,
    [key: string]: boolean;
}

interface TableDataType {
    id?: number,
    equipmentId: number,
    type: string,
    year: string,
    currentOwner: string,
}

const initialColumnsOrder = [
    { id: 'equipmentId', title: 'ID', change: false  },
    { id: 'type', title: 'Тип', change: false  },
    { id: 'year', title: 'Год', change: false  },
    { id: 'currentOwner', title: 'Текущий обладатель', change: false  },
    { id: 'history', title: 'История обладателей', change: false  },
    // { id: 'delete', title: '', change: false }
];

export function HeadCentEquipment(): React.JSX.Element {
    const {type, id} = useParams()
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [isOpenDelete, setIsOpenDelete] = useState<{ open: boolean, id: number }>({open: false, id: -1})
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [newEquipment, setNewEquipment] = useState<TableDataType>({equipmentId: 0, type: "", year: "", currentOwner: ""})
    const [editedEvents, setEditedEvents] = useState<TableDataType[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true)
    const [columns, setColumns] = useState<ColumnsType>({all: true, equipmentId: true, type: true, year: true, currentOwner: true, history: true, delete: true})
    const [columnsOrder, setColumnsOrder] = useState(initialColumnsOrder);
    const [filterOptions, setFilterOptions] = useState<string[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const allSelected = selectedFilters.length === filterOptions.length;

    useEffect(() => {
        const allChecked: boolean = Object.keys(columns).every(key => key === 'all' || columns[key as keyof ColumnsType]);
        if (allChecked !== columns.all) {
            setColumns(prevState => ({
                ...prevState,
                all: allChecked
            }));
        }
    }, [columns]);

    useEffect(() => {
        (async function() {
            try {
                console.log(selectedFilters)
                const response = await fetch("https://rit-test.ru/api/v1/equipment/type_names", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                let result = await response.json()
                console.log(result)
                setFilterOptions(result)
                setSelectedFilters(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, []);

    const handleAllColumnsChange = () => {
        setColumns(prevState => {
            const newAll = !prevState.all;
            const newColumns = {
                all: newAll, equipmentId: newAll, type: newAll, year: newAll, currentOwner: newAll, history: newAll, delete: newAll
            };

            return newColumns;
        });
    };

    const handleAllTypesChange = () => {
        if (allSelected) {
            setSelectedFilters([]);
        } else {
            setSelectedFilters(filterOptions);
        }
    };

    const handleTypeChange = (type: string) => {
        if (selectedFilters.includes(type)) {
            setSelectedFilters(prev => prev.filter(t => t !== type));
        } else {
            setSelectedFilters(prev => [...prev, type]);
        }
    };

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    // const handleInputChange = (id: number, field: keyof TableDataType, value: string | number) => {
    //     setEditedEvents((prev: TableDataType[]) => {
    //         const existingEvent = prev.find(event => event.id === id);
    //         if (existingEvent) {
    //             return prev.map(event =>
    //                 event.id === id
    //                     ? { ...event, [field]: value }
    //                     : event
    //             );
    //         } else {
    //             return [...prev, { id, [field]: value } as unknown as TableDataType];
    //         }
    //     });
    // };


    // const getEditedValue = (id: number | undefined, field: keyof TableDataType) => {
    //     const editedEvent = editedEvents.find(event => event.id === id);
    //     return editedEvent ? editedEvent[field] : null;
    // };

    const handleSave = async () => {
        try {
            console.log(editedEvents)
            const response = await fetch('https://rit-test.ru/api/v1/event', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include"
                },
                body: JSON.stringify(editedEvents),
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
                console.log(selectedFilters)
                let req;
                if (type === "center") {
                    req = { centerId: id };
                } else if (type === "headquarters") {
                    req = { headquartersId: id };
                }
                console.log(JSON.stringify({typeList: selectedFilters, ...req}))

                const response = await fetch("https://rit-test.ru/api/v1/equipment", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({typeList: selectedFilters, ...req})
                })
                let result = await response.json()
                setTableData(result)
                console.log(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [isOpenNew, isOpenDelete, isEditorMode, refresh, filterOptions, type, id]);

    const handleChangeNewEquipment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEquipment(prevEquipment => ({
            ...prevEquipment,
            [name]: value
        }));
    };

    const handleAddButtonClick = async () => {
        try {
            const response = await fetch(`https://rit-test.ru/api/v1/equipment_${type}/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEquipment)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            setIsOpenNew(false)
            setTableData(prevData => [...prevData, result]);
            setRefresh(prev => !prev)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteButtonClick = async (id: number) => {
        try {
            const response = await fetch(`https://rit-test.ru/api/v1/equipment/${id}`, {
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
        const reorderedColumns = Array.from(columnsOrder);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumnsOrder(reorderedColumns);
    };

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.allHeadquarters__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Инвентарь</p>
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
                        <button onClick={() => setIsEditorMode(false)} className={cn("flex md:hidden " +
                            "justify-center gap-3 border-none bg-[#31AA27] text-white", styles.allHeadquarters__highlightButton)}>
                            Сохранить
                        </button>
                    </div>
                }
                <p className={"text-gray-500"}>Всего результатов: {tableData.length}</p>
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenNew ? '' : 'hidden'}`}
                     onClick={() => setIsOpenNew(false)}></div>
                {isOpenNew &&
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 " +
                        "bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[700px] md:transform md:-translate-x-1/2 " +
                        "md:-translate-y-1/2 p-5 overflow-y-auto"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Введите ID</label>
                                <input
                                    name="equipmentId"
                                    value={newEquipment.equipmentId}
                                    onChange={handleChangeNewEquipment}
                                    placeholder={"ID"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Укажите тип</label>
                                <input
                                    name="type"
                                    value={newEquipment.type}
                                    onChange={handleChangeNewEquipment}
                                    placeholder={"Тип"}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Укажите год</label>
                                <InputMask
                                    name="year"
                                    mask="9999"
                                    value={newEquipment.year}
                                    onChange={handleChangeNewEquipment}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px] text-black"}
                                    placeholder={"Год"}
                                />
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Укажите текущего владельца</label>
                                <input
                                    name="currentOwner"
                                    value={newEquipment.currentOwner}
                                    onChange={handleChangeNewEquipment}
                                    placeholder={"Текущий владелец"}
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
                                <table className={"w-full overflow-auto min-w-[900px]"} {...provided.droppableProps} ref={provided.innerRef}>
                                    <thead>
                                    <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]")}>
                                        {columnsOrder.map((column, index) => (
                                            columns[column.id] && (
                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                    {(provided) => (
                                                        <th
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn("bg-[#F7F7FD]", {
                                                                "sticky left-0 z-10": column.id === "equipmentId"
                                                            })}
                                                        >
                                                            {column.title}
                                                        </th>
                                                    )}
                                                </Draggable>
                                            )
                                        ))}
                                        {columns.delete && !isEditorMode && (
                                            <th className={cn("bg-[#F7F7FD] border-r-[1px]")}><div className="min-w-8"></div></th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tableData.map(eq => (
                                        <tr key={eq.id} className={cn("h-[56px] border-b-[1px]")}>
                                            {columnsOrder.map(column => (
                                                columns[column.id] && (
                                                    <td key={column.id} className={cn({
                                                        "sticky left-0 z-10 bg-white border-b-[1px]": column.id === "equipmentId"
                                                    })}>
                                                        {column.id === 'equipmentId' && (
                                                            <p className="border-0 rounded-none h-full bg-white w-full px-1 text-center">
                                                                {eq.equipmentId}
                                                            </p>
                                                        )}
                                                        {column.id === 'type' && (
                                                            <p className="border-0 rounded-none h-full bg-white w-full px-1 text-center">
                                                                {eq.type}
                                                            </p>
                                                        )}
                                                        {column.id === 'year' && (
                                                            <p className="border-0 rounded-none h-full bg-white w-full px-1 text-center">
                                                                {eq.year}
                                                            </p>
                                                        )}
                                                        {column.id === 'currentOwner' && (
                                                            <p className="border-0 rounded-none h-full bg-white w-full px-1 text-center">
                                                                {eq.currentOwner}
                                                            </p>
                                                        )}
                                                        {column.id === 'history' && (
                                                            <a href="#" className="border-0 bg-white w-full h-full text-center flex justify-center">
                                                                Смотреть историю
                                                            </a>
                                                        )}
                                                        {/*{column.id === 'delete' && !isEditorMode && (*/}
                                                        {/*    <button className="w-full flex justify-center" onClick={() => setIsOpenDelete({ open: true, id: eq.id || -1 })}>*/}
                                                        {/*        <img src={bin} alt="delete" className="self-center" />*/}
                                                        {/*    </button>*/}
                                                        {/*)}*/}
                                                    </td>
                                                )
                                            ))}
                                            {columns.delete && !isEditorMode && (
                                                <td className={"flex justify-center items-center h-14"}>
                                                    <button onClick={() => eq.id && setIsOpenDelete({id: eq.id, open: true})}>
                                                        <img src={bin} alt="delete" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                    {provided.placeholder} {/* Нужно для работы react-beautiful-dnd */}
                                </table>
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
                                <input checked={columns.all} onChange={handleAllColumnsChange}  type="checkbox" name={"all"} className={styles.regionalTeam__checkbox}/>
                                <p>Все</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.equipmentId} onClick={() => setColumns({...columns, equipmentId: !columns.equipmentId})} type="checkbox" name={"equipmentId"} className={styles.regionalTeam__checkbox}/>
                                <p>ID</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.type} onClick={() => setColumns({...columns, type: !columns.type})} type="checkbox" name={"type"} className={styles.regionalTeam__checkbox}/>
                                <p>Тип</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.year} onClick={() => setColumns({...columns, year: !columns.year})} type="checkbox" name={"year"} className={styles.regionalTeam__checkbox}/>
                                <p>Год</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.currentOwner} onClick={() => setColumns({...columns, currentOwner: !columns.currentOwner})} type="checkbox" name={"currentOwner"} className={styles.regionalTeam__checkbox}/>
                                <p>Текущий обладатель</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.history} onClick={() => setColumns({...columns, history: !columns.history})} type="checkbox" name={"history"} className={styles.regionalTeam__checkbox}/>
                                <p>Истрия обладателей</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.delete} onClick={() => setColumns({...columns, delete: !columns.delete})} type="checkbox" name={"delete"} className={styles.regionalTeam__checkbox}/>
                                <p>Удаление</p>
                            </div>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-5 mx-4"}>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Фильтр по типу</p>
                            <div className={"flex gap-2 items-center"}>
                                <input
                                    checked={allSelected}
                                    onChange={handleAllTypesChange}
                                    type="checkbox"
                                    name="all"
                                    className={styles.regionalTeam__checkbox}
                                />
                                <p>Все</p>
                            </div>
                            {filterOptions.map((type) => (
                                <div key={type} className={"flex gap-2 items-center"}>
                                    <input
                                        checked={selectedFilters.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                        type="checkbox"
                                        name={type}
                                        className={styles.regionalTeam__checkbox}
                                    />
                                    <p>{type}</p>
                                </div>
                            ))}
                            <div className={"flex justify-center my-4 items-center sticky z-55 bottom-0 bg-white h-24 p-4 gap-5"}>
                                <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#F1F1F5] text-[#5E5E5E]")} onClick={() => {
                                    setSelectedFilters(filterOptions);
                                    handleAllColumnsChange()
                                }}>Сбросить все</button>
                                <button onClick={() => {
                                    setRefresh(prev => !prev);
                                    setIsFilterOpen(false)
                                }} className={cn(styles.regionalTeam__filterBottomButton, "bg-[#3B64B3] text-white")}>Применить</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
