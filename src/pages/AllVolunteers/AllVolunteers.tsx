import styles from './AllVolunteers.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
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
import {FiltersType} from "../../utils/type.ts";
import InputMask from "react-input-mask";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {getColumnWidth} from "../../utils/widths.ts";

const cn = classNames;

interface TableDataType {
    id: number,
    volunteerId: number,
    fullName: string,
    birthdayDto: { birthday: string, age: number } | null,
    tgLink: string,
    vk: string,
    color: string,
    eventLinkList: [{ id: number, name: string }],
    comment: string,
    rank: number,
    hasInterview: boolean,
    level: string,
    centerLink: { id: number, name: string },
    headquartersLink: { id: number, name: string }
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
    centerId?: number,
    headquartersId?: number
}

interface ColumnsType {
    all: boolean, id: boolean, name: boolean, date: boolean, tg: boolean, vk: boolean, color: boolean, events: boolean, comment: boolean, rate: boolean, interview: boolean, step: boolean, headquarters: boolean, center: boolean, delete: boolean, [key: string]: boolean;
}

export function AllVolunteers(): React.JSX.Element {
    const navigate = useNavigate()
    const [tableData, setTableData] = useState<TableDataType[]>([])
    const [tableDataLength, setTableDataLength] = useState<number>(0)
    const [editedData, setEditedData] = useState<EditedDataType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [isEditorMode, setIsEditorMode] = useState<boolean>(false)
    const [isOpenNew, setIsOpenNew] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnsType>({all: true, id: true, name: true, date: true, tg: true, vk: true, color: true, events: true, comment: true, rate: true, interview: true, step: true, headquarters: true, center: true, delete: true})
    const [refresh, setRefresh] = useState(false)

    const [centers, setCenters] = useState<{id: number, name: string}[]>([])
    const [headquarters, setHeadquarters] = useState<{id: number, name: string}[]>([])
    const [events, setEvents] = useState<{id: number, name: string}[]>([])
    const [openCell, setOpenCell] = useState<number>(-1);
    const [openStepCell, setOpenStepCell] = useState<number>(-1);
    const [openHeadquartersCell, setOpenHeadquartersCell] = useState<number>(-1);
    const [openCenterCell, setOpenCenterCell] = useState<number>(-1);

    const [isOpenDelete, setIsOpenDelete] = useState<{ id: number, open: boolean }>({id: -1, open: false})

    const initialFilters = {minAge: "", maxAge: "", minRank: "", eventIdList: [],
        colorList: [], hasInterview: [], levelList: [], functionalList: [],
        testing: [], hasClothes: [], centerIdList: [], headquartersIdList: [], orderByDateAsc: true, orderByDateDesc: false,
        orderByRankAsc: true, orderByRankDesc: false
    }

    useEffect(() => {
        console.log(tableData)
    })

    const [filters, setFilters] = useState<FiltersType>(initialFilters)

    const areAllInterviewsSelected = (interviews: boolean[]) => {
        return interviews.includes(true) && interviews.includes(false);
    };

    const areAllColorsSelected = (colors: string[]) => {
        const allColors = ["RED", "YELLOW", "GREEN", "NOT_FOUND"];
        return allColors.every(color => colors.includes(color));
    };

    const areAllHeadsSelected = (headquartersIdList: number[], headquarters: {id: number, name: string}[]) => {
        return headquarters[0] && headquarters.every((hq) => headquartersIdList.includes(hq.id));
    };

    const areAllCentersSelected = (centerIdList: number[], centers: {id: number, name: string}[]) => {
        return centers[0] && centers.every((cen) => centerIdList.includes(cen.id));
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

                if (name.startsWith('event')) {
                    const id = Number(name.replace('event', ''));
                    const updatedEventsIdList = checked
                        ? [...prev.eventIdList, id]
                        : prev.eventIdList.filter(eventId => eventId !== id);

                    return {
                        ...prev,
                        eventIdList: updatedEventsIdList,
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
                }).filter(([, value]) => value !== undefined && value !== '')
            );
            const result = await fetch("https://rit-test.ru/api/v1/volunteer", {
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
            } else {
                throw Error
            }
        })()
    }, [isOpenNew, isEditorMode, refresh]);

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("https://rit-test.ru/api/v1/center", {
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
                const response = await fetch("https://rit-test.ru/api/v1/event", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setEvents(result)
                console.log(result)
            } catch (e) {
                console.log(e)
            }
        })()
    }, []);

    useEffect(() => {
        (async function() {
            try {
                const response = await fetch("https://rit-test.ru/api/v1/headquarters", {
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
                all: newAll, id: newAll, name: newAll, date: newAll, tg: newAll, vk: newAll, color: newAll, events: newAll, comment: newAll, rate: newAll, interview: newAll, step: newAll, headquarters: newAll, center: newAll, delete: newAll
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

    const toggleHeadquartersDropdown = (cellId: number) => {
        setOpenHeadquartersCell(openHeadquartersCell === cellId ? -1 : cellId);
    };

    const toggleCenterDropdown = (cellId: number) => {
        setOpenCenterCell(openCenterCell === cellId ? -1 : cellId);
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

    const handleHeadquartersSelect = (headquarterId: number, personId: number) => {
        handleInputChange(personId, 'headquartersId', headquarterId);
        toggleHeadquartersDropdown(personId);
    };

    const handleCenterSelect = (headquarterId: number, personId: number) => {
        handleInputChange(personId, 'centerId', headquarterId);
        toggleCenterDropdown(personId);
    };

    const getHeadquartersNameById = (headquartersId: number | undefined) => {
        const headquarter = headquarters.find(h => h.id === headquartersId);
        return headquarter ? headquarter.name : 'Не выбрано';
    };

    const getCenterNameById = (centerId: number | undefined) => {
        const center = centers.find(c => c.id === centerId);
        return center ? center.name : 'Не выбрано';
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
            const response = await fetch('https://rit-test.ru/api/v1/volunteer', {
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
            setOpenCell(-1)
            setOpenStepCell(-1)
            setOpenHeadquartersCell(-1)
            setOpenCenterCell(-1)
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const handleDeleteButtonClick = async (id: number) => {
        try {
            const response = await fetch(`https://rit-test.ru/api/v1/volunteer/${id}`, {
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

    const [columnOrder, setColumnOrder] = useState([
        'id', 'name', 'date', 'tg', 'vk', 'color', 'events', 'comment', 'rate', 'interview', 'step', 'headquarters', 'center',
    ]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedColumns = Array.from(columnOrder);
        const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
        reorderedColumns.splice(result.destination.index, 0, movedColumn);
        setColumnOrder(reorderedColumns);
    };


    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.regionalTeam__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Таблица всех волонтеров</p>
                    </div>
                    <button className={"flex md:hidden"}>
                        {isEditorMode ?
                            <img src={cancel} alt={"cancel"} onClick={() => {
                                setIsEditorMode(false);
                                setOpenCell(-1)
                                setOpenStepCell(-1)
                                setOpenHeadquartersCell(-1)
                                setOpenCenterCell(-1)
                            }}/>
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
                            <button onClick={() => {setIsEditorMode(false); setEditedData([]);
                                setOpenCell(-1); setOpenStepCell(-1); setOpenHeadquartersCell(-1);
                                setOpenCenterCell(-1)}} className={cn("hidden md:flex justify-center gap-3 border-none bg-[#E8E8F0]", styles.regionalTeam__highlightButton)}>
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
                <p className={"text-gray-500"}>Всего результатов: {tableDataLength}</p>
                <div className="overflow-y-auto max-h-full">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided) => (
                                <table
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={"w-full overflow-y-auto min-w-[900px]"}
                                >
                                    <thead>
                                    <tr className={cn("sticky top-0 z-30 h-[60px] bg-[#F7F7FD] border-b-[1px]", styles.regionalTeam__tableHead)}>
                                        {columnOrder.map((columnKey, index) =>
                                            columns[columnKey] ? (
                                                <Draggable key={columnKey} draggableId={columnKey} index={index}>
                                                    {(provided) => (
                                                        <th
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(`cursor-move`, `min-w-[${getColumnWidth(columnKey)}]`)}
                                                        >
                                                            {columnKey === 'id' && "ID"}
                                                            {columnKey === 'name' && "ФИО"}
                                                            {columnKey === 'date' && "Дата рождения"}
                                                            {columnKey === 'tg' && "Ссылка Telegram"}
                                                            {columnKey === 'vk' && "Ссылка ВКонтакте"}
                                                            {columnKey === 'color' && "Светофор"}
                                                            {columnKey === 'events' && "Мероприятия"}
                                                            {columnKey === 'comment' && "Комментарий по работе"}
                                                            {columnKey === 'rate' && "Рейтинг"}
                                                            {columnKey === 'interview' && "Собеседование для ступени роста"}
                                                            {columnKey === 'step' && "Ступень роста"}
                                                            {columnKey === 'headquarters' && "Районный штаб"}
                                                            {columnKey === 'center' && "Общественный центр"}
                                                        </th>
                                                    )}
                                                </Draggable>
                                            ) : null
                                        )}
                                        {!isEditorMode && columns.delete && <th className={cn("min-w-10")}></th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tableData && tableData.map(person => (
                                        <tr key={person.id} className={cn("h-[50px] border-b-[1px]", styles.regionalTeam__tableBody)}>
                                            {columnOrder.map((columnKey) => (
                                                columns[columnKey] ? (
                                                    <td key={columnKey}>
                                                        {columnKey === 'id' &&
                                                            <p className={"text-center"}>
                                                                {person.volunteerId}
                                                            </p>}
                                                        {columnKey === 'name' && (
                                                            isEditorMode ? (
                                                                <input
                                                                    name={"fullName"}
                                                                    value={getEditedValue(person.id, "fullName") || person.fullName}
                                                                    onChange={(e) => handleInputChange(person.id, "fullName", e.target.value)}
                                                                    className={cn("border-0 rounded-none h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]")}
                                                                    disabled={!isEditorMode}
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={`/volunteer/${person.id}`}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        navigate(`/volunteer/${person.id}`);
                                                                    }}
                                                                    className={"text-center flex justify-center text-blue-400"}
                                                                >
                                                                    {person.fullName}
                                                                </a>
                                                            )
                                                        )}
                                                        {columnKey === 'date' && (
                                                            <div className={"flex gap-0"}>
                                                                <InputMask
                                                                    name="birthday"
                                                                    mask="99.99.9999"
                                                                    //@ts-ignore
                                                                    value={getEditedValue(person.id, "birthday") ? getEditedValue(person.id, "birthday") : (person.birthdayDto ? formatDateTime(person.birthdayDto.birthday)?.slice(0, 10) : "")}
                                                                    onChange={(e) => handleInputChange(person.id, "birthday", e.target.value)}
                                                                    className={cn("border-0 h-14 bg-white px-1 text-center w-full", isEditorMode && "border-[1px]")}
                                                                    placeholder={"ДД.ММ.ГГГГ"}
                                                                /> {!isEditorMode && <p className={"h-14 flex flex-col justify-center mr-3"}>({person.birthdayDto?.age})</p>}
                                                            </div>
                                                        )}
                                                        {columnKey === 'tg' && (
                                                            <input
                                                                name={"tgLink"}
                                                                value={getEditedValue(person.id, "tgLink") ? getEditedValue(person.id, "tgLink") : person.tgLink}
                                                                onChange={(e) => handleInputChange(person.id, "tgLink", e.target.value)}
                                                                className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]")}
                                                                disabled={!isEditorMode}
                                                            />
                                                        )}
                                                        {columnKey === 'vk' && (
                                                            <input
                                                                name={"vkLink"}
                                                                value={getEditedValue(person.id, "vkLink") ? getEditedValue(person.id, "vkLink") : person.vk}
                                                                onChange={(e) => handleInputChange(person.id, "vkLink", e.target.value)}
                                                                className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]")}
                                                                disabled={!isEditorMode}
                                                            />
                                                        )}
                                                        {columnKey === 'color' && (
                                                            <div className={cn("flex justify-center items-center h-16")}>
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
                                                            </div>
                                                        )}
                                                        {columnKey === 'events' && (
                                                            <div className={"text-center"} title={person.eventLinkList.map(event => event.name).join(", ")}>
                                                                {person.eventLinkList.map(event => event.name).join(", ")}
                                                            </div>
                                                        )}
                                                        {columnKey === 'comment' && (
                                                            <input
                                                                name={"comment"}
                                                                value={getEditedValue(person.id, "comment") ?? person.comment ?? ""}
                                                                onChange={(e) => handleInputChange(person.id, "comment", e.target.value)}
                                                                className={cn("border-0 h-14 bg-white w-full px-1 text-center", isEditorMode && "border-[1px]")}
                                                                disabled={!isEditorMode}
                                                            />
                                                        )}
                                                        {columnKey === 'rate' && (
                                                            <p className={cn("border-0 bg-white w-full px-1 text-center", isEditorMode && "")}>
                                                                {person.rank}
                                                            </p>
                                                        )}
                                                        {columnKey === 'interview' && (
                                                            <div className={"flex w-full justify-center"}>
                                                                <input
                                                                    type={"checkbox"}
                                                                    name={"hasInterview"}
                                                                    checked={getEditedValue(person.id, "hasInterview") ?? person.hasInterview}
                                                                    onChange={(e) => handleInputChange(person.id, "hasInterview", e.target.checked)}
                                                                    className={cn("border-0 bg-white px-1 text-center h-7 w-7", styles.custom_checkbox)}
                                                                    disabled={!isEditorMode}
                                                                />
                                                            </div>
                                                        )}
                                                        {columnKey === 'step' && (
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
                                                        )}
                                                        {columnKey === 'headquarters' && (
                                                            <div className={cn("w-3/4 mx-auto my-0 rounded-2xl text-[12px] flex justify-center gap-2 relative bg-[#FFFFFF] text-[#141414]")}>
                                                                    {
                                                                        (() => {
                                                                            const editedHeadquartersId = getEditedValue(person.id, 'headquartersId');
                                                                            const headquartersName = editedHeadquartersId
                                                                                ? getHeadquartersNameById(editedHeadquartersId)
                                                                                : person.headquartersLink?.name;

                                                                            return <p>{headquartersName ? headquartersName : 'Не выбрано'}</p>;
                                                                        })()
                                                                    }
                                                                    {isEditorMode &&
                                                                        <img src={arrowSmall} alt={"arrow"} onClick={() => toggleHeadquartersDropdown(person.id)} />
                                                                    }
                                                                    {openHeadquartersCell === person.id && (
                                                                        <div className="absolute z-50 w-32 mt-7 pb-2 flex flex-col items-center gap-2 bg-white">
                                                                            {headquarters[0] && headquarters?.map(headquarter => (
                                                                                <div
                                                                                    key={headquarter.id}
                                                                                    className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 cursor-pointer")}
                                                                                    onClick={() => handleHeadquartersSelect(headquarter.id, person.id)}
                                                                                >
                                                                                    {headquarter.name}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}
                                                        {columnKey === 'center' && (
                                                            <div className={cn("w-3/4 mx-auto my-0 rounded-2xl text-[12px] flex justify-center gap-2 relative bg-[#FFFFFF] text-[#141414]")}>
                                                                    {
                                                                        (() => {
                                                                            const editedCenterId = getEditedValue(person.id, 'centerId');
                                                                            const centerName = editedCenterId
                                                                                ? getCenterNameById(editedCenterId)
                                                                                : person.centerLink?.name;

                                                                            return <p>{centerName ? centerName : 'Не выбрано'}</p>;
                                                                        })()
                                                                    }
                                                                    {isEditorMode &&
                                                                        <img src={arrowSmall} alt={"arrow"} onClick={() => toggleCenterDropdown(person.id)} />
                                                                    }
                                                                    {openCenterCell === person.id && (
                                                                        <div className="absolute z-50 w-32 mt-7 pb-2 flex flex-col items-center gap-2 bg-white">
                                                                            {centers[0] && centers?.map(center => (
                                                                                <div
                                                                                    key={center.id}
                                                                                    className={cn("w-3/4 rounded-2xl text-[12px] flex justify-center gap-2 cursor-pointer")}
                                                                                    onClick={() => handleCenterSelect(center.id, person.id)}
                                                                                >
                                                                                    {center.name}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}
                                                    </td>
                                                ) : null
                                            ))}
                                            {columns.delete && !isEditorMode && person.id && (
                                                <td className={"flex justify-center items-center h-14"}>
                                                    <button onClick={() => person.id && setIsOpenDelete({ id: person.id, open: true })}>
                                                        <img src={bin} alt="delete" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
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
                                <input checked={columns.events} onClick={() => setColumns({...columns, events: !columns.events})} type="checkbox" name={"events"} className={styles.regionalTeam__checkbox}/>
                                <p>Мероприятия</p>
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
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.headquarters} onClick={() => setColumns({...columns, headquarters: !columns.headquarters})} type="checkbox" name={"headquarters"} className={styles.regionalTeam__checkbox}/>
                                <p>Районный штаб</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.center} onClick={() => setColumns({...columns, center: !columns.center})} type="checkbox" name={"center"} className={styles.regionalTeam__checkbox}/>
                                <p>Общественный центр</p>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <input checked={columns.delete} onClick={() => setColumns({...columns, delete: !columns.delete})} type="checkbox" name={"delete"} className={styles.regionalTeam__checkbox}/>
                                <p>Удаление</p>
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
                            <p className={styles.regionalTeam__miniTitle}>Мероприятия</p>
                            {/*<div className={"relative w-full"}>*/}
                            {/*    <img src={search} alt="search" className={"absolute left-2 top-1"}/>*/}
                            {/*    <input placeholder="Поиск по ключевым словам" className={cn("px-10", styles.regionalTeam__input)} />*/}
                            {/*</div>*/}
                            {events.map((ev) => (
                                <div key={ev.id} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name={`event${ev.id}`}
                                        className={styles.regionalTeam__checkbox}
                                        checked={filters.eventIdList.includes(ev.id)}
                                        onChange={handleFiltersChange}
                                    />
                                    <p>{ev.name}</p>
                                </div>
                            ))}
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
                            {headquarters[0] && headquarters.map((hq) => (
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
                            {centers[0] && centers.map((cen) => (
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
