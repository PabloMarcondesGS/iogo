import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import commonStyles from './commonStyles'
import Auth from './screens/Auth'
import AuthOrApp from './screens/AuthOrApp'
import Home from './screens/Home'
import Mapa from './screens/Mapa'
import Menu from './screens/Menu'
import Pedido from './screens/Pedido'
import Pedidos from './screens/Pedidos'

const menuConfig = {
    initialRouteName: 'Pedidos',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: "normal",
            fontSize: 20
        },
        activeLabelStyle: {
            fontWeight: 'bold',
            color: "#0178a3"
        }
    }
}

const menuRoutes = {
    Pedidos: {
        name: 'Pedidos',
        screen: Pedidos
    },
    MeusPedidos: {
        name: 'Meus Pedidos',
        screen: Home
    }
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)

const mainRoutes = {
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    },
    Pedido: {
        name: 'Pedido',
        screen: props => <Pedido {...props} />
    },
    Mapa: {
        name: 'Mapa',
        screen: props => <Mapa {...props} />
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'AuthOrApp'
})

export default createAppContainer(mainNavigator)