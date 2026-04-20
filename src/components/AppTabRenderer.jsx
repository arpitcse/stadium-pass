import React from 'react';
import { 
  Dashboard, 
  NavigationScreen, 
  QueueHub, 
  TicketScreen, 
  ProfileScreen 
} from '../pages';

/**
 * AppTabRenderer Component
 * Pure functional component that switches between different app views based on activeTab.
 * Extracted from App.jsx to reduce main bundle complexity.
 */
export const AppTabRenderer = ({ activeTab, handleTabChange }) => {
  switch (activeTab) {
    case 'home':
      return <Dashboard key="home" onNavigate={handleTabChange} />;
    case 'map':
      return <NavigationScreen key="map" />;
    case 'queue':
      return <QueueHub key="queue" />;
    case 'ticket':
      return <TicketScreen key="ticket" />;
    case 'profile':
      return <ProfileScreen key="profile" />;
    default:
      return <Dashboard key="home" onNavigate={handleTabChange} />;
  }
};
