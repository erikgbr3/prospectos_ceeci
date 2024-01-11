import AddUsersResult from "../entities/addUserResult";
import AreaResult from "../entities/areaResult";
import StatusResult from "../entities/statusResult";
import User from "../entities/users";
import UsersResult from "../entities/usersResult";


abstract class UserDatasource {   
    // tendra una funcion para leer las categorias por numero de pagina, y retonarlos
    abstract getStatus() : Promise<StatusResult>;
    abstract addUser(user: User): Promise<AddUsersResult>;
    abstract deleteUser(id:any): Promise<AddUsersResult>;

    abstract getUsers() : Promise<UsersResult>;
    abstract getArea() : Promise<AreaResult>;

}
export default UserDatasource;