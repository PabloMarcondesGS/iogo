import React, { Component } from 'react'
import { Text, ImageBackground, StyleSheet, View, TouchableOpacity } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = { ...initialState }

    signinOrSignup = () => {
        if(this.state.stageNew){
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            const res = await axios.post(`${server}/usuarios`, {
                nome: this.state.name,
                email: this.state.email,
                username: this.state.email,
                password: this.state.password,
                retypedPassword: this.state.confirmPassword,
            })
            
            showSuccess('Usuário cadastrado!')
            this.setState(initialState)

        } catch (error) {
            showError(error)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/login_check`, {
                username: this.state.email,
                password: this.state.password,
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)

        } catch (error) {            
            showError(error.message)
        }
    }

    render() {

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)
        if(this.state.stageNew){
            validations.push(this.state.password === this.state.confirmPassword)
            validations.push(this.state.name && this.state.name.trim().length >= 3)        
        }
        
        const validForm = validations.reduce((t, a) => t && a)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>I-GO</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput
                            icon="user"
                            placeholder="Nome"
                            value={this.state.name}
                            style={styles.input} 
                            onChangeText={name => this.setState({name})}
                        />
                    }
                    <AuthInput
                        icon="at"
                        placeholder="E-mail"
                        value={this.state.email}
                        style={styles.input} 
                        onChangeText={email => this.setState({email})}
                    />
                    <AuthInput
                        icon="lock"
                        placeholder="Password"
                        value={this.state.password}
                        style={styles.input} 
                        secureTextEntry={true}
                        onChangeText={password => this.setState({password})}
                    />
                    {this.state.stageNew &&
                        <AuthInput
                            icon="asterisk"
                            placeholder="Confirma Senha"
                            value={this.state.confirmPassword}
                            style={styles.input} 
                            secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({confirmPassword})}
                        />
                    }
                    <TouchableOpacity 
                        disabled={!validForm} 
                        onPress={this.signinOrSignup}
                    >
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/*
                    <TouchableOpacity 
                        style={{padding: 10}}
                        onPress={() => this.setState({stageNew: !this.state.stageNew})}
                    >
                        <Text style={{color:'#323232'}}>
                            {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                        </Text>
                    </TouchableOpacity>
                */}
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#661c94',
        fontSize: 70,
        marginBottom: 10,
        fontWeight: 'bold',
        fontStyle: "italic"
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.primary,
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10
    },
    formContainer: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 20,
    },
    input: {
        marginTop: 10,
        backgroundColor:'#CCC',
    },
    button: {
        backgroundColor:"#0178a3",
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        borderRadius: 7
    },
    buttonText:{
        fontFamily: commonStyles.fontFamily,
        color: "#FFF",
        fontSize: 20
    }
});
