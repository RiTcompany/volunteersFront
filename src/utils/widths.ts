export const getColumnWidth = (columnKey: string) => {
    switch (columnKey) {
        case 'id':
            return '150px';
        case 'name':
            return '150px';
        case 'date':
            return '150px';
        case 'tg':
            return '150px';
        case 'vk':
            return '150px';
        case 'color':
            return '200px';
        case 'events':
            return '200px';
        case 'comment':
            return '250px';
        case 'rate':
            return '150px';
        case 'interview':
            return '150px';
        case 'step':
            return '150px';
        case 'headquarters':
            return '150px';
        case 'center':
            return '150px';
        default:
            return 'auto';
    }
};
