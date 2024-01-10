import AddUsersResult from "../entities/addUserResult";
import CategorysResult from "../entities/categoryResult";
import SavingsResult from "../entities/incomesResult";
import User from "../entities/users";
import UsersResult from "../entities/usersResult";


abstract class UserDatasource {   
    // tendra una funcion para leer las categorias por numero de pagina, y retonarlos
    abstract getSavings() : Promise<SavingsResult>;
    abstract addUser(user: User): Promise<AddUsersResult>;
    abstract deleteUser(id:any): Promise<AddUsersResult>;

    abstract getUsers() : Promise<UsersResult>;
    abstract getCategorys() : Promise<CategorysResult>;

}
export default UserDatasource;