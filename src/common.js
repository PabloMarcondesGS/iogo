import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ? 'http://localhost:8000/api' : 'https://w3.igoentregas.com.br/api'

function showError(err) {
    if(err.response && err.response.data){
        Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err.response.data.message}`)
    } else {
        Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err}`)
    }
}

function showSuccess(msg) {
    Alert.alert('Sucesso', msg)
}

export { server, showError, showSuccess }