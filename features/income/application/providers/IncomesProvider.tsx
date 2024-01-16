import { FC, ReactNode, createContext, useReducer, useContext} from "react";
import User from "../../domain/entities/users";
import UsersResult from "../../domain/entities/usersResult";
import UserRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import UserDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";

//estructura de context


interface ContextDefinition{

    loading:  boolean,
    users: User[],
    userSelected: User | null,
    userSelectedDeleted: User | null,

    getUsers:()=>void,
    setUserSelected:(user: User | null) => void,
    setUserSelectedDeleted: (user: User | null) => void,
    onUpdateUser: (user: User) => void,
    onDeleteUser: (user: User) => void,
}

const userContext = createContext ( {} as ContextDefinition);


interface UsersState {
    loading:  boolean,
    users: User[],
    userSelected: User | null,
    userSelectedDeleted: User | null,
 
}

//definir los tipos de acciones que podra ejecutar el context

type UsersActionType = 
    |  { type: 'Set Loading', payload: boolean}
    |  {type: 'Set Data', payload: UsersResult}
    |  {type: 'Set User Selected', payload:  User | null}
    | { type: 'Set User Selected Deleted', payload: User | null}
    // |  {type: 'Set Category Selected', payload: Category | null } //parte para editar
    
//iniciar el state

const InitialState : UsersState = {
    
    loading:  false,
    users: [],
    userSelected: null,
    userSelectedDeleted: null,

}

function userReducer(
    state: UsersState,
    action: UsersActionType){
        switch (action.type){
            case 'Set Loading':
                return {
                    ...state, 
                    loading: action.payload
                };
            case 'Set Data':
                return {
                    ...state,
                    users:action.payload.users,
                    loading: false
                };
            case 'Set User Selected':
                return {
                    ...state,
                    userSelected:action.payload,
                };

            case 'Set User Selected Deleted':
                return {
                    ...state,
                    matchSelectedDeleted: action.payload
                }

            default:
                    return state;
    }
}
    //implementar el proveedor para Characters

type Props = {
        children?: ReactNode
}

const UsersProvider:FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer( userReducer, InitialState);

    //acciones

    const getUsers = async () => {
        const reposirtory = new UserRepositoryImp(
            new UserDatasourceImp()
        );

    
//cambiar el estado a loaging

        dispatch({
            type: 'Set Loading',
            payload: true,
        });

        const apiResult = await reposirtory.getUsers();

        dispatch({
            type: 'Set Data',   
            payload: apiResult,
        });
    };

    function setUserSelected (user: User | null) {
        console.log(user);
        dispatch({
            type: 'Set User Selected',
            payload: user,
        });
    }

    function setUserSelectedDeleted(user: User | null) {
        console.log("Usuario a eliminar", user);
        dispatch({
            type: 'Set User Selected Deleted',
            payload: user
        })
    }


    function onUpdateUser(user: User) {
        console.log(user)
        const usersClone = [...state.users];
        const index = usersClone.findIndex((item)=> item.id == user.id);
        usersClone.splice(index, 1, user);

        dispatch({
            type: 'Set Data',
            payload: {
                users: usersClone,
            }
        }
        )
        //cerrar el modal
        setUserSelected(null);
    }

    function onDeleteUser(user: User) {
        console.log("Deleting user:", user);
        const usersClone = state.users.filter(item => item.id !== user.id);
    
        dispatch({
            type: 'Set Data',
            payload: {
                users: usersClone,
            }
        });
    
        setUserSelectedDeleted(null);
    }

    return(
        <userContext.Provider value ={{
            ...state,
            getUsers,
            setUserSelected,
            setUserSelectedDeleted,
            onUpdateUser,
            onDeleteUser,
        }}>
        {children}
        </userContext.Provider>
    )
};

    function useUsersState(){
        const context = useContext(userContext);
        if(context === undefined){
            throw new Error ("useSavingsState debe ser usado" + "con un savingsProvider");
        }

        return context;
    }

export {UsersProvider, useUsersState}