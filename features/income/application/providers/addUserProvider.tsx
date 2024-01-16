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
  success: boolean,
  message?: string,
  user: User,
  errors: any,
  
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
  success: boolean,
  message?: string,
  user: User,
  errors: any,
}

//definir los tipos de acciones que podra ejecutar el context / providers
type AddUserActionType =
  | { type: "Set Loading"; payload: boolean }
  | { type: "Set Saved"; payload: boolean }
  | {
    type: 'set Success', payload: {
      success: boolean,
      user?: User,
      message: string
    }
  }
  | { type: "Set User"; payload: User }
  | { type: 'Set Message', payload: string | null}
  | { type: 'Set Errors', payload: {
    message: string,
    errors: any
  }};

//inicializar el state
const initialState: AddUserState = {
  loading: false,
  saved: false,
  success: false,
  message: undefined,
  user: new User(
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    0,
    '',
    new Status(''),
    new Area('', ''),
    undefined,
    ),
    errors: {},
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

    case 'Set Errors':
      return {
        ...state,
        errors: action.payload.errors || {},
        message: action.payload.message,
        saving: false,
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

    dispatch({
      type: 'Set Errors',
      payload: {
        message: '',
        errors: {},
      },
    });
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

    
    
    const result = await savingsRepository.addUser(state.user);
    if (result.user) {
      dispatch({
        type: 'set Success',
        payload: {
          success: true,
          message: result.message,
        }
      })
    } else {
      // Manejar el caso si result.user no es un array
      dispatch({
        type: 'Set Errors',
        payload: {
          message: result.message,
          errors: result.errors || {},
        },
      });
    }
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