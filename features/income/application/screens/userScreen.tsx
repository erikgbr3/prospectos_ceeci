import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { UsersProvider, useUsersState } from '../providers/getUserProvider'; 
import { Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserDeleteScreen from './components/deleteUserScreen';
import User from '../../domain/entities/users';
import { useDeleteUserState } from '../providers/deleteUserProvider';
import UserList from './components/getUserScreen';
import AddUserScreen from './components/addUserScreen';
import EditUserScreen from './components/editUserScreen';

const UsersScreenView = () => {

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

  const [isModalVisible, setModalVisible] = useState(false);

  const [isDataUpdated, setDataUpdated] = useState(false);

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
    console.log('Before setDataUpdated:', isDataUpdated);
    setDataUpdated(true);
    console.log('After setDataUpdated:', isDataUpdated);
  };

  useEffect(() => {
    if (isDataUpdated) {
      console.log('handleDataUpdate called');
      handleDataUpdate();
    }
  }, [isDataUpdated]);

  const renderList = () => {
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
          <UserList
            user={item}
            onEdit={setUserSelected}
            onDeleted={(user: User) => {
              setUserSelectedDeleted(user);
              handleUpdateUser();
            }}
            searchTerm={searchTerm}
          />
        )}
      />
    );
  };

  useEffect(() => {
    getUsers();
  },[]);


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
      {renderList()}
      </View>
  
      <AddUserScreen
      isVisible={isModalVisible} 
      closeModal={() => {
        toggleModal();
        handleUpdateUser(); 
      }}
      />
      

      {!!userSelected ? (
        <EditUserScreen
        userEdit={userSelected}
        isVisible={!!userSelected}
        onSaved={() => {
          onUpdateUser(userSelected);
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
          onDeleteUser(userSelectedDeleted);
          handleUpdateUser() 
        }}
        closeModal={() => setUserSelectedDeleted(null)} 
        />
      ) : null}
    
    </View>
  );
}

const UsersScreen = (props: any) => (
  <UsersProvider>
    <UsersScreenView {...props} /> 
  </UsersProvider>
)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    paddingHorizontal: 10, 
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
    marginTop: 5,
},
buttonContainer: {
  flexDirection: 'row',
  marginTop: 10,
  marginBottom: 10,
  justifyContent: 'center',
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

export default UsersScreen;
