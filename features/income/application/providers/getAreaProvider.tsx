import { FC, ReactNode, createContext, useReducer, useContext } from "react";
import Area from "../../domain/entities/area";
import AreaResult from "../../domain/entities/areaResult";
import UserDatasourceImp from "../../infraestructure/datasources/userDatasourceImp";
import UserRepositoryImp from "../../infraestructure/repositories/userRepositoryImp";
import Status from "../../domain/entities/status";
import StatusResult from "../../domain/entities/statusResult";

interface AreaContextDefinition {
  loading: boolean;
  areas: Area[];
  status: Status[];
  getAreas: () => void;
  getStatus: () => void;
}

const areaContext = createContext({} as AreaContextDefinition);

interface AreaState {
  loading: boolean;
  areas: Area[];
  status: Status[];
}

type AreaActionType = 
  | { type: 'Set Loading', payload: boolean }
  | { type: 'Set Data Area', payload: AreaResult }
  | { type: 'Set Data Status', payload: StatusResult };

const initialAreaState: AreaState = {
  loading: false,
  areas: [],
  status: [],
};

function areaReducer(state: AreaState, action: AreaActionType) {
  switch (action.type) {
    case 'Set Loading':
      return {
        ...state,
        loading: action.payload,
      };
    case 'Set Data Area':
      return {
        ...state,
        areas: action.payload.area,
        loading: false,
      };

    case "Set Data Status":
      return {
        ...state,
        status: action.payload.status,
        loading: false,
      }
    default:
      return state;
  }
}

type AreaProviderProps = {
  children?: ReactNode;
};

const AreaProvider: FC<AreaProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(areaReducer, initialAreaState);

  const getAreas = async () => {

    const repository = new UserRepositoryImp(
      new UserDatasourceImp()
    );
    // Cambiar el estado a loading
    dispatch({
      type: 'Set Loading',
      payload: true,
    });

    try {

    const result = await repository.getArea();

      // Actualizar el estado con los datos obtenidos
      dispatch({
        type: 'Set Data Area',
        payload: result,
      });
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const getStatus = async () => {

    const repository = new UserRepositoryImp(
      new UserDatasourceImp()
    );
    // Cambiar el estado a loading
    dispatch({
      type: 'Set Loading',
      payload: true,
    });

    try {

    const result = await repository.getStatus();

      // Actualizar el estado con los datos obtenidos
      dispatch({
        type: 'Set Data Status',
        payload: result,
      });
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  return (
    <areaContext.Provider
      value={{
        ...state,
        getAreas,
        getStatus,
      }}
    >
      {children}
    </areaContext.Provider>
  );
};

function useAreaState() {
  const context = useContext(areaContext);
  if (context === undefined) {
    throw new Error("useAreaState debe ser usado con un AreaProvider");
  }

  return context;
}

export { AreaProvider, useAreaState };
