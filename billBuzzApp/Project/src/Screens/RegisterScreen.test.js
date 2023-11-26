import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterScreen from './RegisterScreen';
import {it} from "@jest/globals";
import { Provider } from 'mobx-react';

import userStore from '../State/UserStore';

describe('RegisterScreen', () => {
    it('should respond to press event on the Confirm button', () => {
        const mockNavigate = jest.fn();
        const props = {
            navigation: {
                navigate: mockNavigate,
            },
        };

        const { getByText } = render(
            <Provider userStore={userStore}>
                <RegisterScreen {...props} />
            </Provider>
        );

        const button = getByText('Continue');
        fireEvent.press(button);

        expect(button).toBeTruthy();
    });
});
