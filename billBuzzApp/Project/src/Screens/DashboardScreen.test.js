import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from './DashboardScreen';
import {it} from "@jest/globals"; // Adjust the import path if necessary

// Mock the navigation prop
const mockNavigate = jest.fn();

function describe(dashboardScreen, param2) {
    
}

describe('DashboardScreen', () => {
    it('should navigate to Transactions screen when the button is pressed', () => {
        // Render the DashboardScreen with a mock navigation prop
        const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);

        // Find the button by its text and simulate a press event
        const button = getByText('View all transactions');
        fireEvent.press(button);

        function expect(mockNavigate) {
            
        }

        // Check if the navigate function was called with 'Transactions'
        expect(mockNavigate).toHaveBeenCalledWith('Transactions');
    });
});