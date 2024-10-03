import styles from './EventParticipants.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import document from "../../assets/document.svg"
// import search from "../../assets/search.svg"
import highlight from "../../assets/highlight.svg"
import lightHighlight from "../../assets/lightHighlight.svg"
import filter from "../../assets/filter.svg"
import filters from "../../assets/filters.svg"
import cross from "../../assets/darkCross.svg";
import arrowSmall from "../../assets/arrowSmall.svg";
import bin from "../../assets/delete.svg";
import plus from "../../assets/plus.svg";
import cancel from "../../assets/cancel.svg";
import {formatDateTime} from "../../utils/formatDate.ts";
import {DisplayFunctional, functionalMap, reverseFunctionalMap} from "../../utils/maps.ts";
const cn = classNames;

interface TableDataType {
    id: number,
    volunteerId: number,
    fullName: string,
    birthdayDto: {
        birthday: string,
        age: number
    },
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
    all: boolean, id: boolean, name: boolean, date: boolean, tg: boolean, funk: boolean, test: boolean, comment: boolean, rate: boolean, clothes: boolean
}

// const initialFilters = {minAge: 0, maxAge: 100, minRank: 0, eventIdList: [],
//     colorList: ["RED", "YELLOW", "GREEN", "NOT_FOUND"], hasInterview: [true, false], levelList: [], functionalList: [],
//     testing: [true, false], hasClothes: [true, false], centerIdList: [], orderByDateAsc: true, orderByDateDesc: false,
//     orderByRankAsc: true, orderByRankDesc: false
// }

export function EventParticipants(): React.JSX.Element {
    const { id } = useParams();
    const navigate = useNavigate()
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [editedData, setEditedData] = useState<EditedDataType[]>([]);
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnsType>({all: true, id: true, name: true, date: true, tg: true, funk: true, test: true, comment: true, rate: true, clothes: true})

    const [openCell, setOpenCell] = useState<number>(-1);

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
                }).filter(([, value]) => value !== undefined)
            );
            console.log(id)
            const result = await fetch(`http://195.133.197.53:8082/event_participant/${id}`, {
                method: "POST",
                body: JSON.stringify(newFilters),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })
            console.log(newFilters)
            const res = await result.json()
            setTableData(res)
            console.log(res)
        })()
    }, [isOpenNew, isEditorMode,
        // refresh
    ]);


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
                all: newAll, id: newAll, name: newAll, date: newAll, tg: newAll, funk: newAll, test: newAll, comment: newAll, rate: newAll, clothes: newAll
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
    };

    const handleSave = async () => {
        try {
            console.log(editedData)
            const response = await fetch('http://195.133.197.53:8082/volunteer', {
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

    const handleFuncSelect = (displayFunk: DisplayFunctional, id: number) => {
        const funk = functionalMap[displayFunk];
        handleInputChange(id, "functional", funk);
        toggleDropdown(id);
    };

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
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
                            <img src={filters} alt="filters" className={"right-2 top-1 flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
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
                <div className="overflow-y-auto max-h-full">
                    <table className={"w-full overflow-auto min-w-[900px]"}>
                        <thead>
                        <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]", styles.regionalTeam__tableHead)}>
                            {columns.id && <th className={cn(styles.regionalTeam__tableId, "sticky left-0 z-20 bg-[#F7F7FD]")}>ID</th>}
                            {columns.name && <th className={cn(styles.regionalTeam__tableName, "sticky z-10 bg-[#F7F7FD] border-r-[1px]", !columns.id ? "left-0" : "left-[48px]" )}>ФИО</th>}
                            {columns.date && <th className={cn(styles.regionalTeam__tableDate)}>Дата рождения</th>}
                            {columns.tg && <th className={cn(styles.regionalTeam__tableLink)}>Ссылка Telegram</th>}
                            {columns.funk && <th className={cn(styles.regionalTeam__tableColor)}>Функцинал</th>}
                            {columns.test && <th className={cn(styles.regionalTeam__tableId)}>Тестирование</th>}
                            {columns.test && <th className={cn(styles.regionalTeam__tableEvents)}>Комментарий</th>}
                            {columns.test && <th className={cn(styles.regionalTeam__tableId)}>Оценка</th>}
                            {columns.test && <th className={cn(styles.regionalTeam__tableId)}>Комплект формы выдан</th>}
                            {!isEditorMode &&
                                <th className={cn("min-w-8")}></th>
                            }
                        </tr>
                        </thead>
                        <tbody className={""}>
                        {tableData && tableData.map(person =>
                            <tr key={person.id} className={cn("h-[50px] border-b-[1px]", styles.regionalTeam__tableBody)}>
                                {columns.id && <th className={cn("sticky left-0 z-10 bg-white border-b-[1px]")}>{person.id}</th>}
                                {columns.name && <th className={cn("sticky z-10 bg-white border-r-[1px] border-b-[1px]", !columns.id ? "left-0" : "left-[48px]")}>
                                        <a href={`/volunteer/${person.id}`}
                                           onClick={(e) => {
                                               e.preventDefault();
                                               navigate(`/volunteer/${person.id}`);
                                           }}>{person.fullName}</a>
                                </th>}
                                {columns.date && <th className={"flex justify-center"}>
                                     <p className={"h-14 flex flex-col justify-center"}>{formatDateTime(person.birthdayDto.birthday).slice(0, 10)} ({person.birthdayDto.age})</p>
                                </th>}
                                {columns.tg && <th>
                                    <p className={"h-14 flex flex-col justify-center"}>{person.tgLink}</p>
                                </th>}
                                {columns.funk && <th>
                                    <div className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 relative")}>
                                        {(() => {
                                            const colorKey = getEditedValue(person.id, "color");
                                            if (typeof colorKey === "string" && colorKey in reverseFunctionalMap) {
                                                return reverseFunctionalMap[colorKey as keyof typeof reverseFunctionalMap];
                                            }
                                            return person.functional;
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
                                </th>}
                                {columns.test && <th className={"flex justify-center items-center h-16"}>
                                    <input onChange={(e) => handleInputChange(person.id, "testing", e.target.checked)} className={cn("border-0 bg-white px-1 text-center h-7 w-7", styles.custom_checkbox)} type={"checkbox"} disabled={!isEditorMode} name={"testing"}
                                           checked={getEditedValue(person.id, "testing") ?? person.testing ?? ""}/>
                                </th>}
                                {columns.comment && <th className={cn(styles.regionalTeam__tableEvents)}>
                                    {person.comment}
                                </th>}
                                {columns.rate && <th className={cn(styles.regionalTeam__tableEvents)}>
                                    <input type={"number"} name={"rank"} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} onChange={(e) => handleInputChange(person.id, "rank", e.target.value)} value={getEditedValue(person.id, "rank") ?? person.rank ?? ""} disabled={!isEditorMode}/>
                                </th>}
                                {columns.clothes && <th>
                                    <input onChange={(e) => handleInputChange(person.id, "hasClothes", e.target.checked)} className={cn("border-0 bg-white px-1 text-center h-7 w-7", styles.custom_checkbox)} type={"checkbox"} disabled={!isEditorMode} name={"hasClothes"}
                                           checked={getEditedValue(person.id, "hasClothes") ?? person.hasClothes ?? ""}/>
                                </th>}
                                {!isEditorMode &&
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
                                <input checked={columns.funk} onClick={() => setColumns({...columns, funk: !columns.funk})} type="checkbox" name={"funk"} className={styles.regionalTeam__checkbox}/>
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
                            {/*<div className={"relative w-full"}>*/}
                            {/*    <img src={search} alt="search" className={"absolute left-2 top-1"}/>*/}
                            {/*    <input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.regionalTeam__input)} />*/}
                            {/*</div>*/}
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
