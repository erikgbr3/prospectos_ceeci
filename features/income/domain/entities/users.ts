import Area from "./area";
import Status from "./status";

class User {
    
    id?: number;
    name: string;
    lastname: string;
    secondLastname: string;
    phone: string;
    email: string;
    address: string;
    status: number;
    area: number;
    observations: string;
    statusName?: Status | undefined;
    areaName?: Area | undefined;

    constructor(
        
        name: string,
        lastname: string,
        secondLastname: string,
        phone: string,
        email: string,
        address: string,
        status: number,
        area: number,
        observations: string,
        statusName?: Status | undefined,
        areaName?: Area | undefined,
        id?: number,

    ) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.secondLastname = secondLastname;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.status = status;
        this.area = area,
        this.observations = observations;
        this.statusName = statusName;
        this.areaName = areaName;
        
    }
}
export default User;