import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import { server, showError } from '../common'
import axios from 'axios'

const getUserData = async (token) => {
    const userDataJson = await AsyncStorage.getItem('userData')
    let userData = JSON.parse(userDataJson)
    savePushToken(token, userData)
}

const savePushToken = async (token, userData) => {
    const request = {
        "os": token.os,
        "token": token.token,
        "usuario": "/api/usuarios/" + userData.id
    }
    try {
        if(userData.push_token != null && userData.push_id != null){
            const res = await axios.put(`${server}/smartphones/${userData.push_id}`, request)
        } else {
            const res = await axios.post(`${server}/smartphones`, request)
        }
    } catch (error) {
        showError(error.message)
    }
    
}

const RemotePushController = () => {
    useEffect(() => { PushNotification.configure({
        onRegister: function(token) {
            console.log('TOKEN:', token)
            getUserData(token)
        },
        onNotification: function(notification) {
            console.log('REMOTE NOTIFICATION ==>', notification)
        },
        senderID: '256218572662',
        popInitialNotification: true,
        requestPermissions: true
    })
    }, [])
    return null
}

export default RemotePushController