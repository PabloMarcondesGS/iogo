import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import RemotePushController from '../components/RemotePushController'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null
        try {
            userData = JSON.parse(userDataJson)
        } catch (error) {
            //
        }

        if(userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
        
    }

    render() {
        return (
            <View style={styles.container}>
                <RemotePushController />
                <ActivityIndicator size='large' color="#0178a3" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: "#000"
    }
});
