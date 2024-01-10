import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Saving from '../../../domain/entities/incomes';
import {EditUserProvider, useEditUserState } from '../../providers/editIncomeProvider';
import React, { useEffect, useState} from 'react';
import backendConfig from '../../../../../config/backend/config';

import SelectDropdown from 'react-native-select-dropdown';
import UsersResult from '../../../domain/entities/usersResult';

import User from '../../../domain/entities/users';

import CategorysResult from '../../../domain/entities/categoryResult';
import Category from '../../../domain/entities/category';


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

    
    const [
        users,
         setUsers
    ] = useState([]);

    const [
      categorys,
       setCategorys
    ] = useState([]);

    //al recibir el usuario a editar, pasarlo al proveedor de estado

    useEffect(() => {
        setUser(userEdit)
    }, [userEdit]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const categorysResult = await getCategorys();
          setCategorys(categorysResult.category);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const getCategorys = async () => {
      return fetch(`${backendConfig.url}/api/area`)
        .then((response) => response.json())
        .then((response) => {
          if (!response) {
            return new CategorysResult([]);
          }
          const category = response.map((item:any) => new Category(item.name, item.id));
          return new CategorysResult(category);
        });
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const usersResult = await getUsers();
          setUsers(usersResult.user);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const getUsers = async () => {
      return fetch(`${backendConfig.url}/api/status`)
        .then((response) => response.json())
        .then((response) => {
          if (!response) {
            return new UsersResult([]);
          }
          const user = response.map((item) => new User(item.name, item.id));
          return new UsersResult(user);
        });
    };
    
    return (
        <Modal isVisible={isVisible}>
        <View style={styles.modalContainer}>
            <Text style={styles.info}>Actualizar Ingreso</Text>

            <View style={styles.inputView}>
            <TextInput style={styles.inputText}
                placeholder="Escribe aqui"
                placeholderTextColor="#808080"
                value={user?.name || ''}
                onChangeText={(text) => {
                    setUserProp('name', text);
                }}
                textContentType="name"
                />
            </View>

            <Text style={styles.info}>Actualizar Ingreso</Text>

            <View style={styles.inputView}>
            <TextInput style={styles.inputText}
                placeholder="Escribe aqui"
                placeholderTextColor="#808080"
                value={user?.lastName || ''}
                onChangeText={(text) => {
                    setUserProp('lastName', text);
                }}
                textContentType="name"
                />
            </View>

            <Text style={styles.info2}>Selecciona Categoria</Text>
          <View>
          <SelectDropdown
            data={categorys}
            onSelect={(selectedItem, index) => {
              if(selectedItem){
                setUserProp('categoryId', selectedItem.id)
                console.log(selectedItem.id);
              } else {
                console.log("alerta de error, panal");  
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


            <Text style={styles.info2}>Selecciona un Usuario</Text>
          <View>
          <SelectDropdown
            data={users}
            onSelect={(selectedItem, index) => {
              if(selectedItem){
                setUserProp('clientId', selectedItem.id)
                console.log(selectedItem.id);
              } else {
                console.log("alerta de error, panal");  
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
        </Modal>
    );
    };

const EditSavingScreen = (props: UserEditViewProps) => (
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
