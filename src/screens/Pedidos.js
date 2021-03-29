import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import commonStyles from '../commonStyles'
import Pedido from '../components/Pedido'
import axios from 'axios'
import { server, showError } from '../common'
import AsyncStorage from '@react-native-community/async-storage'
import NavBar from '../components/NavBar'
import Icon from 'react-native-vector-icons/FontAwesome'

const initialState = {
    pedidos: [],
    userId: null
}

export default class Pedidos extends Component {

    state = { ...initialState }

    componentDidMount = async () => {
        this.loadPedido()
        const userDataJson = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(userDataJson)
        this.setState({ userId: userData.id })
    }

    loadPedido = async () => {
        try {
            const userDataJson = await AsyncStorage.getItem('userData')
            const userData = JSON.parse(userDataJson)
            const empresasId = userData.empresas

            const res = await axios.get(`${server}/pedidos?status=2`) 
            let pedidos = res.data["hydra:member"]
            pedidos = pedidos.filter(pedido => empresasId.includes(pedido.empresa.id))
            this.setState({ pedidos: pedidos })
        } catch (error) {
            if(error.response.data.code == 401) {
                delete axios.defaults.headers.common['Authorization']
                AsyncStorage.removeItem('userData')
                this.props.navigation.navigate('AuthOrApp')
            } else {
                showError(error)
            }
            
        }
        
    }

    openPedido = (pedido) => {
        this.props.navigation.navigate('Pedido', { pedido, userId: this.state.userId })
    }

    openDrawer = () => {
        this.props.navigation.openDrawer()
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="Pedidos" icon="bars" openDrawer={this.openDrawer} { ...this.props } />
                <View style={styles.pedidosList}>
                    {this.state.pedidos.length == 0 &&
                        <Text style={styles.emptyList}>Nenhum pedido a ser listado</Text>
                    }
                    <FlatList 
                        data={this.state.pedidos}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Pedido {...item} openPedido={this.openPedido} />}
                    />                    
                </View>
                <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginBottom: 5 }}>
                    <TouchableOpacity>
                        <Icon name="refresh" size={30} color="#323232" onPress={ () => this.loadPedido() } />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pedidosList: {
        flex: 1
    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#0178a3",
        backgroundColor: "#FFF",
        height: 50,
        justifyContent: "space-between"
    },
    titleBar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    iconBar: {
        top: 10,
        left: 10,
        justifyContent: 'center',
        position: "absolute",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'bold',
        fontSize: 22,
        color: "#0178a3"
    },
    emptyList: {
        textAlign: 'center', 
        padding: 10, 
        fontFamily: commonStyles.fontFamily
    }       
})
