import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from './LoginScreen';
import {it} from "@jest/globals";
import { Provider } from 'mobx-react';

import userStore from '../State/UserStore';

describe('LoginScreen', () => {
    it('should respond to press event on the Confirm button', () => {
        const mockNavigate = jest.fn();
        const props = {
            navigation: {
                navigate: mockNavigate,
            },
        };

        const { getByText } = render(
            <Provider userStore={userStore}>
                <LoginScreen {...props} />
            </Provider>
        );

        const button = getByText('Confirm');
        fireEvent.press(button);

        expect(button).toBeTruthy();
    });

    it('should respond to press event on the Register button', () => {
        const mockNavigate = jest.fn();
        const props = {
            navigation: {
                navigate: mockNavigate,
            },
        };

        const { getByText } = render(
            <Provider userStore={userStore}>
                <LoginScreen {...props} />
            </Provider>
        );

        const button = getByText('New user? Click here to register.');
        fireEvent.press(button);

        expect(button).toBeTruthy();
    });
});
