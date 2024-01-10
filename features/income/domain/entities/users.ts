class User {
    
    name: string;
    lastName: string;
    phone: string;
    address: string;
    status: number;
    area: number;
    id?: number;

    constructor(
        
        name: string,
        lastName: string,
        phone: string,
        address: string,
        status: number,
        area: number,
        id?: number,

    ) {
        
        this.name = name;
        this.lastName = lastName,
        this.phone = phone,
        this.address = address,
        this.status = status,
        this.area = area,
        this.id = id;
    }
}
export default User;