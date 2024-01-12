import Area from "./area";
import Status from "./status";

class User {
    
    id?: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    status?: Status;
    area?: Area;

    constructor(
        
        name: string,
        lastName: string,
        phone: string,
        email: string,
        address: string,
        status?: Status,
        area?: Area,
        id?: number,

    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.status = status;
        this.area = area;
        
    }
}
export default User;