import User from "./users";

class UsersResult{
    
    users: User[];

    constructor(

        users: User[],
    ) {
        
        this.users = users;
    }
}
export default UsersResult;