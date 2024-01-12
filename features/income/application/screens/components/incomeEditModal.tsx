import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {EditUserProvider, useEditUserState } from '../../providers/editIncomeProvider';
import React, { useEffect, useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import User from '../../../domain/entities/users';
import Status from '../../../domain/entities/status';
import Area from '../../../domain/entities/area';
import StatusResult from '../../../domain/entities/statusResult';
import AreaResult from '../../../domain/entities/areaResult';
import BackendConfig from '../../../../../config/backend/config';

interface UserEditViewProps {

    userEdit: User,
    onSaved: Function,
    isVisible: boolean;
    closeModal: Function;
}

const EditUserModal: React.FC<UserEditViewProps> = ({ 
    userEdit,
    onSaved,
    isVisible, 
    closeModal,
}) => {

    const { 
        loading,
        saved, 
        user, 

        setUserProp, 
        saveUser,
        setUser,
    } = useEditUserState();

    
    const [status, setStatus] = useState<Status[]>([]);

    const [area, setArea] = useState<Area[]>([]);

    //al recibir el usuario a editar, pasarlo al proveedor de estado

    useEffect(() => {
      console.log('User in EditUserModal:', user);
      setUser(userEdit);
  }, [userEdit]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const statusResult = await getStatus();
          if (statusResult) {
            setStatus(statusResult.status);
          }
        } catch (error) {
          console.error('Error fetching status:', error);
        }
      };
    
      fetchData();
    }, []);
  
    const getStatus = async () => {
      return fetch(`${BackendConfig.url}/api/status`)
        .then((response) => response.json())
        .then((response) => {
          if (!response) {
            return new StatusResult([]);
          }
          const status = response.map((item: any) => new Status(item.rolName, item.id));
          return new StatusResult(status);
        });
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const areaResult = await getArea();
          if (areaResult) {
            setArea(areaResult.area);
          }
        } catch (error) {
          console.error('Error fetching areas:', error);
        }
      };
    
      fetchData();
    }, []);
  
    const getArea = async () => {
      return fetch(`${BackendConfig.url}/api/area`)
        .then((response) => response.json())
        .then((response) => {
          if (!response) {
            return new AreaResult([]);
          }
          const area = response.map((item: any) => new Area(item.name, item.area, item.id));
          return new AreaResult(area);
        });
    };
  
    
    return (
      <Modal isVisible={isVisible}>
      <ScrollView>
      <View style={styles.modalContainer}>
        <Text style={styles.info}>Registrar Prospecto</Text>
        <View>
        <Text style={styles.info2}>Nombre</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Nombre"
              placeholderTextColor="#808080"
              value={user?.name || ''}
              onChangeText={(text) => {
                setUserProp('name', text);
              }}
              textContentType="name"
            />
          </View>
          </View>

        <View>
          <Text style={styles.info2}>Apellido</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Apellido"
              placeholderTextColor="#808080"
              value={user?.lastName || ''}
              onChangeText={(text) => {
                setUserProp('lastName', text);
              }}
              textContentType="name"
            />
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Teléfono</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Teléfono"
              placeholderTextColor="#808080"
              value={user?.phone || ''}
              onChangeText={(text) => {
                setUserProp('phone', text);
              }}
              textContentType="telephoneNumber"
            />
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Correo</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Correo"
              placeholderTextColor="#808080"
              value={user?.email || ''}
              onChangeText={(text) => {
                setUserProp('email', text);
              }}
              textContentType="emailAddress"
            />
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Dirección</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe la Direccion"
              placeholderTextColor="#808080"
              value={user?.address || ''}
              onChangeText={(text) => {
                setUserProp('address', text);
              }}
              textContentType="addressCityAndState"
            />
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Selecciona Status</Text>
          <View>
          <SelectDropdown
            data={status}
            onSelect={(selectedItem, index) => {
              if(selectedItem){
                setUserProp('status', selectedItem.id);
                console.log(selectedItem.id);
              } else {
                console.log("alerta de error");  
              }
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.rolName;
            }}
            rowTextForSelection={(item, index) => {
              return item.rolName;
            }}
          />
        </View>
        </View>

        <View>
          <Text style={styles.info2}>Selecciona  Área</Text>
          <View>
          <View>
          <SelectDropdown
            data={area}
            onSelect={(selectedItem, index) => {
              if(selectedItem){
                setUserProp('area', selectedItem.id)
                console.log(selectedItem.id);
              } else {
                console.log("alerta de error");  
              }
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />
        </View>
        </View>
        </View>

            <View style={styles.buttonContainer}>
            
            <TouchableOpacity onPress={() => saveUser(onSaved)}>
              <Button style={styles.button} buttonColor='#f45572' >
                <Icon name="check" size={20} color="white" /> 
              </Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => closeModal(null)}> 
                <Button style={styles.button} buttonColor='#6a9eda'>
                    <Icon name="close" size={20} color="white" /> 
                </Button>
            </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
        </Modal>
    );
    };

    const EditSavingScreen = (props: any) => (
      <EditUserProvider>
          <EditUserModal {...props} />
      </EditUserProvider>
    );

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    
},
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
},
button: {
    width: 'auto',
    marginLeft: 8,
    marginRight: 8

},
info: {
    marginBottom: 2,
    textAlign: "center",
    color: 'black',
    fontSize: 16,
    marginTop: 25,
},
info2: {
    marginBottom: 2,
        textAlign: "center",
        color: 'black',
        fontSize: 15,
        padding: 5,
  },
inputView: {
  width: "80%",
  marginTop: 10,
  backgroundColor: "#fff", // Fondo blanco
  borderRadius: 10,
  height: 50,
  justifyContent: "center",
  padding: 15, // Reducido el relleno
  shadowColor: "#000", // Sombra
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5, // Sombra para plataformas Android
},
inputText: {
  textAlign: 'center',
  alignContent: 'center',
  height: 50,
  color: "#333", // Texto oscuro
},

});


export default EditSavingScreen;
