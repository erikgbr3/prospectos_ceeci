class Area {
    
    id?: number;
    name: string;
    area: string;

    constructor(
        
        name: string,
        area: string,
        id?: number,

    ) {
        this.id = id;
        this.name = name;
        this.area = area;
    }
}
export default Area;