import AddUsersResult from "../entities/addUserResult";
import CategorysResult from "../entities/categoryResult";
import Saving from "../entities/incomes";
import SavingsResult from "../entities/incomesResult";
import User from "../entities/users";
import UsersResult from "../entities/usersResult";


abstract class UserRepository {
    // tendra una funcion para ller los personajes por numero de pagina, y retonarlos
    abstract addUser(user: User): Promise<AddUsersResult>;

    abstract deleteUser(user:User): Promise<AddUsersResult>;
    
    abstract getUsers() : Promise<UsersResult>;
    
    abstract getCategorys() : Promise<CategorysResult>;

}

export default UserRepository;