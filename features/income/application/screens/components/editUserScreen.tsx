import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {EditUserProvider, useEditUserState } from '../../providers/editUserProvider';
import React, { useEffect, useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import User from '../../../domain/entities/users';
import Status from '../../../domain/entities/status';
import Area from '../../../domain/entities/area';
import StatusResult from '../../../domain/entities/statusResult';
import AreaResult from '../../../domain/entities/areaResult';
import BackendConfig from '../../../../../config/backend/config';
import { AreaProvider, useAreaState } from '../../providers/getAreaProvider';

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
        success,
        message,
        user,
        errors,

        setUserProp, 
        saveUser,
        setUser,
    } = useEditUserState();

    const {areas, status, getAreas, getStatus} = useAreaState();

    const [showAlert, setShowAlert] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    //al recibir el usuario a editar, pasarlo al proveedor de estado

    useEffect(() => {
      console.log('User in EditUserModal:', user);
      setUser(userEdit);
  }, [userEdit]);

  
  useEffect(()=> {
    getStatus();
    getAreas()
  }, []);


    const handleSave = async (onSaved: Function) => {
      try {
        await saveUser(onSaved);
        closeModal();

        if (onSaved) {
          onSaved();
        }
  
        closeModal();
      } catch (error: any) {
        console.error("Error al guardar el usuario:", error);
        console.log("Respuesta del servidor:", error.response);
    
        if (typeof error.response === 'string') {
          console.log("Respuesta del servidor (no JSON):", error.response);
        } else {
          throw error;
        }
      }
    };

    useEffect(() => {
      if (success) {
        if (message) {
          Alert.alert('Error', message);
        }
        closeModal();
      } else if (message) {
        Alert.alert('Usuario Actualizado', message);
      }
    }, [success, message]);
  
    return (
      <Modal 
      animationIn='bounceInUp'
      animationOut='bounceOutDown'
      animationInTiming={500}
      animationOutTiming={500}
      isVisible={isVisible}
    >
      <ScrollView>
        <View style={styles.modalContainer}>
          <Text style={styles.info}>Editar Prospecto</Text>
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
          <Text style={styles.info2}>A. Paterno</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Apellido"
              placeholderTextColor="#808080"
              value={user?.lastname || ''}
              onChangeText={(text) => {
                setUserProp('lastname', text);
              }}
              textContentType="name"
            />
        </View>
        </View>

        <View>
          <Text style={styles.info2}>A. Materno</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Apellido"
              placeholderTextColor="#808080"
              value={user?.secondLastname || ''}
              onChangeText={(text) => {
                setUserProp('secondLastname', text);
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
            <Text style={styles.info2}>Observaciones</Text>
          <View style={styles.inputViewArea}>
          <TextInput 
              style={styles.inputTextArea}
              multiline={true}
              numberOfLines={10}
              placeholder="Escribe alguna observación"
              placeholderTextColor="#808080"
              value={user?.observations || ''}
              onChangeText={(text) => {
                setUserProp('observations', text);
              }}
              textContentType="none"
            />
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Selecciona Status</Text>
          <View>
          <SelectDropdown
                data={status}
                defaultButtonText={user?.statusName?.name}
                onSelect={(selectedItem, index) => {
                  setSelectedStatus(selectedItem);
                  if (selectedItem) {
                    setUserProp('status',selectedItem.id);
                  } else {
                    console.log("alerta de error");  
                  }
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem ? selectedItem.name : 'Selecciona Status';
                }}
                rowTextForSelection={(item, index) => {
                  return item.name;
                }}
              />
              </View>
              </View>

              <View>
                <Text style={styles.info2}>Selecciona  Área</Text>
                <View>
                <View>
                <SelectDropdown
                      data={areas}
                      defaultButtonText={user?.areaName?.name}
                      onSelect={(selectedItem, index) => {
                        setSelectedArea(selectedItem);
                        if (selectedItem) {
                          setUserProp('area',selectedItem.id);
                        } else {
                          console.log("alerta de error");  
                        }
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem ? selectedItem.name : 'Selecciona Área';
                      }}
                      rowTextForSelection={(item, index) => {
                        return item.name;
                      }}
                    />
              </View>
              </View>
              </View>

              <View style={styles.buttonContainer}>
              
              <TouchableOpacity onPress={() => handleSave(onSaved)}>
                <Button style={styles.button} buttonColor='#f45572' >
                  <Icon name="check" size={20} color="white" /> 
                </Button>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => closeModal()}> 
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

    const EditUserScreen = (props: any) => (
      <EditUserProvider>
        <AreaProvider>
          <EditUserModal {...props} />
        </AreaProvider>    
      </EditUserProvider>
    );

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 180,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
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
    fontSize: 28,
    marginTop: 25,
},
info2: {
    marginBottom: 2,
    textAlign: "center",
    color: 'black',
    fontSize: 20,
    paddingTop: 10

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
  elevation: 5, 
},
inputViewArea: {
  width: "80%",
  marginTop: 10,
  backgroundColor: "#fff",
  borderRadius: 10,
  justifyContent: "center",
  padding: 15,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
inputText: {
  textAlign: 'center',
  alignContent: 'center',
  height: 50,
  color: "#333", // Texto oscuro
},
inputTextArea: {
  textAlignVertical: 'top', 
  height: 150,    
  fontSize: 16,           
},

});


export default EditUserScreen;

