import React, { Component } from 'react'
import { Alert, StyleSheet, Text, View, Button, Linking, Platform } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import NavBar from '../components/NavBar';
import Geolocation from '@react-native-community/geolocation'
import PolyLine from '@mapbox/polyline'
import { apiKey } from '../../google_api_key';
import _, { capitalize, lowerCase } from 'lodash'
import { showError } from '../common';
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome'

const initialState = {
    error: "",
    latitude: 0,
    longitude: 0,
    latitudeEntrega: undefined,
    longitudeEntrega: undefined,
    destination: "",
    origin: "",
    entregaPointCoords: [],
    entregaDistance: '',
    entregaDuration: '',
    entregadorPointCoords: [],
    entregadorDistance: '',
    entregadorDuration: ''
}

export default class Mapa extends Component {

    constructor(props) {
        super(props)
        this.state = { ...initialState }
        this.setEntregaDirectionsDebounced = _.debounce(this.setEntregaDirections)
        this.setEntregadorDirectionsDebounced = _.debounce(this.setEntregadorDirections)
    }

    componentDidMount = async () => {
        this.setGeolocationPosition()
        this.setEntregaDirectionsDebounced()
    }

    setGeolocationPosition = async () => {
        Geolocation.getCurrentPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null
            })
            this.setEntregadorDirectionsDebounced(position.coords.latitude, position.coords.longitude)
        }, error => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
        )
    }

    setEntregaDirections = async () => {
        const pedido = this.props.navigation.getParam('pedido')
        const origin = `${pedido.empresa.endereco.rua} ${pedido.empresa.endereco.numero} ${pedido.empresa.endereco.bairro}, ${pedido.empresa.endereco.cidade.nome} - ${pedido.empresa.endereco.cidade.estado.uf}`
        const destination = pedido.enderecoCompleto
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?key=${apiKey}&origin=${origin}&destination=${destination}`

        try {
            const res = await axios.get(apiUrl)
            const points = PolyLine.decode(res.data.routes[0].overview_polyline.points)

            const entregaPointCoords = points.map(point => {
                this.setState({
                    latitudeEntrega: point[0],
                    longitudeEntrega: point[1]
                })
                return { latitude: point[0], longitude: point[1] }
            })
            this.setState({
                entregaPointCoords,
                entregaDistance: res.data.routes[0].legs[0].distance.text,
                entregaDuration: res.data.routes[0].legs[0].duration.text
            })
            this.map.fitToCoordinates(entregaPointCoords)
        } catch (error) {
            Alert.alert(
                'Ops! Endereço não encontrado!',
                'Não foi possível montar a rota.\nEntrar em contato com o suporte.'
            )
        }
    }

    setEntregadorDirections = async (latitude, longitude) => {
        const pedido = this.props.navigation.getParam('pedido')
        if (pedido.status.id < 6) {
            const origin = `${latitude},${longitude}`
            let destination = pedido.enderecoCompleto
            if (pedido.status.id < 5) {
                destination = `${pedido.empresa.endereco.rua} ${pedido.empresa.endereco.numero} ${pedido.empresa.endereco.bairro}, ${pedido.empresa.endereco.cidade.nome} - ${pedido.empresa.endereco.cidade.estado.uf}`
            }
            const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?key=${apiKey}&origin=${origin}&destination=${destination}`
            try {
                const res = await axios.get(apiUrl)
                const points = PolyLine.decode(res.data.routes[0].overview_polyline.points)
                const entregadorPointCoords = points.map(point => { return { latitude: point[0], longitude: point[1] } })
                this.setState({
                    entregadorPointCoords,
                    entregadorDistance: res.data.routes[0].legs[0].distance.text,
                    entregadorDuration: res.data.routes[0].legs[0].duration.text
                })
                this.map.fitToCoordinates(entregadorPointCoords)
            } catch (error) {
                showError(error)
            }
        }
    }
    openGps() {
        const pedido = this.props.navigation.getParam('pedido')
        const lat = -30.064642018351137;//this.state.latitude;
        const lng = -51.235299;//this.state.longitude;
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        // const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const latLng = `${lat},${lng}`;
        const label = pedido?.nomeComprador || 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        console.log("url", url)
        this.openExternalApp(url)
    }
    openExternalApp(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }

    render() {
        const pedido = this.props.navigation.getParam('pedido')
        const openDrawer = () => {
            this.props.navigation.navigate('Pedido', { pedido })
        }

        //Geolocation.getCurrentPosition(info => console.log(info));
        let markerDestination = null
        let markerOrigin = null
        let markerEntregador = null
        if (this.state.entregaPointCoords.length > 1) {

            const enderecoColeta1 = pedido.empresa.endereco.rua +
                ' ' + pedido.empresa.endereco.numero +
                ' ' + (pedido.empresa.endereco.complemento ?? '')

            const enderecoColeta2 = pedido.empresa.endereco.bairro +
                ', ' + pedido.empresa.endereco.cidade.nome +
                ' - ' + pedido.empresa.endereco.cidade.estado.uf

            markerDestination = (<Marker
                coordinate={this.state.entregaPointCoords[this.state.entregaPointCoords.length - 1]}
            >
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: 'center' }}>{pedido.enderecoCompleto}</Text>
                        <Text style={{ textAlign: 'center' }}>{this.state.entregaDistance} - {this.state.entregaDuration}</Text>
                    </View>
                    <Icon name="map-marker" size={48} color="#0178a3" />
                </View>
            </Marker>)
            markerOrigin = (<Marker coordinate={this.state.entregaPointCoords[0]} >
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: 'center' }}>{enderecoColeta1}</Text>
                        <Text style={{ textAlign: 'center' }}>{enderecoColeta2}</Text>
                    </View>
                    <Icon name="map-pin" size={46} color="#0178a3" />
                </View>
            </Marker>)
        }

        if (this.state.entregadorPointCoords.length > 1) {
            markerEntregador = (<Marker
                coordinate={this.state.entregadorPointCoords[0]}
            >
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: 'center' }}>{this.state.entregadorDistance} - {this.state.entregadorDuration}</Text>
                    </View>
                    <Icon name="motorcycle" size={38} color="#0178a3" />
                </View>
            </Marker>)
        }

        console.log("GPS:", this.state.latitudeEntrega, this.state.longitudeEntrega, !(this.state.latitudeEntrega && this.state.longitudeEntrega))

        return (
            <View style={styles.container}>
                <NavBar title="Mapa" icon="arrow-left" openDrawer={openDrawer} {...this.props} />
                <MapView style={styles.map}
                    ref={map => { this.map = map }}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {markerOrigin}
                    {markerDestination}
                    {markerEntregador}
                    <Polyline
                        coordinates={this.state.entregaPointCoords}
                        strokeWidth={4}
                        strokeColor="red"
                    />
                    <Polyline
                        coordinates={this.state.entregadorPointCoords}
                        strokeWidth={4}
                        strokeColor="#323232"
                    />
                </MapView>
                <View style={{ backgroundColor: 'transparent' }}>

                    <View
                        style={[
                            {
                                flexDirection: 'row',
                            },
                        ]}>
                        <View style={{ flex: 0.5, paddingLeft: 10, paddingRight: 5 }}>
                            <Button
                                title="Ir até o endereço de coleta"
                                color="#0178a3"
                                disabled={!(this.state.longitudeEntrega && this.state.latitudeEntrega)}
                                onPress={() => this.openGps()}
                            />
                        </View>
                        <View style={{ flex: 0.5, paddingLeft: 5, paddingRight: 5 }}>
                            <Button
                                style={{ textTransform: 'capitalize' }}
                                title="Ir até o endereço de entrega"
                                color="#0178a3"
                                disabled={!(this.state.longitudeEntrega && this.state.latitudeEntrega)}
                                onPress={() => this.openGps()}
                            />
                        </View>
                    </View>



                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        flex: 1
    },
    flexButton: {
        flex: 1,
        padding: 20,
    },
});
