import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from "mobx-react";
import UserStore from "./src/State/UserStore";

const AppProvider = () => (
    <Provider userStore={UserStore}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => AppProvider);
