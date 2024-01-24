import { FC, ReactNode, createContext, useContext, useReducer } from "react";
import User from "../../domain/entities/users";
import UserRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import UserDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";

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
    type: 'Set Success', payload: {
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
  message: '',
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

    case "Set Success":
      return {
        ...state,
        success: action.payload.success,
        message: action.payload.message,
        errors: {},
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
        saved: false,
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

    console.log('Saving user:', state.user);
    const savingsRepository = new UserRepositoryImp(
      new UserDatasourceImp
    )
    // envir los datos al backend
    dispatch({
      type: 'Set Saved',
      payload: true,
    });
    
    const result = await savingsRepository.addUser(state.user);

    console.log('Save user result:', result);

    if (result.user) {
      dispatch({
        type: 'Set Success',
        payload: {
          success: true,
          user: result.user,
          message: result.message,
        }
      });
        return;
      }

      let errors : any = {};

      result.errors?.forEach((item) => {
        errors[item.field] = item.error;
      });

      dispatch({
        type: 'Set Errors',
        payload: {
          message: result.message,
          errors,
        },
      });
  }

  return (
    <AddUserContext.Provider value={{
        ...state,
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