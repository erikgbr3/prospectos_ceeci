import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import SavingCard from './components/incomesCard';
import { UsersProvider, useUsersState } from '../providers/IncomesProvider'; 
import { Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddSavingScreen from './components/addIncomeScreen';
import EditSavingScreen from './components/incomeEditModal';
import UserDeleteScreen from './components/deleteUserScreen';
import User from '../../domain/entities/users';
import { useDeleteUserState } from '../providers/deleteUserProvider';

const SavingsScreenView = () => {

  const { 
    users,
    loading,
    userSelected,
    userSelectedDeleted,

    //actions
    getUsers,
    setUserSelected,
    setUserSelectedDeleted,
    onUpdateUser,
    onDeleteUser, 
   } = useUsersState(); 

   const { deleteUser } = useDeleteUserState();

  const [isModalVisible, setModalVisible] = useState(false);

  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  const [isDataUpdated, setDataUpdated] = useState(false);

  const [, forceUpdate] = useState();

  const [searchTerm, setSearchTerm] = useState('');

  const toggleModal = () => {
    console.log('isModalVisible before toggle:', isModalVisible);
    setModalVisible(!isModalVisible);
  };


  const handleDataUpdate = () => {
    getUsers();
    setDataUpdated(false);
  };

  const handleUpdateUser = () => {
    setDataUpdated(true);
  };

  useEffect(() => {
    if (isDataUpdated) {
      handleDataUpdate();
    }
  }, [isDataUpdated]);

  const renderCards = () => {
    if (users == null) {
      return null;
    }

    const filteredUsers = users.filter((user) => {
      if (!user) {
        return false;
      }

      const fullName = `${user.name} ${user.lastname} ${user.secondLastname} ${user.address} ${user.statusName?.name} ${user.areaName?.name} ${user.areaName?.area}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => `user${item.id}`}
        renderItem={({ item }) => (
          <SavingCard
            user={item}
            onEdit={setUserSelected}
            onDeleted={(user: User) => setUserSelectedDeleted(user)}
            searchTerm={searchTerm}
          />
        )}
      />
    );
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log('Users:', users);
  }, [users]);

  useEffect(() => {
      console.log('User Selected:', userSelected);
  }, [userSelected]);

    return (
    <View >
      <View>
        <Text style={styles.title}>Prospectos</Text>
      </View>
      <View>
        <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        
          <Button style={styles.button} buttonColor='#6a9eda' mode="contained" onPress={toggleModal}>
              <Icon name="add" size={20} color="white" />
          </Button>

          <Button style={styles.button2} buttonColor='#6a9eda' mode="contained" onPress={handleDataUpdate}>
              <Icon name="refresh" size={20} color="white" />
          </Button>

      </View>
      
   
      <View style={styles.container}>
      {renderCards()}
      </View>
      
      <AddSavingScreen 
      isVisible={isModalVisible} 
      closeModal={() => {
        toggleModal();
        handleUpdateUser(); // Establece isDataUpdated a true después de añadir un nuevo usuario
      }}
      key={forceUpdateKey}
      />

      {!!userSelected ? (
        <EditSavingScreen
        userEdit={userSelected}
        isVisible={!!userSelected}
        onSaved={() => {
          onUpdateUser(userSelected); // Pasa el usuario actualizado como argumento
          handleUpdateUser();
        }}
        closeModal={setUserSelected}
        />
      ) : null }

      {!!userSelectedDeleted ? (
        <UserDeleteScreen
        userDelete={userSelectedDeleted}
        isVisible={!!userSelectedDeleted}
        onDeleted={() => {
          onDeleteUser(userSelectedDeleted); // Elimina el usuario de la lista
          handleUpdateUser() // Limpia el usuario seleccionado para eliminar
        }}
        closeModal={() => setUserSelectedDeleted(null)} 
        />
      ) : null}
    
    </View>
  );
}

const IncomesScreen = (props: any) => (
  <UsersProvider>
    <SavingsScreenView {...props} /> 
  </UsersProvider>
)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',  // Alinea las tarjetas a la izquierda
    justifyContent: 'flex-start', // Ajusta según tus necesidades
    paddingHorizontal: 10, // Espacio en blanco a cada lado
},
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 30
  },
  searchInput: {
    height: 40,
    color: 'white',
    borderColor: 'white',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    marginTop: 5, // Ajusta el margen superior
},
buttonContainer: {
  flexDirection: 'row',
  marginTop: 10,
  marginBottom: 10,
  justifyContent: 'center', // Centra los botones horizontalmente
},
  button: {
    width: 70,
    height: 70,
    justifyContent:'center',
    marginLeft: '30%',
    marginRight: 10
  },
  button2: {
    width: 70,
    height: 70,
    justifyContent:'center',
    marginLeft: 10,
    marginRight: '30%'
  }

});

export default IncomesScreen;
