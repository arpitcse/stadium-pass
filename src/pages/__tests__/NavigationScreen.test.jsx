import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React, { Suspense } from 'react';
import { NavigationScreen } from '../NavigationScreen';

// Mock Leaflet as it doesn't work well in JSDOM
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  Polyline: () => null,
  ZoomControl: () => null,
  ImageOverlay: () => null,
  useMap: () => ({ setMaxBounds: vi.fn(), on: vi.fn() })
}));

describe('NavigationScreen', () => {
  it('renders correctly and shows the primary navigation button', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <NavigationScreen />
      </Suspense>
    );
    
    // Check for the Smart Buddy header
    await waitFor(() => {
      expect(screen.getByText(/Smart Buddy/i)).toBeInTheDocument();
    });
    
    // Check for the "Navigate Now" button
    expect(screen.getByText(/Navigate Now/i)).toBeInTheDocument();
  });
});
