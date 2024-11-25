export type FiltersType = {
    minAge: number | string;
    maxAge: number | string;
    minRank: number | string;
    eventIdList: number[];
    colorList: string[];
    hasInterview: boolean[];
    levelList: string[];
    functionalList: string[];
    testing: boolean[];
    hasClothes: boolean[];
    centerIdList: number[];
    headquartersIdList: number[];
    orderByDateAsc: boolean;
    orderByDateDesc: boolean;
    orderByRankAsc: boolean;
    orderByRankDesc: boolean;
};
