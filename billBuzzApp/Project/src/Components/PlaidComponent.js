import {LinkLogLevel, PlaidLink} from "react-native-plaid-link-sdk";
import {StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {SERVER_ENDPOINT} from "@env";
import {inject, observer} from "mobx-react";

class PlaidComponent extends React.Component {

    state = {
        token: ''
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const userId = this.props.userStore.firstName + '-' + this.props.userStore.lastName;
        this.createToken(userId).then(response => {
            this.setState({token: response['link_token']});
        })
    }

    createToken = async (userId) => {
        return await fetch(SERVER_ENDPOINT + '/plaid/getLinkToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userId
            })
        }).then(data => data.json()).catch(console.error);
    };

    onPlaidSuccess = (success) => {
        const publicToken = success.publicToken;
        const accounts = success.metadata.accounts;
        const institution = success.metadata.institution;
        const linkSessionId = success.metadata.linkSessionId;

        fetch(SERVER_ENDPOINT + '/plaid/getAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                publicToken,
                email: this.props.userStore.email
            })
        })
            .then(data => data.json())
            .then(response => {
                if (response.success === "success") {
                    this.props.userStore.updateUser(response.user);
                }
            })
            .catch(console.error)
    };

    onPlaidExit = (exit) => {

    };

    render() {
        const {token} = this.state;

        return (
            <View style={styles.addAccount}>
                <PlaidLink
                    tokenConfig={{
                        token: token,
                        logLevel: LinkLogLevel.ERROR,
                        noLoadingState: false
                    }}
                    onSuccess={this.onPlaidSuccess}
                    onExit={this.onPlaidExit}
                >
                    <Icon name={'add'} size={48} color={'#000000'}/>
                </PlaidLink>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    addAccount: {
        width: 64,
        height: 64,
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 100,
        backgroundColor: '#eca239',
        borderRadius: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 3,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
});

export default inject('userStore')(observer(PlaidComponent));