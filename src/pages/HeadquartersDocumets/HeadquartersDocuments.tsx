import styles from './HeadquartersDocuments.module.css'
import classNames from 'classnames'
import React, { useEffect, useRef, useState} from "react";
import { useNavigate, useParams} from "react-router-dom";
import document from "../../assets/document.svg"
// import search from "../../assets/search.svg"
import { saveAs } from 'file-saver';
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
import InputMask from "react-input-mask";
import {convertToISO, formatDateTime} from "../../utils/formatDate.ts";

const initialColumns = [
    // { id: 'federalId', title: 'ID', change: false  },
    { id: 'name', title: 'Документ', change: false  },
    { id: 'sender', title: 'Отправитель', change: false  },
    { id: 'recipient', title: 'Получатель', change: false  },
    { id: 'createDate', title: 'Дата создания', change: false  },
    { id: 'approvalControl', title: 'Контроль согласования', change: false  },
    // { id: 'delete', title: '', change: false }
];

const columnsListFilter = [
    // { key: 'federalId', label: 'ID'},
    { key: 'name', label: 'Документ'},
    { key: 'sender', label: 'Отправитель'},
    { key: 'recipient', label: 'Получатель'},
    { key: 'createDate', label: 'Дата создания'},
    { key: 'approvalControl', label: 'Контроль согласования' },
    { key: 'delete', label: 'Удаление'}
];

interface FilterColumnsType {
    all: boolean, name: boolean, sender: boolean, recipient: boolean, createDate: boolean, approvalControl: boolean,
    delete: boolean,
    [key: string]: boolean;
}

interface TableDataType {
    id?: 1,
    name: string,
    sender: string,
    recipient: string,
    createDate: string,
    approvalControl: boolean
    [key: string]: any;
}

export function HeadquartersDocuments(): React.JSX.Element {
    const {type, id} = useParams()

    const [tableData, setTableData] = useState<TableDataType[]>([])

    const [editedCenters, setEditedCenters] = useState<TableDataType[]>([]);

    const [newDoc, setNewDoc] = useState<TableDataType>({
        name: "",
        sender: "",
        recipient: "",
        createDate: "",
        approvalControl: false
    })

    const [dataFilters, setDataFilters] = useState({
        startDate: "",
        endDate: "",
        approvalControl: [true, false],
        orderByDateAsc: true,
        orderByDateDesc: false
    })

    const [refresh, setRefresh] = useState(true)

    const [columns, setColumns] = useState(initialColumns);
    const [filterColumns, setFilterColumns] = useState<FilterColumnsType>({
        all: true, name: true, approvalControl: true, createDate: true, recipient: true, sender: true, delete: true});
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
                all: newAll, name: newAll, approvalControl: newAll, createDate: newAll, recipient: newAll, sender: newAll,
                delete: newAll
            };

            return newColumns;
        });
    };

    const handleChangeFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataFilters(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleChangeFiltersCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataFilters((prev) => ({
            ...prev,
            orderByDateAsc: e.target.name === "orderByDateAsc" ? !prev.orderByDateAsc : false,
            orderByDateDesc: e.target.name === "orderByDateDesc" ? !prev.orderByDateDesc : false
        }))
    };

    const handleChangeFiltersCheckCont = (event: React.ChangeEvent<HTMLInputElement>, filterType: any) => {
        if (filterType === 'all') {
            const isChecked = event.target.checked;
            setDataFilters({
                ...dataFilters,
                approvalControl: isChecked ? [true, false] : []
            });
        } else {
            let updatedApprovalControl;
            if (dataFilters.approvalControl.includes(filterType)) {
                updatedApprovalControl = dataFilters.approvalControl.filter(item => item !== filterType);
            } else {
                updatedApprovalControl = [...dataFilters.approvalControl, filterType];
            }
            setDataFilters({
                ...dataFilters,
                approvalControl: updatedApprovalControl
            });
        }
    };

    const handleChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setNewDoc(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const formData = new FormData()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFileName(e.target?.files[0].name);
            setSelectedFile(e.target?.files[0]);
        }
    };

    const handleAddButtonClick = async () => {
        const request = `add_${type}_document/${id}`
        const [day, month, year] = newDoc.createDate.split('.');
        const formattedDate = convertToISO(`${+day}.${month}.${year} 00:00`);
        const updatedDoc = {
            ...newDoc,
            createDate: formattedDate
        };
        try {
            const response = await fetch(`http://195.133.197.53:8082/${request}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedDoc)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();

            console.log(formData)

            formData.forEach((value, key) => {
                console.log(key, value);
            });

            if (selectedFile && response.ok && result) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                formData.forEach((value, key) => {
                    console.log(key, value);
                });

                const fileResponse = await fetch(`http://195.133.197.53:8082/save_document/${result}`, {
                    method: 'POST',
                    credentials: "include",
                    body: formData
                });

                if (!fileResponse.ok) {
                    console.log(await fileResponse.json());
                    throw new Error(`File upload error: ${fileResponse.status}`);
                }

                const fileResult = await fileResponse.json();
                console.log('File upload success:', fileResult);
            }

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

    // const handleSave = async () => {
    //     try {
    //         console.log(editedCenters)
    //         const response = await fetch('http://195.133.197.53:8082/headquarters', {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 credentials: "include"
    //             },
    //             body: JSON.stringify(editedCenters),
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error(`Ошибка: ${response.status}`);
    //         }
    //
    //         const result = await response.json();
    //         console.log('Изменения сохранены:', result);
    //         setEditedCenters([]);
    //         setIsEditorMode(false);
    //     } catch (error) {
    //         console.error('Ошибка при сохранении изменений:', error);
    //     }
    // };

    const handleDeleteButtonClick = async (id: number) => {
        try {
            const response = await fetch(`http://195.133.197.53:8082/document/${id}`, {
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

    const handleShowDocument = async (docId: 1 | undefined) => {
        try {
            const response = await fetch(`http://195.133.197.53:8082/document/${docId}/file`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);

                const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;

                const blob = new Blob([arrayBuffer], {type: isPdf ? 'application/pdf' : 'application/octet-stream'});

                if (isPdf) {
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                } else {
                    saveAs(blob, 'document');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

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
            const request = `${type}_document/${id}`
            const newFilters = Object.fromEntries(
                Object.entries(dataFilters).map(([key, value]) => {
                    if (Array.isArray(value) && value.length === 0) {return [key, undefined];}
                    if (Array.isArray(value) && value.includes(true) && value.includes(false)) {return [key, undefined];}
                    if (Array.isArray(value) && value.length === 1 && typeof value[0] === "boolean") {return [key, value[0]];}
                    if (typeof value === "string" && value.trim() === "") {return [key, undefined];}
                    if ((key === 'startDate' || key === 'endDate') && typeof value === "string" && value.trim() !== "") {
                        const [day, month, year] = value.split('.');
                        const updatedDay = key === 'startDate' ? day : (+day + 1)
                        const formattedDate = convertToISO(`${updatedDay}.${month}.${year} 00:00`);
                        return [key, formattedDate];
                    }

                    return [key, value];
                }).filter(([, value]) => value !== undefined)
            );

            try {
                const response = await fetch(`http://195.133.197.53:8082/${request}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newFilters)
                })
                let result = await response.json()
                setTableData(result)

            } catch (e) {
                console.log(e)
            }
        })()
    }, [isOpenNew, isOpenDelete, isEditorMode, refresh, type, id]);
    useEffect(() => {
        console.log(tableData)
    }, tableData)

    return (
        <div className={cn("h-full md:pr-4 mx-auto my-0 flex w-full overflow-hidden", styles.allHeadquarters__container)}>
            <div className={"h-11/12 w-full md:my-5 md:mx-2 bg-white rounded-3xl flex flex-col p-2 md:p-8 gap-5"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-2"}>
                        <img src={document} alt="document"/>
                        <p className={"text-[18px] md:text-[20px] font-bold"}>Документы {type === "center" ? <span>центра</span> : <span>штаба</span>}</p>
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
                            <img src={filters} alt="filters" className={"right-2 top-1 flex md:hidden"} onClick={() => setIsFilterOpen(true)}/>
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
                            <button onClick={() => setIsEditorMode(false)} className={cn("hidden md:flex justify-center gap-3 " +
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
                    <div className={"absolute rounded-lg flex flex-col md:justify-center gap-5 z-50 w-full h-4/5 left-0 bottom-0 md:top-1/2 md:left-1/2 bg-white md:w-[500px] md:h-[650px] md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-5 overflow-y-auto"}>
                        <img src={cross} alt={"close"} className={"absolute top-2 right-2 w-7"} onClick={() => setIsOpenNew(false)}/>
                        <p className={"text-center text-[20px]"}>Добавить данные</p>
                        <div className={"flex flex-col gap-3"}>
                            <div>
                                <input type="file" id="fileInput" onChange={handleFileChange} className={"hidden"}/>
                                <label htmlFor="fileInput" className={"w-full text-center flex justify-center items-center h-10 bg-[#4a76cb] text-white rounded-lg cursor-pointer hover:bg-[#2a76ff]"}>
                                    Выбрать файл
                                </label>
                                {selectedFileName && (
                                    <div >
                                        Выбран файл: {selectedFileName}
                                    </div>
                                )}
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Название документа</label>
                                <input name={"name"} onChange={handleChangeNew} placeholder={"Название"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Отправитель</label>
                                <input name={"sender"} onChange={handleChangeNew} placeholder={"Отправитель"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Получатель</label>
                                <input name={"recipient"} onChange={handleChangeNew} placeholder={"Получатель"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>
                            </div>
                            {/*<div className={"flex flex-col gap-3"}>*/}
                            {/*    <label className={"text-[#5E5E5E]"}>Введите количество участников</label>*/}
                            {/*    <input name={"participantCount"} onChange={handleChangeNewCenter} placeholder={"Количество учатников"} className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px]"}/>*/}
                            {/*</div>*/}
                            <div className={"flex flex-col gap-3"}>
                                <label className={"text-[#5E5E5E]"}>Дата создания документа</label>
                                <InputMask
                                    name="createDate"
                                    mask="99.99.9999"
                                    value={newDoc.createDate}
                                    onChange={handleChangeNew}
                                    className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px] text-black"}
                                    placeholder={"ДД.ММ.ГГГГ"}
                                />
                            </div>
                            <div className={"flex gap-3 items-center"}>
                                <input type={"checkbox"} checked={newDoc.approvalControl} name={"approvalControl"} onChange={handleChangeNew} placeholder={"Контакты"} className={cn("h-7 w-7", styles.custom_checkbox)}/>
                                <label className={"text-[#5E5E5E]"}>Контроль согласования</label>
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
                                            <tr key={hq.id} className={cn("h-[50px] border-b-[1px] ")}>
                                                {columns.filter(column => filterColumns[column.id]).filter(column => column.id !== 'delete').map((column) => (
                                                    <td key={column.id}>
                                                        {column.id === 'createDate' ? (
                                                            <p className={cn("border-0 h-full bg-white w-full px-1 text-center text-black", isEditorMode && "text-gray-300" )}>
                                                                {formatDateTime(hq[column.id]).slice(0, 10)}
                                                            </p>
                                                        ) : column.id === 'name' ? (
                                                            <button onClick={() => handleShowDocument(hq.id)} className={cn("border-0 h-full bg-white w-full px-1 flex justify-center text-center text-blue-400 cursor-pointer", isEditorMode && "text-gray-300" )}>
                                                                {hq[column.id]}
                                                            </button>
                                                        ) : column.id === 'approvalControl' ? (
                                                            <div className={"w-full flex justify-center"}>
                                                                <input type={"checkbox"} checked={hq.approvalControl} className={cn("border-0 bg-white px-1 text-center h-7 w-7 mx-auto", styles.custom_checkbox)} disabled/>
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
                                                        )
                                                            : null
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
                    <div className={"flex flex-col gap-5 mx-4 mt-5"}>
                        <p className={styles.regionalTeam__miniTitle}>Дата создания</p>
                            <div className={"flex gap-2"}>
                                <div className={"w-2/4"}>
                                    <p className={"ml-1"}>От</p>
                                    <InputMask
                                        name="startDate"
                                        mask="99.99.9999"
                                        value={dataFilters.startDate}
                                        onChange={handleChangeFilters}
                                        className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px] text-black w-full"}
                                        placeholder={"ДД.ММ.ГГГГ"}
                                    />
                                </div>
                                <div className={"w-2/4"}>
                                    <p className={"ml-1"}>До</p>
                                    <InputMask
                                        name="endDate"
                                        mask="99.99.9999"
                                        value={dataFilters.endDate}
                                        onChange={handleChangeFilters}
                                        className={"rounded-lg border-[#3B64B3] border-2 py-1 px-2 h-[50px] text-black w-full"}
                                        placeholder={"ДД.ММ.ГГГГ"}
                                    />
                                </div>
                            </div>
                        <div className={"flex gap-2 items-center"}>
                            <input type={"checkbox"} name="orderByDateDesc" className={styles.regionalTeam__checkbox}
                                   checked={dataFilters.orderByDateDesc} onChange={handleChangeFiltersCheck} />
                            <p>Сначала новые</p>
                        </div>
                        <div className={"flex gap-2 items-center"}>
                            <input type={"checkbox"} name="orderByDateAsc" className={styles.regionalTeam__checkbox}
                                   checked={dataFilters.orderByDateAsc} onChange={handleChangeFiltersCheck} />
                            <p>Сначала старые</p>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-5 mx-4 mt-5"}>
                        <p className={styles.regionalTeam__miniTitle}>Контроль согласования</p>
                        <div className={"flex gap-2 items-center"}>
                            <input type={"checkbox"} name="" className={styles.regionalTeam__checkbox}
                                   checked={dataFilters.approvalControl.length === 2}
                                   onChange={(e) => handleChangeFiltersCheckCont(e, 'all')} />
                            <p>Все</p>
                        </div>
                        <div className={"flex gap-2 items-center"}>
                            <input type={"checkbox"} name="" className={styles.regionalTeam__checkbox}
                                   checked={dataFilters.approvalControl.includes(true)} onChange={(e) => handleChangeFiltersCheckCont(e, true)} />
                            <p>Пройден</p>
                        </div>
                        <div className={"flex gap-2 items-center"}>
                            <input type={"checkbox"} name="" className={styles.regionalTeam__checkbox}
                                   checked={dataFilters.approvalControl.includes(false)} onChange={(e) => handleChangeFiltersCheckCont(e, false)} />
                            <p>Не пройден</p>
                        </div>
                    </div>
                    <div className={"flex justify-center my-4 items-center sticky z-55 bottom-0 bg-white h-24 p-4 gap-5"}>
                        <button className={cn("bg-[#F1F1F5] text-[#5E5E5E] w-2/4 h-[32px] rounded-[6px]")} onClick={() => {
                            setDataFilters({startDate: "", endDate: "", approvalControl: [true, false], orderByDateAsc: true,
                                orderByDateDesc: false});
                            handleAllChange()
                        }}>Сбросить все</button>
                        <button onClick={() => {
                            setRefresh(prev => !prev);
                            setIsFilterOpen(false)
                        }} className={cn("bg-[#3B64B3] text-white w-2/4 h-[32px] rounded-[6px]")}>Применить</button>
                    </div>
                </div>

            }
        </div>
    )
}
