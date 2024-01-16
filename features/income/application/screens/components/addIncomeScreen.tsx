import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import {AddUserProvider, useAddUserState } from '../../providers/addIncomeProvider';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import backendConfig from '../../../../../config/backend/config';
import SelectDropdown from 'react-native-select-dropdown';
import StatusResult from '../../../domain/entities/statusResult';
import Status from '../../../domain/entities/status';
import AreaResult from '../../../domain/entities/areaResult';
import Area from '../../../domain/entities/area';
import { ScrollView } from 'react-native';
import BackendConfig from '../../../../../config/backend/config';

interface AddUserModalProps {
  isVisible: boolean;
  closeModal: () => void;
}

const AddUserModal: FC<AddUserModalProps> = ({ isVisible, closeModal }) => {

  const { 
    loading, 
    success,
    message,
    user, 
    errors,
    setUserProp, 
    saveUser} = useAddUserState();

  const [status, setStatus] = useState<Status[]>([]);
  const [area, setArea] = useState<Area[]>([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const resetForm = () => {
    setUserProp('name', '');
    setUserProp('lastname', '');
    setUserProp('secondLastname', '');
    setUserProp('phone', '');
    setUserProp('email', '');
    setUserProp('address', '');
    setUserProp('observations', '');
    setUserProp('status', 0);
    setUserProp('area', 0);
  };

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
        const status = response.map((item: any) => new Status(item.name, item.id));
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
    return fetch(`${BackendConfig.url}/api/courses`)
      .then((response) => response.json())
      .then((response) => {
        if (!response) {
          return new AreaResult([]);
        }
        const area = response.map((item: any) => new Area(item.name, item.area, item.id));
        return new AreaResult(area);
      });
  };

  
  const handleSaveUser = async () => {
    try {
    await saveUser();
    resetForm(); 
    closeModal();
    
    } catch (error: any) {
      console.error("Error al guardar la categoría:", error);
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
      Alert.alert('Registro Exitoso', message);
      resetForm();
      closeModal();
    } else if (message) {
      Alert.alert('Registro Exitoso', message);
    }

    return () => {
      setUserProp('errors', {});
    };
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
        <Text style={styles.info}>Registrar Prospecto</Text>
        <View>
        <Text style={styles.info2}>Nombre</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Nombre"
              placeholderTextColor="#808080"
              onChangeText={(text) => {
                setUserProp('name', text);
              }}
              textContentType="name"
            />
            {errors?.name ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.name}</Text>
            ) : null}
          </View>
          </View>

        <View>
          <Text style={styles.info2}>A. Paterno</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Apellido"
              placeholderTextColor="#808080"
              onChangeText={(text) => {
                setUserProp('lastname', text);
              }}
              textContentType="name"
            />
            {errors?.lastname ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.lastname}</Text>
            ) : null}
          </View>
          </View>

          <View>
          <Text style={styles.info2}>A. Materno</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Apellido"
              placeholderTextColor="#808080"
              onChangeText={(text) => {
                setUserProp('secondLastname', text);
              }}
              textContentType="name"
            />
            {errors?.secondLastname ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.secondLastname}</Text>
            ) : null}
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Teléfono</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Teléfono"
              placeholderTextColor="#808080"
              onChangeText={(text) => {
                setUserProp('phone', text);
              }}
              textContentType="telephoneNumber"
            />
            {errors?.phone ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.phone}</Text>
            ) : null}
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Correo</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe el Correo"
              placeholderTextColor="#808080"
              onChangeText={(text) => {
                setUserProp('email', text);
              }}
              textContentType="emailAddress"
            />
            {errors?.email ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
            ) : null}
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Dirección</Text>
          <View style={styles.inputView}>
          <TextInput style={styles.inputText}
              placeholder="Escribe la Direccion"
              placeholderTextColor="#808080"
              onChangeText={(text) => {
                setUserProp('address', text);
              }}
              textContentType="addressCityAndState"
            />
            {errors?.address ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.address}</Text>
            ) : null}
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
              onChangeText={(text) => {
                setUserProp('observations', text);
              }}
              textContentType="none"
            />
            {errors?.observations ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.observations}</Text>
            ) : null}
          </View>
          </View>

          <View>
          <Text style={styles.info2}>Status</Text>
          <View>
          <SelectDropdown
            data={status}
            defaultButtonText='Selecciona aquí'
            onSelect={(selectedItem, index) => {
              if(selectedItem){
                setUserProp('status', selectedItem.id)
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
          {errors?.status ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.status}</Text>
            ) : null}
        </View>
        </View>

        <View>
          <Text style={styles.info2}>Área</Text>
          <View>
          <View>
          <SelectDropdown
            data={area}
            defaultButtonText='Selecciona aquí'
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
          {errors?.area ? (
                      <Text style={{ fontSize: 10, color: 'red' }}>{errors.area}</Text>
            ) : null}
        </View>
        </View>
        </View>
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity onPress={() => handleSaveUser()}>
            <Button style={styles.button} buttonColor='#f45572' >
                  <Icon name="check" size={20} color="white" /> 
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeModal}> 
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

const AddSavingScreen = (props: any) => (
  <AddUserProvider>
    <AddUserModal {...props} />
  </AddUserProvider>
);

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
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
    fontSize: 28,
    padding: 20,
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
  backgroundColor: "#fff",
  borderRadius: 10,
  height: 50,
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
  width: 150,
  color: "#333", // Texto oscuro
},

inputTextArea: {
  textAlignVertical: 'top', 
  height: 150,    
  fontSize: 16,           
},
});

export default AddSavingScreen;

