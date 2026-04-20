import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Basic UI Tests', () => {
  it('renders fixed splash screen initially', async () => {
    render(<App />);
    // Splash screen content
    await waitFor(() => {
      expect(screen.getByText(/FlowPass/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('navigates to the Login screen after splash phase', async () => {
    render(<App />);
    
    // Wait for splash to disappear and Login screen to appear
    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    }, { timeout: 8000 });
  });

  it('verifies premium login fields appear', async () => {
    render(<App />);
    
    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText(/.+/);
      return inputs.length > 0;
    }, { timeout: 4000 });

    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });
});
