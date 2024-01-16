import { FC, ReactNode, createContext, useContext, useReducer } from "react";
import User from "../../domain/entities/users";
import Status from "../../domain/entities/status";
import Area from "../../domain/entities/area";
import UserRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import UserDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";

interface ContextDefinition {
  loading: boolean,
  saving: boolean,
  success: boolean,
  message?: string | null,
  user: User,
  errors: any,

  setUserProp: (property: string, value: any) => void,
  deleteUser: (onDeleted: Function) => void,
  setUser: (user: User) => void,
}

const DeleteUserContext = createContext({} as ContextDefinition);

interface DeleteUserState {
  loading: boolean,
  saving: boolean,
  success: boolean,
  message?: string | null,
  user: User,
  errors: any
}

type DeleteUserActionType =
  { type: 'Set Loading'; payload: boolean }
  | { type: 'Set Saving'; payload: boolean }
  | {
    type: 'Set Success'; payload: {
      success: boolean,
      user?: User,
      message: string
    }
  }
  | { type: 'Set User'; payload: User }
  | { type: 'Set Message'; payload: string | null }
  | {
    type: 'Set Errors'; payload: {
      message: string,
      errors: any
    } 
  };

  const initialState: DeleteUserState = {
    loading: false,
    saving: false,
    success: false,
    message: null,
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
    errors: {}
  }
  
  function DeleteUserReducer(
    state: DeleteUserState, 
    action: DeleteUserActionType
    ) {
    switch (action.type) {
      case 'Set Message':
        return {
          ...state,
          message: action.payload
        }
      case 'Set Loading':
        return {
          ...state,
          loading: action.payload
        }
      case 'Set Saving':
        return {
          ...state,
          saving: action.payload
        }
      case 'Set User':
        return {
          ...state,
          user: action.payload
        }
      case 'Set Errors':
        return {
          ...state,
          errors: action.payload.errors || {},
          message: action.payload.message,
          saving: false
        }
      case 'Set Success':
        return {
          ...state,
          success: action.payload.success,
          message: action.payload.message,
          errors: {},
          saving: false
        }
      default:
        return state
    }
  }

  type Props = {
    children?: ReactNode;
  }

  const DeleteUserProvider : FC<Props> = ({children}) => {
    const [state, dispatch] = useReducer(DeleteUserReducer, initialState);

    function setUserProp(property: string, value: any) {
      dispatch({
        type: 'Set User',
        payload: {
          ...state.user,
          [property]: value,
        }
      })
    }

    async function deleteUser(onDeleted:Function) {
      const repository = new UserRepositoryImp(
        new UserDatasourceImp()
      );
      dispatch({
        type: 'Set Saving',
        payload: true,
      })

      const result = await repository.deleteUser(state.user);

      if(result.user) {
        dispatch({
          type: 'Set Success',
          payload: {
            success: true,
            user: result.user[0],
            message: result.message,
          }
        });

        onDeleted(state.user)
        return;
      }

      let errors: any = {};

      result.errors?.forEach((item) => {
        errors[item.field] = item.error;
      });
      dispatch({
        type: 'Set Errors',
        payload: {
          message: result.message,
          errors,
        }
      });
    }

    function setUser(user: User) {
      dispatch({
        type: 'Set User',
        payload: user,
      })
    }

    return (
      <DeleteUserContext.Provider value={{
        ...state,
        setUserProp,
        deleteUser,
        setUser
      }}
      >
        {children}
      </DeleteUserContext.Provider>
    )
  }

  function useDeleteUserState() {
    const context = useContext(DeleteUserContext);
    if (context === undefined) {
      throw new Error('UseDeletePlayerState debe ser usado con un DeletePlayerProvider');
    }
    return context;
  }
  
  export { DeleteUserProvider, useDeleteUserState }
