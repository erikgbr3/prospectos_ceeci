import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList, ScrollView} from "react-native";
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import User from '../../../domain/entities/users';
import UserDeleteScreen from './deleteUserScreen';

interface CardProps {
    user : User,
    onEdit?: Function,
    onDeleted?: (user: User) => void;
    searchTerm: string,
}

const UserList: React.FC<CardProps> = ({
    user,
    onEdit,
    onDeleted,
    searchTerm,
}) => {

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const [isInfoModalVisible, setInfoModalVisible] = useState(false);

    const isMatch = () => {
        const fullName = `${user.name} ${user.lastname} ${user.secondLastname} ${user.address} ${user.statusName?.name} ${user.areaName?.name} ${user.areaName?.area}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      };
    
      if (!isMatch()) {
        return null;
      }
    
        const handleLongPress = () => {
            setInfoModalVisible(true);
        };

        const handlePress = () => {
            setInfoModalVisible(true);
        };

        const handleCloseInfoModal = () => {
            setInfoModalVisible(false);
        };
  
        const handleEdit = () => {
            setInfoModalVisible(true);
            if (onEdit) {
                onEdit(user);
            }
        };
  
      const handleDelete = async () => {
        setInfoModalVisible(false);
        setDeleteModalVisible(true); 
      
        if (onDeleted) {
          try {
            await onDeleted(user);
            console.log('User deleted successfully');
            console.log('handleUpdateUser called successfully');
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        }
      };
      

    return (
            <View style={styles.container1}>
                <TouchableOpacity
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                >
                    <View style={styles.listContainer}>
                            <View style={styles.listInfoView}>
                                <Text style={styles.infoTextList}>{`${user.name} ${user.lastname} ${user.secondLastname}`}</Text>
                            </View>
                    </View>
                </TouchableOpacity>

            <View style={styles.container}>
                <Modal isVisible={isInfoModalVisible} onBackdropPress={handleCloseInfoModal}>
                <View style={styles.space}>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardInfo}>
                            <View style={styles.infoView}>
                                <Text style={styles.info}>Nombre: </Text>
                                <Text style={styles.info2}>{user.name}</Text>
                            </View>
                            <View style={styles.infoView}>
                                <Text style={styles.info}>A. Paterno: </Text>
                                <Text style={styles.info2}>{user.lastname}</Text>
                            </View>
                            <View style={styles.infoView}>
                                <Text style={styles.info}>A. Materno: </Text>
                                <Text style={styles.info2}>{user.secondLastname}</Text>
                            </View>
                            <View style={styles.infoView}>
                                <Text style={styles.info}>Teléfono: </Text>
                                <Text style={styles.info2}>{user.phone}</Text>
                            </View>
                            <View style={styles.infoView}>
                                <Text style={styles.info}>Correo: </Text>
                                <Text style={styles.info2}>{user.email}</Text>
                            </View>
                            
                            <View >
                                <Text style={styles.info}>Dirección: </Text>
                                <Text style={styles.info2} numberOfLines={5}>{user.address}</Text>
                            </View>

                            <View style={styles.infoView}>
                                <Text style={styles.info}>Estatus: </Text>
                                <Text style={styles.info2}> {user.statusName?.name}</Text>
                            </View>

                            <View >
                                <Text style={styles.info}>Curso: </Text>
                                <Text style={styles.info2} numberOfLines={5}>{`${user.areaName?.name}/${user.areaName?.area}`} </Text>
                            </View>
                            
                            <View >
                                <Text style={styles.info}>Observaciones: </Text>
                                <Text style={styles.info2} numberOfLines={10}>{user.observations}</Text>
                            </View>
                            
                        </View>
                    </View> 

                    <View style={styles.buttonContainer}>

                        <TouchableOpacity>
                            <Button style={styles.button} buttonColor='#6a9eda' onPress={handleEdit}>
                                <Icon name="edit" size={20} color="white" /> 
                            </Button>
                        </TouchableOpacity>    
                        
                        <TouchableOpacity>
                        <Button style={styles.button} buttonColor='#f45572' onPress={handleDelete}>
                            <Icon name="delete" size={20} color="white" />
                        </Button>
                        </TouchableOpacity>
                        
                        <TouchableOpacity>
                        <Button style={styles.button} buttonColor='#6a9eda' onPress={handleCloseInfoModal}>
                            <Icon name="close" size={20} color="white" />
                        </Button>
                        </TouchableOpacity>
                    </View>
                </View>
                </Modal>

                    <UserDeleteScreen
                    userDelete={user}
                    isVisible={isDeleteModalVisible}
                    onDeleted={() => {
                        setDeleteModalVisible(false);
                    }}
                    closeModal={() => setDeleteModalVisible(false)}
                    />
            </View>
        </View>
    );
}

export default UserList;


const styles = StyleSheet.create({

    container1: {  
        flex: 1,
        width: '100%',  // Ocupar el ancho completo
        flexWrap: 'wrap'
    },

    container: {  
        width: '100%',  // Ocupar el ancho completo
        flexWrap: 'wrap',
        display:'flex',
        height:'auto',
        justifyContent: 'center'
    },
    space: {
        backgroundColor: '#fff',
        borderRadius: 8,
        // Propiedades específicas de la sombra en Android
        elevation: 5,
        // Propiedades específicas de la sombra en iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 7,
        alignItems: 'center', // Añadido para que las tarjetas se expandan horizontalmente
        width: '100%', 
        height: '60%'   
    },

    cardContainer: {
        flex: 1,
        padding: 8,
        borderRadius: 14,
        border: 1,
        overflow: "hidden",
        margin: 5, // Ajusta el margen aquí
        width: '95%',    // Reduzca el ancho de la tarjeta
        maxWidth: '100%',
        minHeight: 200,
        backgroundColor: "#a0c9c7",
    },
    listContainer: {
        flex: 1,
        padding: 8,
        borderRadius: 14,
        border: 1,
        borderWidth: 1,
        overflow: "hidden",
        margin: 5, // Ajusta el margen aquí
        width: '95%', 
        justifyContent: 'flex-start',  // Alinea el contenido a la izquierda
        alignItems: 'flex-start',
    },

    cardInfo: {
        padding: 8,
    },
    listInfo: {
        padding: 8,
    },
    infoView: {
        justifyContent: 'center',
        display:'flex',
        flexDirection: 'row'
    },
    listInfoView: {
        justifyContent: 'flex-start',
        display:'flex',
        flexDirection: 'row'
    },
    info: {
        marginBottom: 2,
        textAlign: "center",
        fontWeight: 'bold',
        color: 'black',
        fontSize: 19,
    },
    info2: {
        marginBottom: 2,
        textAlign: "center",
        color: 'black',
        fontSize: 19,
        flexWrap: 'wrap',
    },
    infoTextList: {
        marginBottom: 2,
        textAlign: "left",  // Alinea el texto a la izquierda
        color: 'black',
        fontSize: 20,  
        flexWrap: 'wrap',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        width: 'auto',
        marginLeft: 8,
        marginRight: 8
    }
})
