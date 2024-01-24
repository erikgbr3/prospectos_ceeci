import Saving from "../../domain/entities/status";
import User from "../../domain/entities/users";
import UsersResult from "../../domain/entities/usersResult";
import UserDatasource from "../../domain/datasourses/userDatasource";
import AddUsersResult from "../../domain/entities/addUserResult";
import BackendConfig from "../../../../config/backend/config";
import StatusResult from "../../domain/entities/statusResult";
import AreaResult from "../../domain/entities/areaResult";
import Status from "../../domain/entities/status";
import Area from "../../domain/entities/area";

class UserDatasourceImp extends UserDatasource {

    async getStatus(): Promise<StatusResult> {
        try {
            const response = await fetch(`${BackendConfig.url}/api/status`);
            const responseData = await response.json();
    
            if (!responseData) {
                return new StatusResult([]);
            }
    
            const statuses = responseData.map((item: any) => {
                const status = new Status(
                    item.name || '',
                    item.id
                );
    
                return status;
            });
    
            return new StatusResult(statuses);
        } catch (error) {
            console.error('Error fetching users:', error);
            return new StatusResult([]);
        }
    }
    

    async addUser(user: User): Promise<AddUsersResult> {
        console.log(user);

    return fetch(`${BackendConfig.url}/api/users?id=${user.id}`, {
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
        return fetch(`${BackendConfig.url}/api/users?id=${user.id}`, {
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
        try {
            const response = await fetch(`${BackendConfig.url}/api/users`);
            const responseData = await response.json();
    
            if (!responseData) {
                return new UsersResult([]);
            }
    
            const users = responseData.map((item: any) => {
                const user = new User(
                    item.name,
                    item.lastname ,
                    item.secondLastname,
                    item.phone ,
                    item.email ,
                    item.address ,
                    item.status ,
                    item.area ,
                    item.observations ,
                    new Status(item.userStatus?.name || null, item.statusName || null),
                    new Area(item.course?.name || null, item.course?.area || null, item.areaName || null),
                    item.id
                );
    
                return user;
            });
    
            return new UsersResult(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return new UsersResult([]);
        }
    }

    async getArea(): Promise<AreaResult> {
        try {
            const response = await fetch(`${BackendConfig.url}/api/courses`);
            const responseData = await response.json();
    
            if (!responseData) {
                return new AreaResult([]);
            }
    
            const areas = responseData.map((item: any) => {
                const area = new Area(
                    item.name || '',
                    item.area || '',
                    item.id
                );
    
                return area;
            });
    
            return new AreaResult(areas);
        } catch (error) {
            console.error('Error fetching users:', error);
            return new AreaResult([]);
        }
    }
   
}

export default UserDatasourceImp;