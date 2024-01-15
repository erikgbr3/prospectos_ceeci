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
  saveUser: (onSaved: Function) => void;
  setUser: (user: User) => void;
}

//crear el objeto context de react
const EditUserContext = createContext({} as ContextDefinition);

interface EditUserState {
  //definición del estado
  loading: boolean;
  saved: boolean,
  success: boolean,
  message?: string,
  user: User,
  errors: any,
}

//definir los tipos de acciones que podra ejecutar el context / providers
type EditUserActionType =
  | { type: "Set Loading"; payload: boolean }
  | { type: "Set Saved"; payload: boolean }
  | { type: 'Set Success', payload: { 
    success: boolean, 
    user?: User,
    message: string,
  
  } }
  | { type: "Set User"; payload: User }
  | { type: 'Set Message', payload: string | null}
  | { type: 'Set Errors', payload: {
    message: string,
    errors: any
  }};

  const initialState: EditUserState = {
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
      new Status(''),
      new Area('', ''),
      undefined,
      ),
    errors: {},
  };

function EditSavingReducer(
  state: EditUserState, 
  action: EditUserActionType
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

      case "Set Success":
        return {
          ...state,
          success: action.payload.success,
          message: action.payload.message,
          errors: {},
          saving: false,
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

const EditUserProvider:FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(EditSavingReducer, initialState);

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

  async function saveUser(onSaved: Function) {

    if (!state.user || !state.user.id) {
      console.error('User or user id is undefined');
      return;
    }
  
    const userRepository = new UserRepositoryImp(
      new UserDatasourceImp);
  
    dispatch({ 
      type: 'Set Saved', 
      payload: true 
    });
  
    try {
    const result = await userRepository.addUser(state.user);

    if (Array.isArray(result.user)) {
      // Manejar el caso si result.user es un array
      const updatedUser = result.user[0]; // Puedes seleccionar el primer usuario del array
      dispatch({
        type: 'Set Success',
        payload: {
          success: true,
          user: updatedUser,
          message: result.message,
        },
      });

      onSaved(updatedUser);
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
    } catch (error) {
      console.error('Error updating user:', error);
      dispatch({
        type: 'Set Errors',
        payload: {
          message: 'An error occurred while updating the user.',
          errors: {},
        },
      });
    }
  }
  
  function setUser(user: User){

    dispatch({
        type: 'Set User',
        payload: user,
      });

  } 

  return (
    <EditUserContext.Provider value={{
        ...state,
        //funciones
        setUserProp,
        saveUser,
        setUser,
      }}
    >
      {children}
    </EditUserContext.Provider>
  );
}

function useEditUserState() {
  const context = useContext(EditUserContext);
  if (context === undefined) {
    throw new Error("useEditSavingState debe ser usado " + " con un useEditSavingState");
  }
  return context;
}

export { EditUserProvider, useEditUserState };