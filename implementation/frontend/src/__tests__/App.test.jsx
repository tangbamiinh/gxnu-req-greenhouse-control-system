import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../App';

// Mocking Lucide icons to avoid SVGR issues in tests
vi.mock('lucide-react', () => ({
  Settings: () => <div data-testid="settings-icon" />,
  Droplets: () => <div data-testid="droplets-icon" />,
  Thermometer: () => <div data-testid="thermometer-icon" />,
  Wind: () => <div data-testid="wind-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  History: () => <div data-testid="history-icon" />,
}));

describe('Greenhouse Dashboard', () => {
  it('renders loading state initially', () => {
    // Suppress fetch error in console during this test
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => { }));
    render(<Dashboard />);
    expect(screen.getByText(/Loading Systems.../i)).toBeInTheDocument();
  });

  it('renders sensor data correctly when fetch is successful', async () => {
    const mockData = {
      current: {
        moisture: 45.5,
        temperature: 26.3,
        pump_active: false,
        fan_active: false,
        display_time: '12:00:00'
      },
      history: [],
      metadata: {
        machine_id: 'GXNU-TEST',
        phenomena_controlled: []
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('45.5')).toBeInTheDocument();
      expect(screen.getByText('26.3')).toBeInTheDocument();
    });

    expect(screen.getByText(/GXNU-TEST/i)).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('API Down'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Backend Connection Error/i)).toBeInTheDocument();
    });
  });
});
