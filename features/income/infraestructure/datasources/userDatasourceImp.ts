import Saving from "../../domain/entities/incomes";
import User from "../../domain/entities/users";
import Category from "../../domain/entities/category";
import SavingsResult from "../../domain/entities/incomesResult";
import UsersResult from "../../domain/entities/usersResult";
import CategorysResult from "../../domain/entities/categoryResult";
import UserDatasource from "../../domain/datasourses/userDatasource";
import AddUsersResult from "../../domain/entities/addUserResult";
import BackendConfig from "../../../../config/backend/config";

class UserDatasourceImp extends UserDatasource {

    async getSavings(): Promise<SavingsResult> {

        return fetch(`${BackendConfig.url}/api/status`)
        .then((response) => response.json())
        .then((response) => {

            console.log(response);

            if (!response) {
                return new SavingsResult(
                    []
                )
            }
            const saving = response.map((item : any) => new Saving(
                
                item.rolName,
                item.id
                )
            );

            return new SavingsResult(saving)
        });
    }

    async addUser(user: User): Promise<AddUsersResult> {
        console.log(user);

    return fetch(`${BackendConfig.url}/api/user`, {
      method: !user.id? "POST" : "PUT",
      body: JSON.stringify(user), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
      .then((response) => {
        console.log(response); 
        const result = new AddUsersResult(response.message, response.user || null);
        result.errors = response.errors || null;
        result.error = response.error || false;

        return result;
      });
    }
    async deleteUser(user: User): Promise<AddUsersResult> {
        return fetch(`${BackendConfig.url}/api/user?id=${user.id}`, {
            method: 'DELETE',
            headers: {
              'Contend-type': "application/json",
            }
          })
          .then((response) => response.json())
            .then((response) => {
              const result = new AddUsersResult(response.message, response.user || null);
              result.errors = response.errors || null;
              result.error = response.error || null;
      
              return result;
            })
    }

    async getUsers(): Promise<UsersResult> {

        return fetch(`${BackendConfig.url}/api/user`)
        .then((response) => response.json())
        .then((response) => {

            console.log(response);

            if (!response) {
                return new UsersResult(
                    []
                )
            }
            const user = response.map((item : any) => new User(
                item.id,
                item.name,
                item.phone,
                item.address,
                item.status,
                item.area,
                )
            );

            return new UsersResult(user)
        });
    }

    async getCategorys(): Promise<CategorysResult> {

        return fetch(`${BackendConfig.url}/api/area`)
        .then((response) => response.json())
        .then((response) => {

            console.log(response);

            if (!response) {
                return new CategorysResult(
                    []
                )
            }
            const user = response.map((item : any) => new Category(
                item.id,
                item.name
                )
            );

            return new CategorysResult(user)
        });
    }
   
}

export default UserDatasourceImp;