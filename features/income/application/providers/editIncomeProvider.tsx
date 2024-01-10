import { FC, ReactNode, createContext, useContext, useReducer } from "react";

import Saving from "../../domain/entities/incomes";
import SavingsRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import SavingsDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";
import User from "../../domain/entities/users";
import UserRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import UserDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";

//definir la estructura que tendra mi context
interface ContextDefinition {
  //definición del estado
  loading: boolean;
  saved: boolean,
  message?: string,
  user: User,
  

  // acciones que tendrá mi context
  setUserProp: (property: string, value: any) => void,
  saveUser: (onSaved: Function) => void,
  setUser: (user: User) => void;
}

//crear el objeto context de react
const EditUserContext = createContext({} as ContextDefinition);

interface EditUserState {
  //definición del estado
  loading: boolean;
  saved: boolean,
  message?: string,
  user: User,
}

//definir los tipos de acciones que podra ejecutar el context / providers
type EditUserActionType =
  | { type: "Set Loading"; payload: boolean }
  | { type: "Set Saved"; payload: boolean }
  | { type: "Set User"; payload: User };

//inicializar el state
const initialState: EditUserState = {
  loading: false,
  saved: false,
  message: undefined,
  user: new User(
    '',
    '',
    '',
    '',
    0,
    0
    ),
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
    const savingsRepository = new UserRepositoryImp(
      new UserDatasourceImp
    )
    // envir los datos al backend
    dispatch({
      type: 'Set Saved',
      payload: true,
    });


    //si ya me mando, cerrar el modal
    const savedUser = await savingsRepository.addUser(state.user);
    console.log(saveUser);
    dispatch({
      type: 'Set Saved',
      payload: false,
    });

    onSaved(state.user);
    return;
    
  }

    

  function setUser(user: User){
    dispatch({
        type: 'Set User',
        payload: user
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