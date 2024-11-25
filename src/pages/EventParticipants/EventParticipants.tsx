import styles from './EventParticipants.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import document from "../../assets/document.svg"
// import search from "../../assets/search.svg"
import highlight from "../../assets/highlight.svg"
import lightHighlight from "../../assets/lightHighlight.svg"
import filter from "../../assets/filter.svg"
import filtersImg from "../../assets/filters.svg"
import cross from "../../assets/darkCross.svg";
import arrowSmall from "../../assets/arrowSmall.svg";
// import bin from "../../assets/delete.svg";
import plus from "../../assets/plus.svg";
import cancel from "../../assets/cancel.svg";
import {formatDateTime} from "../../utils/formatDate.ts";
import {DisplayFunctional, functionalMap, reverseFunctionalMap} from "../../utils/maps.ts";
import {FiltersType} from "../../utils/type.ts";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
const cn = classNames;

interface TableDataType {
    id: number,
    volunteerId: number,
    fullName: string,
    birthdayDto: {
        birthday: string,
        age: number
    } | null,
    tgLink: string,
    functional: string,
    testing: boolean,
    comment: string,
    rank: number,
    hasClothes: boolean
}

interface EditedDataType {
    id: number,
    func?: string,
    comment?: string,
    rate?: number,
    hasClothes?: boolean
}

interface ColumnsType {
    all: boolean, id: boolean, name: boolean, date: boolean, tg: boolean, functional: boolean, test: boolean, comment: boolean, rate: boolean, clothes: boolean, [key: string]: boolean;
}

const initialFilters = {minAge: "", maxAge: "", minRank: "", eventIdList: [],
    colorList: [], hasInterview: [], levelList: [], functionalList: [],
    testing: [], hasClothes: [], centerIdList: [], headquartersIdList: [], orderByDateAsc: true, orderByDateDesc: false,
    orderByRankAsc: true, orderByRankDesc: false
}

export function EventParticipants(): React.JSX.Element {
    const { id } = useParams();
    const navigate = useNavigate()
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [tableDataLength, setTableDataLength] = useState<number>(0)
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [editedData, setEditedData] = useState<EditedDataType[]>([]);
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnsType>({all: true, id: true, name: true, date: true, tg: true, functional: true, test: true, comment: true, rate: true, clothes: true})

    const [openCell, setOpenCell] = useState<number>(-1);
    const [filters, setFilters] = useState<FiltersType>(initialFilters)
    const [refresh, setRefresh] = useState<boolean>(true)

    const areAllTestingSelected = (tests: boolean[]) => {
        return tests.includes(true) && tests.includes(false);
    };
    const isAllTestChecked = areAllTestingSelected(filters.testing);

    const areAllClothesSelected = (clothes: boolean[]) => {
        return clothes.includes(true) && clothes.includes(false);
    };

    const isAllClothesChecked = areAllClothesSelected(filters.hasClothes);


    const handleFiltersChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setFilters((prev) => {
            if (type === 'checkbox') {
                if (name === 'allTest') {
                    return {
                        ...prev,
                        testing: checked ? [true, false] : [],
                    };
                }

                if (name === 'yes') {
                    const updatedTesting = checked
                        ? [...prev.testing, true]
                        : prev.testing.filter((test) => test !== true);

                    return {
                        ...prev,
                        testing: updatedTesting,
                    };
                }

                if (name === 'no') {
                    const updatedTesting = checked
                        ? [...prev.testing, false]
                        : prev.testing.filter((test) => test !== false);

                    return {
                        ...prev,
                        testing: updatedTesting,
                    };
                }

                if (name === 'allClothes') {
                    return {
                        ...prev,
                        hasClothes: checked ? [true, false] : [],
                    };
                }

                if (name === 'hasClothes') {
                    const updatedTesting = checked
                        ? [...prev.hasClothes, true]
                        : prev.hasClothes.filter((clothes) => clothes !== true);

                    return {
                        ...prev,
                        hasClothes: updatedTesting,
                    };
                }

                if (name === 'noClothes') {
                    const updatedTesting = checked
                        ? [...prev.hasClothes, false]
                        : prev.hasClothes.filter((clothes) => clothes !== false);

                    return {
                        ...prev,
                        hasClothes: updatedTesting,
                    };
                }

                return { ...prev, [name]: checked };
            }

            return { ...prev, [name]: Number(value) };
        });
    };

    useEffect(() => {
        (async function() {
            const newFilters = Object.fromEntries(
                Object.entries(filters).map(([key, value]) => {
                    if (Array.isArray(value) && value.length === 0) {
                        return [key, undefined];
                    }
                    if (Array.isArray(value) && (value as boolean[]).includes(true) && (value as boolean[]).includes(false)) {
                        return [key, undefined];
                    }
                    if (Array.isArray(value) && value.length === 1 && typeof value[0] === "boolean") {
                        return [key, value[0]];
                    }
                    return [key, value];
                }).filter(([, value]) => value !== undefined && value !== '')
            );
            console.log(id)
            const result = await fetch(`https://rit-test.ru/api/v1/event_participant/${id}`, {
                method: "POST",
                body: JSON.stringify(newFilters),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })
            console.log(newFilters)
            if (result.ok) {
                const res = await result.json()
                setTableData(res)
                setTableDataLength(res.length)
                console.log(res)
            } else {
                throw Error
            }
        })()
    }, [isOpenNew, isEditorMode, refresh, id]);


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
                all: newAll, id: newAll, name: newAll, date: newAll, tg: newAll, functional: newAll, test: newAll, comment: newAll, rate: newAll, clothes: newAll
            };

            return newColumns;
        });
    };

    const handleInputChange = (id: number, field: string, value: string | number | boolean) => {
        setEditedData((prev) => {
            const existingData = prev.find(person => person.id === id);
            if (existingData) {
                return prev.map(person =>
                    person.id === id
                        ? { ...person, [field]: value }
                        : person
                );
            } else {
                return [...prev, { id, [field]: value } as unknown as TableDataType];
            }
        });
        console.log(editedData)
    };

    const handleSave = async () => {
        try {
            console.log(editedData)
            const response = await fetch('https://rit-test.ru/api/v1/volunteer', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include"
                },
                body: JSON.stringify(editedData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const result = await response.json();
            console.log('Изменения сохранены:', result);
            setEditedData([]);
            setIsEditorMode(false);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };


    const getEditedValue = (id: number | undefined, field: string) => {
        const editedPerson = editedData.find(person => person.id === id);
        return editedPerson ? (editedPerson as any)[field] : null;
    };

    // const handleAddNewPerson = () => {
    //
    // }

    const toggleDropdown = (cellId: number) => {
        setOpenCell(openCell === cellId ? -1 : cellId);
    };

    const handleFuncSelect = (displayFunctional: DisplayFunctional, id: number) => {
        const functional = functionalMap[displayFunctional];
        handleInputChange(id, "functional", functional);
        toggleDropdown(id);
    };

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    useEffect(() => {
        console.log(isEditorMode)
    })

    const [columnOrder, setColumnOrder] = useState([
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'ФИО' },
        { id: 'date', title: 'Дата рождения' },
        { id: 'tg', title: 'Ссылка Telegram' },
        { id: 'functional', title: 'Функционал' },
        { id: 'test', title: 'Тестирование' },
        { id: 'comment', title: 'Комментарий' },
        { id: 'rate', title: 'Оценка' },
        { id: 'clothes', title: 'Комплект формы выдан' }
    ]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const reorderedColumns = Array.from(columnOrder);
        const [removed] = reorderedColumns.splice(source.index, 1);
        reorderedColumns.splice(destination.index, 0, removed);

        setColumnOrder(reorderedColumns);
    };

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.regionalTeam__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Участники мероприятия</p>
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
                            {/*<input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.regionalTeam__input)} />*/}
                            <img src={filtersImg} alt="filters" className={"right-2 top-1 flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
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
                            <button onClick={() => {
                                setIsEditorMode(false); setEditedData([])
                            }} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__highlightButton)}>
                                Отменить
                            </button>
                            <button onClick={() => handleSave()} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#31AA27] text-white", styles.regionalTeam__highlightButton)}>
                                Сохранить
                            </button>
                        </div>
                    }
                </div>
                {isEditorMode &&
                    <div className={"flex justify-between"}>
                        <button onClick={() => setIsOpenNew(true)} className={cn(styles.regionalTeam__addButton, "flex text-white text-center bg-[#4A76CB] justify-center gap-2")}><p className={"hidden md:flex"}>Добавить</p><img src={plus} alt=""/></button>
                        <button onClick={() => handleSave()} className={cn("flex md:hidden justify-center gap-3 border-none bg-[#31AA27] text-white", styles.regionalTeam__highlightButton)}>
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
                <p className={"text-gray-500"}>Всего результатов: {tableDataLength}</p>
                <div className="overflow-y-auto max-h-full">

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="columns-droppable" direction="horizontal">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <table className="w-full overflow-auto">
                                        <thead>
                                        <tr className="sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]">
                                            {columnOrder.map((column, index) => (
                                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                                    {(provided) => (
                                                        <th
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`cursor-move text-center px-4 ${columns[column.id] ? "" : "hidden"}`}
                                                        >
                                                            {column.title}
                                                        </th>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableData && tableData.map((person) => (
                                            <tr key={person.id}>
                                                {columnOrder.map((column) => (
                                                    <td key={column.id} className={columns[column.id] ? "" : "hidden"}>
                                                        {column.id === 'id' && columns.id && (
                                                            <p className="flex justify-center items-center h-14">{person.volunteerId}</p>
                                                        )}
                                                        {column.id === 'name' && columns.name && (
                                                            <a
                                                                className="flex justify-center items-center h-14"
                                                                href={`/volunteer/${person.id}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    navigate(`/volunteer/${person.id}`);
                                                                }}
                                                            >
                                                                {person.fullName}
                                                            </a>
                                                        )}
                                                        {column.id === 'date' && columns.date && (
                                                            <p className="flex justify-center items-center h-14">
                                                                {/*@ts-ignore*/}
                                                                {(person.birthdayDto ? formatDateTime(person.birthdayDto.birthday)?.slice(0, 10) : "")} ({person.birthdayDto?.age})
                                                            </p>
                                                        )}
                                                        {column.id === 'tg' && columns.tg && (
                                                            <p className="flex justify-center items-center h-14">{person.tgLink}</p>
                                                        )}
                                                        {column.id === 'functional' && columns.functional && (
                                                            <div className="flex justify-center items-center h-14 relative" >
                                                                {(() => {
                                                                    const functionalKey = getEditedValue(person.id, "functional") || person.functional;
                                                                    if (typeof functionalKey === "string" && functionalKey in reverseFunctionalMap) {
                                                                        return reverseFunctionalMap[functionalKey as keyof typeof reverseFunctionalMap];
                                                                    }
                                                                    return "Не выбрано";
                                                                })()}
                                                                {isEditorMode &&
                                                                    <img src={arrowSmall} alt={"arrow"} onClick={() => toggleDropdown(person.id)} />
                                                                }
                                                                {openCell === person.id && (
                                                                    <div className="absolute z-50 w-32 mt-7 pb-2 flex flex-col items-center gap-2 bg-white">
                                                                        {(["Волонтёр", "Организатор"] as DisplayFunctional[]).map(displayFunk => (
                                                                            <div
                                                                                key={displayFunk}
                                                                                className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 cursor-pointer")}
                                                                                onClick={() => handleFuncSelect(displayFunk, person.id)}
                                                                            >
                                                                                {displayFunk}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {column.id === 'test' && columns.test && (
                                                            <div className="flex justify-center items-center h-14">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={getEditedValue(person.id, "testing") ?? person.testing ?? ""}
                                                                    onChange={(e) => handleInputChange(person.id, "testing", e.target.checked)}
                                                                    className={cn("border-0 bg-white px-1 text-center h-7 w-7 flex justify-center items-center", styles.custom_checkbox)}
                                                                    disabled={!isEditorMode}
                                                                />
                                                            </div>
                                                        )}
                                                        {column.id === 'comment' && columns.comment && (
                                                            <p className="flex justify-center items-center h-14">{person.comment}</p>
                                                        )}
                                                        {column.id === 'rate' && columns.rate && (
                                                            <input
                                                                type="number"
                                                                value={getEditedValue(person.id, "rank") ?? person.rank ?? ""}
                                                                onChange={(e) => handleInputChange(person.id, "rank", e.target.value)}
                                                                className={cn("border-0 h-14 bg-white w-full px-1 text-center flex justify-center items-center", isEditorMode && "border-[1px]")}
                                                                disabled={!isEditorMode}
                                                            />
                                                        )}
                                                        {column.id === 'clothes' && columns.clothes && (
                                                            <div className="flex justify-center items-center h-14">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={getEditedValue(person.id, "hasClothes") ?? person.hasClothes ?? ""}
                                                                    onChange={(e) => handleInputChange(person.id, "hasClothes", e.target.checked)}
                                                                    className={cn("border-0 bg-white px-1 text-center h-7 w-7", styles.custom_checkbox)}
                                                                    disabled={!isEditorMode}
                                                                />
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
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
                                <input checked={columns.functional} onClick={() => setColumns({...columns, functional: !columns.functional})} type="checkbox" name={"functional"} className={styles.regionalTeam__checkbox}/>
                                <p>Функционал</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.test} onClick={() => setColumns({...columns, test: !columns.test})} type="checkbox" name={"test"} className={styles.regionalTeam__checkbox}/>
                                <p>Тестирование</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.comment}  onClick={() => setColumns({...columns, comment: !columns.comment})} type="checkbox" name={"comment"} className={styles.regionalTeam__checkbox}/>
                                <p>Комментарий</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.rate}  onClick={() => setColumns({...columns, rate: !columns.rate})} type="checkbox" name={"rate"} className={styles.regionalTeam__checkbox}/>
                                <p>Оценка</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.clothes}  onClick={() => setColumns({...columns, clothes: !columns.clothes})} type="checkbox" name={"clothes"} className={styles.regionalTeam__checkbox}/>
                                <p>Комплект формы выдан</p>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Рейтинг</p>
                            <div className={"flex gap-5 justify-between"}>
                                <div className={"flex flex-col flex-1 self-start gap-2"}>
                                    <label>От</label>
                                    <input
                                        className={styles.regionalTeam__ageInput}
                                        name="minRank"
                                        type="number"
                                        onChange={handleFiltersChange}
                                        value={filters.minRank}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="rankAsc"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.orderByRankAsc}
                                    onChange={handleFiltersChange}
                                />
                                <p>По возрастанию</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="rankDesc"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.orderByRankDesc}
                                    onChange={handleFiltersChange}
                                />
                                <p>По убыванию</p>
                            </div>
                            {/*</div>*/}
                            <div className={"flex flex-col gap-2"}>
                                <p className={styles.regionalTeam__miniTitle}>Возраст</p>
                                <div className={"flex gap-5 justify-between"}>
                                    <div className={"flex flex-col flex-1 self-start gap-2"}>
                                        <label>От</label>
                                        <input
                                            className={styles.regionalTeam__ageInput}
                                            name="minAge"
                                            type="number"
                                            value={filters.minAge}
                                            onChange={handleFiltersChange}
                                        />
                                    </div>
                                    <div className={"flex flex-col flex-1 self-start gap-2"}>
                                        <label>До</label>
                                        <input
                                            className={styles.regionalTeam__ageInput}
                                            name="maxAge"
                                            type="number"
                                            value={filters.maxAge}
                                            onChange={handleFiltersChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="dateAsc"
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.orderByDateAsc}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>По возрастанию</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="dateDesc"
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.orderByDateDesc}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>По убыванию</p>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <p className={styles.regionalTeam__miniTitle}>Тестирование</p>
                                <div className={"flex gap-2 items-center"}>
                                    <input
                                        type="checkbox"
                                        name="allTest"
                                        className={styles.regionalTeam__checkbox}
                                        checked={isAllTestChecked}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>Все</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="yes"
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.testing.includes(true)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>Пройдено</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="no"
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.testing.includes(false)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>Не пройдено</p>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <p className={styles.regionalTeam__miniTitle}>Форма</p>
                                <div className={"flex gap-2 items-center"}>
                                    <input
                                        type="checkbox"
                                        name="allClothes"
                                        className={styles.regionalTeam__checkbox}
                                        checked={isAllClothesChecked}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>Все</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="hasClothes"
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.hasClothes.includes(true)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>Выдана</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="noClothes"
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.hasClothes.includes(false)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>Не выдана</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"flex justify-center my-4 items-center sticky z-55 bottom-0 bg-white h-24 p-4 gap-5"}>
                        <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#F1F1F5] text-[#5E5E5E]")} onClick={() => {
                            setFilters(initialFilters); setRefresh(prevState => !prevState); setIsFilterOpen(false)}}>Сбросить все</button>
                        <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#3B64B3] text-white")} onClick={() => {
                            setRefresh(prevState => !prevState);
                            setIsFilterOpen(false)
                        }}>Применить</button>
                    </div>
                </div>
            }
        </div>
    )
}
