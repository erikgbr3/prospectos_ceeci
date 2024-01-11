import SavingsDatasource from "../../domain/datasourses/userDatasource";
import AddUsersResult from "../../domain/entities/addUserResult";
import Area from "../../domain/entities/area";
import AreaResult from "../../domain/entities/areaResult";
import CategorysResult from "../../domain/entities/areaResult";
import StatusResult from "../../domain/entities/statusResult";
import SavingsResult from "../../domain/entities/statusResult";
import User from "../../domain/entities/users";
import UsersResult from "../../domain/entities/usersResult";
import UserRepository from "../../domain/repositorio/userRepository";

class UserRepositoryImp extends UserRepository {
   
    datasource: SavingsDatasource;

    constructor(datasource: SavingsDatasource) {
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