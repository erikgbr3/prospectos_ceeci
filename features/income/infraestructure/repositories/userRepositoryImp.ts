import SavingsDatasource from "../../domain/datasourses/userDatasource";
import AddUsersResult from "../../domain/entities/addUserResult";
import CategorysResult from "../../domain/entities/categoryResult";
import User from "../../domain/entities/users";
import UsersResult from "../../domain/entities/usersResult";
import UserRepository from "../../domain/repositorio/userRepository";

class UserRepositoryImp extends UserRepository {
   
    datasource: SavingsDatasource;

    constructor(datasource: SavingsDatasource) {
        super();
        this.datasource = datasource;
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

    getCategorys(): Promise<CategorysResult> {
        return this.datasource.getCategorys();
    }

}
export default UserRepositoryImp;