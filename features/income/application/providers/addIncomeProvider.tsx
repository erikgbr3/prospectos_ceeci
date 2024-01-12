import { FC, ReactNode, createContext, useContext, useReducer } from "react";
import User from "../../domain/entities/users";
import UserRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import UserDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";
import Status from "../../domain/entities/status";
import Area from "../../domain/entities/area";

//definir la estructura que tendra mi context
interface ContextDefinition {
  //definición del estado
  loading: boolean;
  saved: boolean, 
  message?: string,
  user: User,
  
  // acciones que tendrá mi context
  setUserProp: (property: string, value: any) => void,
  saveUser: () => void,
}

//crear el objeto context de react
const AddUserContext = createContext({} as ContextDefinition);

interface AddUserState {
  //definición del estado
  loading: boolean;
  saved: boolean,
  message?: string,
  user: User,
}

//definir los tipos de acciones que podra ejecutar el context / providers
type AddUserActionType =
  | { type: "Set Loading"; payload: boolean }
  | { type: "Set Saved"; payload: boolean }
  | { type: "Set User"; payload: User };

//inicializar el state
const initialState: AddUserState = {
  loading: false,
  saved: false,
  message: undefined,
  user: new User(
    '',
    '',
    '',
    '',
    '',
    new Status(''),
    new Area('', ''),
    undefined,
    ),
};

function AddUserReducer(
  state: AddUserState, 
  action: AddUserActionType
) {
  switch (action.type) {
    //manipular el estado con base a las acciones
    case "Set Loading":
      return { ...state, loading: action.payload };
    case "Set Saved":
      return {
        ...state,
        saved: action.payload,
      }
    case "Set User":
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state;
  }
};

type Props = {
  children?: ReactNode;
};

const AddUserProvider:FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(AddUserReducer, initialState);

  function setUserProp(property: string, value: any) {
    // mandar el valor al estado user
    dispatch({
      type: 'Set User',
      payload: {
        ...state.user,
        [property]: value,
      }
    });
  }

  async function saveUser() {
    const savingsRepository = new UserRepositoryImp(
      new UserDatasourceImp
    )
    // envir los datos al backend
    dispatch({
      type: 'Set Saved',
      payload: true,
    });
    
    const savedUser = await savingsRepository.addUser(state.user);
    console.log(savedUser);
    dispatch({
      type: 'Set Saved',
      payload: false,
    });
  }

  return (
    <AddUserContext.Provider value={{
        ...state,
        //funciones
        setUserProp,
        saveUser,
      }}
    >
      {children}
    </AddUserContext.Provider>
  );
}

function useAddUserState() {
  const context = useContext(AddUserContext);
  if (context === undefined) {
    throw new Error("useAddSavingState debe ser usado " + " con un useAddSavingState");
  }
  return context;
}

export { AddUserProvider, useAddUserState };