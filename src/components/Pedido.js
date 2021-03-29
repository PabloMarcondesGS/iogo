import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import commonStyles from '../commonStyles'
import moment from 'moment'
import 'moment/locale/pt-br'

export default props => {

    const formattedDate = moment(props.registroDataCriacao).locale('pt-br').format('ddd, D [de] MMMM HH:mm')

    let color = "#323232"
    switch (props.status.id) {
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
            <TouchableOpacity
                style={styles.row}
                onPress={() => props.openPedido(props)}
            >
                <View style={styles.numeroPedido}>
                    <Text>N&ordm; {props.id}</Text>
                    <Text style={{ color: color }}>{props.status.status}</Text>
                    <Text style={styles.empresa}>{props.empresa.nome}</Text>
                </View>
                <View style={styles.infoPedido}>
                    <Text style={styles.valor}>R$ {props.valorPedido?.toFixed(2)}</Text>
                    <Text style={styles.desc}>{props.nomeComprador} - {props.enderecoCompleto}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        borderColor: '#AAA',
        borderBottomWidth: 1,
        justifyContent: "center",
        backgroundColor: '#FFF'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    numeroPedido: {
        flex: 1,
        justifyContent: "center"
    },
    infoPedido: {
        flex: 4
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15,
        textAlign: "center",
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12,
        textAlign: "center",
    },
    valor: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold"
    },
    empresa: {
        color: "#0178a3",
        fontWeight: "bold"
    }
})
