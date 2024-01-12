import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SavingCard from './components/incomesCard';
import { UsersProvider, useUsersState } from '../providers/IncomesProvider'; 
import { Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddSavingScreen from './components/addIncomeScreen';
import EditSavingScreen from './components/incomeEditModal';
import User from '../../domain/entities/users';

const SavingsScreenView = () => {

  const { 
    users,
    loading,
    userSelected,

    //actions
    getUsers,
    setUserSelected,
    onUpdateUser,
   } = useUsersState();

  const [isModalVisible, setModalVisible] = useState(false);

  const [isDataUpdated, setDataUpdated] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDataUpdate = () => {
    getUsers();
    setDataUpdated(false);
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
        return false; // O cualquier lógica que desees para manejar el caso de user siendo undefined
      }
    
      const fullName = `${user.name} ${user.lastName}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    return filteredUsers.map((user) => (
      <SavingCard
        key={`user${user.id}`}
        user={user}
        onEdit={setUserSelected}
        searchTerm={searchTerm}
      />
    ));
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
    <View>
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
    <ScrollView>
    <View style={styles.buttonContainer}>
      <Button style={styles.button} buttonColor='#6a9eda' mode="contained" onPress={toggleModal}>
          <Icon name="add" size={25} color="white" />
      </Button>
    </View>
   
      <View style={styles.container}>
      
      {renderCards()}

    
      </View>
      
      <AddSavingScreen 
      isVisible={isModalVisible} 
      closeModal={() => {
        toggleModal();
        setDataUpdated(true); // Establece isDataUpdated a true después de añadir un nuevo usuario
      }}
      />

      {!!userSelected ? (

        <EditSavingScreen
        userEdit={userSelected}
        isVisible={!!userSelected}
        onSaved={(updatedUser: User) => {
          onUpdateUser(updatedUser);
          setDataUpdated(true); // Establece isDataUpdated a true después de editar un usuario
        }}
        closeModal={setUserSelected}
        />

      ) : null }
  
    </ScrollView>
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
    //flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginRight: '2%',
    marginLeft: '5%'
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
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    width: 'auto',
    height: 70,
    justifyContent:'center'

  }

});

export default IncomesScreen;
