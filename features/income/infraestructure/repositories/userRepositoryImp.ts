import UserDatasource from "../../domain/datasourses/userDatasource";
import AddUsersResult from "../../domain/entities/addUserResult";
import AreaResult from "../../domain/entities/areaResult";
import StatusResult from "../../domain/entities/statusResult";
import User from "../../domain/entities/users";
import UsersResult from "../../domain/entities/usersResult";
import UserRepository from "../../domain/repositorio/userRepository";

class UserRepositoryImp extends UserRepository {
   
    datasource: UserDatasource;

    constructor(datasource: UserDatasource) {
        super();
        this.datasource = datasource;
    }

    getStatus(): Promise<StatusResult> {
        return this.datasource.getStatus();
    }

    addUser(user: User): Promise<AddUsersResult> {
        return this.datasource.addUser(user);
    }
    
    deleteUser(user: User): Promise<AddUsersResult> {
        return this.datasource.deleteUser(user);
    }


    getUsers(): Promise<UsersResult> {
        return this.datasource.getUsers();
    }

    getArea(): Promise<AreaResult> {
        return this.datasource.getArea();
    }

}
export default UserRepositoryImp;