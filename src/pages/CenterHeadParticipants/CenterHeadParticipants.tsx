import styles from './CenterHeadParticipants.module.css'
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
import bin from "../../assets/delete.svg";
import cancel from "../../assets/cancel.svg";
import {convertToISO, formatDateTime} from "../../utils/formatDate.ts";
import {colorMap, DisplayColor, DisplayStep, reverseColorMap, reverseStepMap, stepMap} from "../../utils/maps.ts";
import InputMask from "react-input-mask";
import {FiltersType} from "../../utils/type.ts";

const cn = classNames;

interface TableDataType {
    id: number,
    volunteerId: number,
    fullName: string,
    birthday: { birthday: string, age: number },
    tgLink: string,
    vkLink: string,
    color: string,
    eventLinkList: [{ id: number, name: string }],
    comment: string,
    rank: number,
    hasInterview: boolean,
    level: string,
}

interface EditedDataType {
    id: number,
    fullName?: string,
    birthday?: string,
    tgLink?: string,
    vkLink?: string,
    color?: string,
    comment?: string,
    hasInterview?: boolean,
    level?: string,
    // centerId?: number,
    // headquartersId?: number
}

interface ColumnsType {
    all: boolean, id: boolean, name: boolean, date: boolean, tg: boolean, vk: boolean, color: boolean, comment: boolean, rate: boolean, interview: boolean, step: boolean
}

export function CenterHeadParticipants(): React.JSX.Element {
    const navigate = useNavigate()
    const {type, id} = useParams()
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [editedData, setEditedData] = useState<EditedDataType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [centers, setCenters] = useState<{id: number, name: string}[]>([])
    const [headquarters, setHeadquarters] = useState<{id: number, name: string}[]>([])
    const [columns, setColumns] = useState<ColumnsType>({all: true, id: true, name: true, date: true, tg: true, vk: true, color: true, comment: true, rate: true, interview: true, step: true})
    const [refresh, setRefresh] = useState(false)

    const [openCell, setOpenCell] = useState<number>(-1);
    const [openStepCell, setOpenStepCell] = useState<number>(-1);

    const initialFilters = {minAge: 0, maxAge: 100, minRank: 0, eventIdList: [],
        colorList: [], hasInterview: [], levelList: [], functionalList: [],
        testing: [], hasClothes: [], centerIdList: [], headquartersIdList: [], orderByDateAsc: true, orderByDateDesc: false,
        orderByRankAsc: true, orderByRankDesc: false
    }

    const [filters, setFilters] = useState<FiltersType>(initialFilters)

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("http://195.133.197.53:8082/center", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setCenters(result)
                console.log(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, []);

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("http://195.133.197.53:8082/headquarters", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setHeadquarters(result)
                console.log(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, []);

    const areAllInterviewsSelected = (interviews: boolean[]) => {
        return interviews.includes(true) && interviews.includes(false);
    };

    const areAllColorsSelected = (colors: string[]) => {
        const allColors = ["RED", "YELLOW", "GREEN", "NOT_FOUND"];
        return allColors.every(color => colors.includes(color));
    };

    const areAllHeadsSelected = (headquartersIdList: number[], headquarters: {id: number, name: string}[]) => {
        return headquarters.every((hq) => headquartersIdList.includes(hq.id));
    };

    const areAllCentersSelected = (centerIdList: number[], centers: {id: number, name: string}[]) => {
        return centers.every((cen) => centerIdList.includes(cen.id));
    };

    const isAllStepsSelected = (levelList: string[]) => {
        return Object.values(stepMap).every(step => levelList.includes(step));
    };

    const isAllStepsChecked = isAllStepsSelected(filters.levelList);
    const isAllHeadsChecked = areAllHeadsSelected(filters.headquartersIdList, headquarters);
    const isAllCentersChecked = areAllCentersSelected(filters.centerIdList, centers);
    const isAllColorsChecked = areAllColorsSelected(filters.colorList);
    const isAllInterviewsChecked = areAllInterviewsSelected(filters.hasInterview);

    const handleFiltersChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setFilters((prev) => {
            if (type === 'checkbox') {
                if (name === 'all') {
                    return {
                        ...prev,
                        colorList: checked ? ["RED", "YELLOW", "GREEN", "NOT_FOUND"] : [],
                    };
                }

                if (name === 'allInt') {
                    return {
                        ...prev,
                        hasInterview: checked ? [true, false] : [],
                    };
                }

                if (['GREEN', 'YELLOW', 'RED', 'NOT_FOUND'].includes(name)) {
                    const updatedColors = checked
                        ? [...prev.colorList, name]
                        : prev.colorList.filter((color) => color !== name);

                    return {
                        ...prev,
                        colorList: updatedColors,
                    };
                }

                if (name === 'yes') {
                    const updatedInterviews = checked
                        ? [...prev.hasInterview, true]
                        : prev.hasInterview.filter((interview) => interview !== true);

                    return {
                        ...prev,
                        hasInterview: updatedInterviews,
                    };
                }

                if (name === 'no') {
                    const updatedInterviews = checked
                        ? [...prev.hasInterview, false]
                        : prev.hasInterview.filter((interview) => interview !== false);

                    return {
                        ...prev,
                        hasInterview: updatedInterviews,
                    };
                }

                if (name === 'allHeads') {
                    return {
                        ...prev,
                        headquartersIdList: checked ? headquarters.map(hq => hq.id) : [],
                    };
                }

                if (name.startsWith('head')) {
                    const id = Number(name.replace('head', ''));
                    const updatedHeadquartersIdList = checked
                        ? [...prev.headquartersIdList, id]
                        : prev.headquartersIdList.filter(headId => headId !== id);

                    return {
                        ...prev,
                        headquartersIdList: updatedHeadquartersIdList,
                    };
                }

                if (name === 'allCenters') {
                    return {
                        ...prev,
                        centerIdList: checked ? centers.map(cen => cen.id) : [],
                    };
                }

                if (name.startsWith('center')) {
                    const id = Number(name.replace('center', ''));
                    const updatedCentersIdList = checked
                        ? [...prev.centerIdList, id]
                        : prev.centerIdList.filter(centerId => centerId !== id);

                    return {
                        ...prev,
                        centerIdList: updatedCentersIdList,
                    };
                }

                if (name === 'allSteps') {
                    return {
                        ...prev,
                        levelList: checked ? Object.values(stepMap) : [],
                    };
                }

                if (Object.values(stepMap).includes(name)) {
                    const updatedLevelList = checked
                        ? [...prev.levelList, name]
                        : prev.levelList.filter(level => level !== name);

                    return {
                        ...prev,
                        levelList: updatedLevelList,
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
                }).filter(([, value]) => value !== undefined)
            );
            const result = await fetch(`http://195.133.197.53:8082/${type}_participant/${id}`, {
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
    }, [isOpenNew, isEditorMode, refresh]);


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
                all: newAll, id: newAll, name: newAll, date: newAll, tg: newAll, vk: newAll, color: newAll, comment: newAll, rate: newAll, interview: newAll, step: newAll
            };

            return newColumns;
        });
    };

    const handleInputChange = (id: number, field: string, value: string | number | boolean) => {
        setEditedData((prev: EditedDataType[]) => {
            const existingData = prev.find(person => person.id === id);
            if (existingData) {
                return prev.map(person =>
                    person.id === id
                        ? { ...person, [field]: value }
                        : person
                );
            } else {
                return [...prev, { id, [field]: value } as EditedDataType];
            }
        });
        console.log(editedData);
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

    const toggleStepDropdown = (cellId: number) => {
        setOpenStepCell(openStepCell === cellId ? -1 : cellId);
    };

    // const handleColorSelect = (color: string, cellId: number) => {
    //     console.log(color, cellId)
    //     setOpenCell(-1);
    // };

    const handleColorSelect = (displayColor: DisplayColor, id: number) => {
        const color = colorMap[displayColor];
        handleInputChange(id, "color", color);
        toggleDropdown(id);
    };

    const handleStepSelect = (displayStep: DisplayStep, id: number) => {
        const step = stepMap[displayStep];
        handleInputChange(id, "level", step);
        toggleStepDropdown(id);
    };

    useEffect(() => {
        console.log(filters)
    });

    const getColorClass = (color: string) => {
        return color === "YELLOW" ? "bg-[#FFF4E4] text-[#E99518]"
            : color === "GREEN" ? "bg-[#EBF6EB] text-[#31AA27]"
                : color === "RED" ? "bg-[#FFE3DD] text-[#FF2E00]"
                    : "bg-[#F1F1F1] text-[#777777]";
    };

    useEffect(() => {
        !localStorage.getItem("authToken") && navigate("/")
    })

    const handleSave = async () => {
        const updatedData = editedData.map(person => (person.birthday ? {...person, birthday: convertToISO(`${person.birthday} 00:00`)} : {...person} ))
        try {
            console.log(editedData)
            const response = await fetch('http://195.133.197.53:8082/volunteer', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include"
                },
                body: JSON.stringify(updatedData),
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

    // const handleDeleteButtonClick = async (id: number) => {
    //     try {
    //         const response = await fetch(`http://195.133.197.53:8082/center/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status}`);
    //         }
    //
    //         setIsOpenDelete({open: false, id: -1})
    //
    //         const result = await response.json();
    //         console.log('Success:', result);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }


    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.regionalTeam__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Таблица участников {type === "headquarters" ? <span>штаба</span>: <span>центра</span>}</p>
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
                            <img src={filtersImg} alt="filters" className={" right-2 top-1 flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
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
                            <button onClick={() => {setIsEditorMode(false); setEditedData([])}} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__highlightButton)}>
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
                        {/*<button onClick={() => setIsOpenNew(true)} className={cn(styles.regionalTeam__addButton, "flex text-white text-center bg-[#4A76CB] justify-center gap-2")}><p className={"hidden md:flex"}>Добавить</p><img src={plus} alt=""/></button>*/}
                        <button onClick={() => handleSave()} className={cn("flex md:hidden justify-center gap-3 border-none bg-[#31AA27] text-white", styles.regionalTeam__highlightButton)}>
                            Сохранить
                        </button>
                    </div>
                }
                <div className={`fixed inset-0 bg-black opacity-50 z-40 ${isOpenNew ? '' : 'hidden'}`} onClick={() => setIsOpenNew(false)}></div>
                {/*{isOpenNew &&*/}
                {/*    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[250px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5"}>*/}
                {/*        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>*/}
                {/*        <p className={"text-center text-[20px]"}>Добавить данные</p>*/}
                {/*        <div className={"flex flex-col gap-3"}>*/}
                {/*            <label className={"text-[#5E5E5E]"}>Введите ID нового участника</label>*/}
                {/*            <input placeholder={"ID"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>*/}
                {/*            <button className={"w-2/4 p-2 text-white bg-[#31AA27] rounded-lg self-center mt-5"}>Добавить</button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*}*/}
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
                            {columns.comment && <th className={cn(styles.regionalTeam__tableButton)}>Комментарий по работе</th>}
                            {columns.rate && <th className={cn(styles.regionalTeam__tableButton)}>Рейтинг</th>}
                            {columns.interview && <th className={cn(styles.regionalTeam__tableButton)}>Собеседование для ступени роста</th>}
                            {columns.step && <th className={cn(styles.regionalTeam__tableButton)}>Ступень роста</th>}
                            {!isEditorMode &&
                                <th className={cn("min-w-8")}></th>
                            }
                        </tr>
                        </thead>
                        <tbody className={""}>
                        {tableData && tableData.map(person =>
                            <tr key={person.id} className={cn("h-[50px] border-b-[1px]", styles.regionalTeam__tableBody)}>
                                {columns.id && <th className={cn("sticky left-0 z-10 bg-white border-b-[1px]")}>{person.volunteerId}</th>}
                                {columns.name && <th className={cn("sticky z-10 bg-white border-r-[1px] border-b-[1px]", !columns.id ? "left-0" : "left-[48px]")}>
                                    {isEditorMode ? <input name={"fullName"} value={getEditedValue(person.id, "fullName") ? getEditedValue(person.id, "fullName") : person.fullName} onChange={(e) => handleInputChange(person.id, "fullName", e.target.value)} className={cn("border-0 rounded-none h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/> :
                                    <a href={`/volunteer/${person.id}`}
                                       onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/volunteer/${person.id}`);
                                    }}>{person.fullName}</a>}
                                </th>}
                                {columns.date && <th className={"flex"}>
                                    {/*<input name={"birthday"} value={getEditedValue(person.volunteerId, "birthday") ? getEditedValue(person.volunteerId, "birthday") : formatDateTime(person.birthdayDto.birthday).slice(0, 10)} onChange={(e) => handleInputChange(person.volunteerId, "birthday", e.target.value)} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>*/}
                                    <InputMask
                                        name="birthday"
                                        mask="99.99.9999"
                                        value={getEditedValue(person.id, "birthday") ? getEditedValue(person.id, "birthday") : formatDateTime(person.birthday.birthday).slice(0, 10)}
                                        onChange={(e) => handleInputChange(person.id, "birthday", e.target.value)}
                                        className={cn("border-0 h-14 bg-white px-1 text-center w-full", isEditorMode && "border-[1px]" )}
                                        placeholder={"ДД.ММ.ГГГГ"}
                                    />
                                    {!isEditorMode && <p className={"h-14 flex flex-col justify-center"}>({person.birthday.age})</p>}
                                </th>}
                                {columns.tg && <th>
                                    <input name={"tgLink"} value={getEditedValue(person.id, "tgLink") ? getEditedValue(person.id, "tgLink") : person.tgLink} onChange={(e) => handleInputChange(person.id, "tgLink", e.target.value)} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.vk && <th>
                                    <input name={"vkLink"} value={getEditedValue(person.id, "vkLink") ? getEditedValue(person.id, "vkLink") : person.vkLink} onChange={(e) => handleInputChange(person.id, "vkLink", e.target.value)} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.color && <th className={"flex justify-center items-center h-16"}>
                                    <div className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 relative",
                                        reverseColorMap[getEditedValue(person.id, "color") as keyof typeof reverseColorMap] === "Жёлтый" ? "bg-[#FFF4E4] text-[#E99518]"
                                            : reverseColorMap[getEditedValue(person.id, "color") as keyof typeof reverseColorMap] === "Зелёный" ? "bg-[#EBF6EB] text-[#31AA27]"
                                                : reverseColorMap[getEditedValue(person.id, "color") as keyof typeof reverseColorMap] === "Красный" ? "bg-[#FFE3DD] text-[#FF2E00]"
                                                    : person.color === "Жёлтый" ? "bg-[#FFF4E4] text-[#E99518]"
                                                        : person.color === "Зелёный" ? "bg-[#EBF6EB] text-[#31AA27]"
                                                            : person.color === "Красный" ? "bg-[#FFE3DD] text-[#FF2E00]"
                                                                : "bg-[#F1F1F1] text-[#777777]"
                                    )}>
                                        {(() => {
                                            const colorKey = getEditedValue(person.id, "color");
                                            if (typeof colorKey === "string" && colorKey in reverseColorMap) {
                                                return reverseColorMap[colorKey as keyof typeof reverseColorMap];
                                            }
                                            return person.color;
                                        })()}

                                        {isEditorMode &&
                                            <img src={arrowSmall} alt={"arrow"} onClick={() => toggleDropdown(person.id)} />
                                        }
                                        {openCell === person.id && (
                                            <div className="absolute z-50 w-32 mt-7 pb-2 flex flex-col items-center gap-2 bg-white">
                                                {(["Жёлтый", "Зелёный", "Красный", "Not found"] as DisplayColor[]).map(displayColor => (
                                                    <div
                                                        key={displayColor}
                                                        className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 cursor-pointer", getColorClass(colorMap[displayColor]))}
                                                        onClick={() => handleColorSelect(displayColor, person.id)}
                                                    >
                                                        {displayColor}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </th>}
                                {columns.comment && <th>
                                    <input name={"comment"} value={getEditedValue(person.id, "comment") ?? person.comment ?? ""} onChange={(e) => handleInputChange(person.id, "comment", e.target.value)} className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]" )} disabled={!isEditorMode}/>
                                </th>}
                                {columns.rate && <th>
                                    <p className={cn("border-0 bg-white w-full px-1 text-center", isEditorMode && "" )}>{person.rank}</p>
                                </th>}
                                {columns.interview && <th>
                                    <input
                                        type={"checkbox"}
                                        name={"hasInterview"}
                                        checked={getEditedValue(person.id, "hasInterview") ?? person.hasInterview }
                                        onChange={(e) => handleInputChange(person.id, "hasInterview", e.target.checked)}
                                        className={cn("border-0 bg-white px-1 text-center h-7 w-7", styles.custom_checkbox)}
                                        disabled={!isEditorMode}
                                    />
                                </th>}
                                {columns.step && <th className={""}>
                                    <div className={cn("w-3/4 mx-auto my-0 rounded-2xl text-[12px] flex justify-center gap-2 relative bg-[#F1F1F1] text-[#141414]")}>
                                        {(() => {
                                            const levelKey = getEditedValue(person.id, "level") || person.level;

                                            if (typeof levelKey === "string" && levelKey in reverseStepMap) {
                                                return reverseStepMap[levelKey as keyof typeof reverseStepMap];
                                            }
                                            return "Не выбрано";
                                        })()}
                                        {isEditorMode &&
                                            <img src={arrowSmall} alt={"arrow"} onClick={() => toggleStepDropdown(person.id)} />
                                        }
                                        {openStepCell === person.id && (
                                            <div className="absolute z-50 w-32 mt-7 pb-2 flex flex-col items-center gap-2 bg-white">
                                                {(["Ступень 1", "Ступень 2", "Ступень 3", "Ступень 4"] as DisplayStep[]).map(displayStep => (
                                                    <div
                                                        key={displayStep}
                                                        className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 cursor-pointer")}
                                                        onClick={() => handleStepSelect(displayStep, person.id)}
                                                    >
                                                        {displayStep}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
                                <input checked={columns.vk} onClick={() => setColumns({...columns, vk: !columns.vk})} type="checkbox" name={"vk"} className={styles.regionalTeam__checkbox}/>
                                <p>Ссылка ВКонтакте</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.color} onClick={() => setColumns({...columns, color: !columns.color})} type="checkbox" name={"color"} className={styles.regionalTeam__checkbox}/>
                                <p>Светофор</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.comment} onClick={() => setColumns({...columns, comment: !columns.comment})} type="checkbox" name={"comment"} className={styles.regionalTeam__checkbox}/>
                                <p>Комментарий по работе</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.rate} onClick={() => setColumns({...columns, rate: !columns.rate})} type="checkbox" name={"rate"} className={styles.regionalTeam__checkbox}/>
                                <p>Рейтинг</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.interview} onClick={() => setColumns({...columns, interview: !columns.interview})} type="checkbox" name={"interview"} className={styles.regionalTeam__checkbox}/>
                                <p>Собеседование для ступени роста</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.step} onClick={() => setColumns({...columns, step: !columns.step})} type="checkbox" name={"step"} className={styles.regionalTeam__checkbox}/>
                                <p>Ступень роста</p>
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
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Светофор</p>
                            <div className={"flex gap-2 items-center"}>
                                <input
                                    type="checkbox"
                                    name="all"
                                    className={styles.regionalTeam__checkbox}
                                    checked={isAllColorsChecked}
                                    onChange={handleFiltersChange}
                                />
                                <p>Все</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="GREEN"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.colorList.includes('GREEN')}
                                    onChange={handleFiltersChange}
                                />
                                <p>Зелёный</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="YELLOW"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.colorList.includes('YELLOW')}
                                    onChange={handleFiltersChange}
                                />
                                <p>Жёлтый</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="RED"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.colorList.includes('RED')}
                                    onChange={handleFiltersChange}
                                />
                                <p>Красный</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="NOT_FOUND"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.colorList.includes('NOT_FOUND')}
                                    onChange={handleFiltersChange}
                                />
                                <p>Not found</p>
                            </div>
                        </div>
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
                            <p className={styles.regionalTeam__miniTitle}>Собеседование для ступени роста</p>
                            <div className={"flex gap-2 items-center"}>
                                <input
                                    type="checkbox"
                                    name="allInt"
                                    className={styles.regionalTeam__checkbox}
                                    checked={isAllInterviewsChecked}
                                    onChange={handleFiltersChange}
                                />
                                <p>Все</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="yes"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.hasInterview.includes(true)}
                                    onChange={handleFiltersChange}
                                />
                                <p>Пройдено</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name="no"
                                    className={styles.regionalTeam__checkbox}
                                    checked={filters.hasInterview.includes(false)}
                                    onChange={handleFiltersChange}
                                />
                                <p>Не пройдено</p>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Районный штаб</p>
                            <div className={"flex gap-2 items-center"}>
                                <input
                                    type="checkbox"
                                    name="allHeads"
                                    className={styles.regionalTeam__checkbox}
                                    checked={isAllHeadsChecked}
                                    onChange={handleFiltersChange}
                                />
                                <p>Все</p>
                            </div>
                            {headquarters.map((hq) => (
                                <div key={hq.id} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name={`head${hq.id}`}
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.headquartersIdList.includes(hq.id)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>{hq.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Общественный цвентр</p>
                            <div className={"flex gap-2 items-center"}>
                                <input
                                    type="checkbox"
                                    name="allCenters"
                                    className={styles.regionalTeam__checkbox}
                                    checked={isAllCentersChecked}
                                    onChange={handleFiltersChange}
                                />
                                <p>Все</p>
                            </div>
                            {centers.map((cen) => (
                                <div key={cen.id} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name={`center${cen.id}`}
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.centerIdList.includes(cen.id)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>{cen.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <p className={styles.regionalTeam__miniTitle}>Ступени роста</p>
                            <div className={"flex gap-2 items-center"}>
                                <input
                                    type="checkbox"
                                    name="allSteps"
                                    className={styles.regionalTeam__checkbox}
                                    checked={isAllStepsChecked}
                                    onChange={handleFiltersChange}
                                />
                                <p>Все</p>
                            </div>
                            {Object.entries(stepMap).map(([label, step]) => (
                                <div key={step} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name={step}
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.levelList.includes(step)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={"flex justify-center my-4 items-center sticky z-55 bottom-0 bg-white h-24 p-4 gap-5"}>
                        <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#F1F1F5] text-[#5E5E5E]")} onClick={() => {
                            setFilters(initialFilters); setRefresh(prevState => !prevState)}}>Сбросить все</button>
                        <button className={cn(styles.regionalTeam__filterBottomButton, "bg-[#3B64B3] text-white")} onClick={() => setRefresh(prevState => !prevState)}>Применить</button>
                    </div>
                </div>
            }
        </div>
    )
}
