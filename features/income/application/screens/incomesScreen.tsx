import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SavingCard from './components/incomesCard';

//import { SavingsProvider, useSavingsState } from '../providers/SavingsProvider';
import {UsersProvider, useUsersState } from '../providers/IncomesProvider'; //la ultima carpeta no se llama asi, error y no error


import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Cambia MaterialIcons por el conjunto de íconos que desees usar


import AddSavingScreen from './components/addIncomeScreen';


import EditSavingScreen from './components/incomeEditModal';

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderCards = () => {
    if(!users)
    {
      return null;
    }
    
    return users?.map((user) => (
      <SavingCard 
      key={`user${user.id}`} 
      user={user} 
      onEdit={setUserSelected}
      />
      )
    );
  }

  useEffect(() => {
    getUsers();
  }, []);

    return (
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
      closeModal={toggleModal}
      />

      {!!userSelected ? (

        <EditSavingScreen
        userEdit={userSelected}
        isVisible={!!userSelected}
        onSaved={onUpdateUser}
        closeModal={setUserSelected}
        />

      ) : null }
      
      
  
    </ScrollView>
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
