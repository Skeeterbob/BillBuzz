import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from './DashboardScreen';
import {it} from "@jest/globals";
import { Provider } from 'mobx-react';

import userStore from '../State/UserStore';

describe('DashboardScreen', () => {
    it('should respond to press event on the transactions button', () => {
        const mockNavigate = jest.fn();
        const props = {
            navigation: {
                navigate: mockNavigate,
            },
        };

        const { getByText } = render(
            <Provider userStore={userStore}>
                <DashboardScreen {...props} />
            </Provider>
        );

        const button = getByText('View all transactions');
        fireEvent.press(button);

        expect(button).toBeTruthy();
    });

    it('should respond to press event on the overdrafts button', () => {
        const mockNavigate = jest.fn();
        const props = {
            navigation: {
                navigate: mockNavigate,
            },
        };

        const { getByText } = render(
            <Provider userStore={userStore}>
                <DashboardScreen {...props} />
            </Provider>
        );

        const button = getByText('View all Overdrafts');
        fireEvent.press(button);

        expect(button).toBeTruthy();
    });

    it('should respond to press event on the user profile button', () => {
        const mockPush = jest.fn();
        const props = {
            navigation: {
                push: mockPush,
            },
        };

        const { getByTestId } = render(
            <Provider userStore={userStore}>
                <DashboardScreen {...props} />
            </Provider>
        );

        const button = getByTestId('profileButton');
        fireEvent.press(button);

        expect(button).toBeTruthy();
    });
});
