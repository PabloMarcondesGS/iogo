import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from '../commonStyles'

import logo from '../../assets/imgs/logo.png'
import { TouchableOpacity } from 'react-native-gesture-handler'

import pkg from '../../package.json'

export default class Menu extends Component {

    state = {
        name: '',
        email: ''
    }

    logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        this.props.navigation.navigate('AuthOrApp')
    }

    componentDidMount = async () => {
        const userDataJson = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(userDataJson)
        this.setState({ name: userData.name, email:userData.email })
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Image source={logo} style={{width: 50, height: 40}} />
                        <Text style={styles.title}>I-GO</Text>
                    </View>
                    <Text style={styles.versao}>Versão {pkg.version}</Text>
                    <Icon name="user-circle" size={40} color="#0178a3" style={styles.avatar} />   
                    <View style={styles.userInfo}>
                        <Text>{this.state.name}</Text>
                        <Text>{this.state.email}</Text>
                    </View> 
                    <TouchableOpacity onPress={this.logout}>
                        <View style={styles.logoutIcon}>
                            <Icon name='sign-out' size={40} color="#323232" />
                            <Text>Sair</Text>   
                        </View>     
                    </TouchableOpacity>            
                </View>            
                <DrawerItems {...this.props} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDDDDD',
        alignItems: 'center',
        paddingBottom: 10
    },
    logo: {
       flex: 1,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center'
    },
    title: {
        color: '#661c94',
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: "italic",
        paddingTop: 20,
        padding: 10
    },
    avatar: {
        margin: 10
    },
    userInfo: {
        alignItems: 'center',
    },
    logoutIcon: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    versao: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 12
    }
});
