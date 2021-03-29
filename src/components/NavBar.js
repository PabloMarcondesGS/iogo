import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from '../commonStyles'

export default props =>  {
    return (
        <View style={styles.titleRow}>
            <View style={styles.iconBar}>
                <TouchableOpacity onPress={() => props.openDrawer()}>
                    <Icon 
                        name={props.icon} 
                        size={30}
                        color="#0178a3"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.titleBar}>
                <Text style={styles.title}>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#0178a3",
        backgroundColor: "#FFF",
        height: 65,
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
    }      
})
