class Status {
    
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
export default Status;