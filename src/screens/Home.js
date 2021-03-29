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
    pedidos: []
}

export default class Home extends Component {

    state = { ...initialState }

    componentDidMount = async () => {
        this.loadPedido()
    }

    loadPedido = async () => {
        try {
            const userDataJson = await AsyncStorage.getItem('userData')
            const userData = JSON.parse(userDataJson)

            const entregadorId = userData.id
            const res = await axios.get(`${server}/pedidos?entregador=${entregadorId}`) 
            this.setState({ pedidos: res.data["hydra:member"] })
        } catch (error) {
            showError(error)
        }
        
    }

    openPedido = (pedido) => {
        this.props.navigation.navigate('Pedido', { pedido })
    }

    openDrawer = () => {
        this.props.navigation.openDrawer()
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="Meus Pedidos" icon="bars" openDrawer={this.openDrawer} { ...this.props } />
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
