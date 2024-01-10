import User from "./users";

class UsersResult{
    
    user: User[];

    constructor(

        user: User[],
    ) {
        
        this.user = user;
    }
}
export default UsersResult;