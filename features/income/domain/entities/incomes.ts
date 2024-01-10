import categorysDatasource from "../datasourses/userDatasource";

class Saving {
    
    id?: number;
    rolName: string;
    

    constructor(
        
        rolName: string,
        id?: number,

    ) {
        this.id = id;
        this.rolName = rolName;
        
    }
}
export default Saving;