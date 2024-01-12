import AddUsersResult from "../entities/addUserResult";
import AreaResult from "../entities/areaResult";
import StatusResult from "../entities/statusResult";
import User from "../entities/users";
import UsersResult from "../entities/usersResult";


abstract class UserRepository {
    // tendra una funcion para ller los personajes por numero de pagina, y retonarlos
    abstract getStatus() : Promise<StatusResult>;

    abstract addUser(user: User): Promise<AddUsersResult>;

    abstract deleteUser(user:User): Promise<AddUsersResult>;
    
    abstract getUsers() : Promise<UsersResult>;
    
    abstract getArea() : Promise<AreaResult>;

}

export default UserRepository;