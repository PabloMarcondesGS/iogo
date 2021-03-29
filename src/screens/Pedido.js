import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import commonStyles from '../commonStyles'
import moment from 'moment'
import 'moment/locale/pt-br'
import NavBar from '../components/NavBar'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import { server, showError } from '../common'
import axios from 'axios'

export default class Pedido extends Component {

    setStatus = async (pedidoId, statusId) => {
        try {
            let requestBody = { status: `/api/status_pedidos/${statusId}` };
            if (statusId == 2) {
                requestBody = { status: `/api/status_pedidos/${statusId}`, entregador: null }
            }
            const res = await axios.put(`${server}/pedidos/${pedidoId}`, requestBody)
            this.setState({ pedidos: res.data["hydra:member"] })
            this.props.navigation.navigate('MeusPedidos')
        } catch (error) {
            showError(error.message)
        }
    }

    solicitarEntrega = async (pedidoId) => {
        try {
            const userId = this.props.navigation.getParam('userId')
            const res = await axios.put(`${server}/pedidos/${pedidoId}`, { status: `/api/status_pedidos/3`, entregador: `/api/usuarios/${userId}` })
            this.setState({ pedidos: res.data["hydra:member"] })
            this.props.navigation.navigate('MeusPedidos')
        } catch (error) {
            showError(error.message)
        }
    }

    render() {

        const pedido = this.props.navigation.getParam('pedido')
        const formattedDate = moment(pedido.registroDataCriacao).locale('pt-br').format('ddd, D [de] MMMM HH:mm')

        const openDrawer = () => {
            this.props.navigation.navigate('Home')
        }

        let color = "#323232"
        switch (pedido.status.id) {
            case 5:
                color = 'green'
                break
            case 7:
            case 8:
                color = 'red'
                break
            default:
                break
        }

        return (
            <View style={styles.container}>
                <NavBar title="Pedido" icon="arrow-left" openDrawer={openDrawer} {...this.props} />
                <View style={styles.pedido}>
                    <View>
                        <Text style={styles.numeroPedido}>N&ordm; {pedido.id}</Text>
                        <Text style={[styles.statusPedido, { color: color }]}>{pedido.status.status}</Text>
                        <Text style={styles.empresa}>{pedido.empresa.nome}</Text>
                    </View>
                    <View style={styles.infoPedido}>
                        <Text style={styles.valor}>Valor: R$ {pedido?.valorPedido?.toFixed(2)}</Text>
                        <Text style={styles.desc}>Comprador: {pedido.nomeComprador}</Text>
                        <Text style={styles.desc}>Data: {formattedDate}</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>Endereço de Coleta</Text>
                        <Text style={styles.desc}>{pedido.empresa.endereco.rua} {pedido.empresa.endereco.numero} {pedido.empresa.endereco.complemento}</Text>
                        <Text style={styles.desc}>{pedido.empresa.endereco.bairro}, {pedido.empresa.endereco.cidade.nome} - {pedido.empresa.endereco.cidade.estado.uf}</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>Endereço de Entrega</Text>
                        <Text style={styles.desc}>{pedido.enderecoCompleto}</Text>
                    </View>
                </View>
                <View style={styles.botoes}>
                    {pedido.status.id < 6 &&
                        <TouchableOpacity style={styles.botao} onPress={() => this.props.navigation.navigate('Mapa', { pedido })}>
                            <View>
                                <Icon name="map-marker" size={30} color="#FFF" />
                            </View>
                            <Text style={styles.botaoTexto}>Ir para o Mapa</Text>
                        </TouchableOpacity>
                    }
                    {pedido.status.id == 2 &&
                        <TouchableOpacity style={[styles.botao, { backgroundColor: 'green' }]} onPress={() => this.solicitarEntrega(pedido.id)}>
                            <View>
                                <Icon name="motorcycle" size={30} color="#FFF" />
                            </View>
                            <Text style={styles.botaoTexto}>Solicitar Entrega</Text>
                        </TouchableOpacity>
                    }
                    {pedido.status.id == 4 &&
                        <View>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: 'green' }]} onPress={() => this.setStatus(pedido.id, 5)}>
                                <View>
                                    <Icon name="motorcycle" size={30} color="#FFF" />
                                </View>
                                <Text style={styles.botaoTexto}>Iniciar Entrega</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: 'red' }]} onPress={() => this.setStatus(pedido.id, 2)}>
                                <View>
                                    <Icon name="times-circle" size={30} color="#FFF" />
                                </View>
                                <Text style={styles.botaoTexto}>Cancelar Entrega</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {pedido.status.id == 5 &&
                        <View>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: 'green' }]} onPress={() => this.setStatus(pedido.id, 6)}>
                                <View>
                                    <Icon name="check-circle" size={30} color="#FFF" />
                                </View>
                                <Text style={styles.botaoTexto}>Pedido Entregue</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.botao, { backgroundColor: 'red' }]} onPress={() => this.setStatus(pedido.id, 8)}>
                                <View>
                                    <Icon name="times-circle" size={30} color="#FFF" />
                                </View>
                                <Text style={styles.botaoTexto}>Não Entregue</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pedido: {
        flex: 1,
        padding: 10
    },
    numeroPedido: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    statusPedido: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 18,
        textAlign: 'center'
    },
    infoPedido: {
        marginTop: 10
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 16,
    },
    valor: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 16,
        fontWeight: "bold"
    },
    botoes: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-end'
    },
    botao: {
        flexDirection: 'row',
        alignSelf: 'auto',
        justifyContent: 'center',
        backgroundColor: '#0178a3',
        paddingVertical: 10,
        marginTop: 5
    },
    botaoTexto: {
        paddingLeft: 10,
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: "#FFF"
    },
    empresa: {
        color: "#0178a3",
        fontWeight: "bold",
        textAlign: "center"
    }
});
