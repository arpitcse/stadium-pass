<div align="center">

# 🏟️ FlowPass — Smart Stadium Navigation System

**Real-time crowd-aware navigation logic powered by Google Gemini AI & Firebase**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

<br />

[Live Demo](#) | [GitHub Repository](https://github.com/Arpit599222/FlowPass)

</div>

---

## 🚀 Overview

**FlowPass** is a sophisticated smart navigation system designed for large-scale stadiums and major events. By shifting from traditional "shortest path" logic to **"most intelligent path"** logic, it solves the critical challenges of crowd congestion and inefficient venue movement. 

Using real-time data synchronization and AI-assisted analysis, FlowPass ensures every attendee reaches their destination via the fastest and least crowded route possible.

---

## 🎯 Problem Statement

Modern venues face persistent structural inefficiencies:
- **Crowd Congestion:** Severe bottlenecks at primary gates and internal concourses.
- **Long Wait Times:** Frustrating delays at amenities, security, and food stalls.
- **Poor Navigation Experience:** Reliance on static signboards that fail to adapt to live changes in crowd density.

---

## 💡 Solution

FlowPass transforms the attendee experience by providing:
- **Real-time Route Guidance:** Dynamic paths that respond to live venue conditions.
- **AI-Based Decision Making:** Intelligent processing of complex crowd data.
- **Personalized Navigation:** One-tap routing based specifically on the user's digital ticket/seat.

---

## ✨ Features

### 🧭 Smart Navigation
- **Dynamic Route Generation:** Automatically calculates the optimal path from your current gate to your exact seat.
- **Crowd-Aware Path Selection:** Penalizes high-density zones to keep you moving swiftly.

### 🤖 AI Assistance (Google Gemini)
- **Optimal Route Suggestions:** Processes facility status strings into natural language advice.
- **Real-Time Insights:** Provides wait time estimations and congestion predictions.

### 📡 Firebase Integration
- **Real-Time Data Handling:** Powered by Firestore `onSnapshot` for instant synchronization across all users.
- **User Session Management:** Persistent account data and navigation history logging.

### 🎫 Ticket-Based Routing
- **Seat Mapping:** Just enter your seat code (e.g., B12) to receive a custom-tailored guidance path.

### 🔔 Smart Notifications
- **Live Alerts:** Non-intrusive overlays notify you of gate closures or shifting bottlenecks.

---

## 🗺️ Navigation System

FlowPass features a high-fidelity mapping engine built on **Google Maps** tiles:
- **Satellite/Hybrid Visualization:** High-resolution imagery for real-world context.
- **Directional Overlays:** Georeferenced SVG polylines with flow animations.
- **Interactive Landmark Markers:** One-tap access to Gates, Food stalls, and Restrooms.
- **Fixed Persistence:** Routes remain active and follow you until you reach your destination.

---

## ☁️ Google Technologies Used

FlowPass leverages the full Google Cloud and Firebase ecosystem:
- **Firebase Authentication:** Handles secure user identity (Email, Google, Guest).
- **Cloud Firestore:** Manages real-time congestion data and persistent navigation logs.
- **Google Gemini API:** Generates predictive insights and natural language routing advice.
- **Firebase Analytics:** Tracks user patterns (`navigate_clicked`, `route_generated`) to improve venue flow.
- **Google Maps:** Provides the geospatial foundation for all navigational overlays.

---

## ⚙️ Tech Stack

- **Frontend:** React.js (V3.x)
- **Styling:** Tailwind CSS (Modern Glassmorphism)
- **Bundler:** Vite
- **Database:** Firebase Platform
- **AI Layer:** Google AI Studio (Gemini 1.5 Pro)

---

## 🧪 Testing

The codebase includes integrated validation for core stability:
- **Authentication Validation:** Ensuring secure login/signup transitions.
- **Navigation Logic:** Verifying route persistence and state handling.
- **AI Response Handling:** Testing robust JSON parsing of Gemini outputs.
- **UI Rendering:** Validating layout integrity on mobile and desktop.

---

## 🔐 Security

- **Firebase Guarded Routes:** Strict authentication checks before accessing live data.
- **Environment Safety:** API keys and sensitive configs are isolated from source code.
- **Input Validation:** Sanitized seat code parsing to prevent injection or corruption.

---

## 📈 Performance

- **Memoization:** Optimized rendering using `React.memo` for the mapping engine.
- **Efficiency:** `useMemo` & `useCallback` prevent expensive re-renders during live polling.
- **Lazy Loading:** Components are asynchronously loaded for a faster initial footprint.

---

## ⚠️ Limitations

- **Simulated Density:** Uses sophisticated crowd data simulations for the demo.
- **Indoor GPS:** Positioning is currently a static point-of-reference (mocked).
- **AI Fallback:** Implements deterministic logic if the Gemini API reaches rate limits.

---

## 🔮 Future Improvements

- **Real Stadium IoT:** Direct integration with turnstiles and WiFi density sensors.
- **Indoor Google Maps API:** Enhancing the map with detailed level-by-level indoor layouts.
- **ML-Based Prediction:** Moving from reactive routing to predictive crowd management.

---

## 📦 Installation

To run FlowPass in your local development environment:

```bash
# Clone the repository
git clone https://github.com/Arpit599222/FlowPass.git

# Navigate to directory
cd FlowPass

# Install dependencies
npm install

# Start local server
npm run dev
```

---

## 👨‍💻 Developer

**Arpit Raj**  
*B.Tech Computer Science and Engineering*

---

## 🏁 Final Note

**FlowPass** transforms stadium navigation into a smart, AI-assisted experience — improving safety, efficiency, and user satisfaction at every gate.

---

<div align="center">
  <img src="https://github.com/user-attachments/assets/0ec157e1-ac12-4da3-8e76-38c9d235755f" width="800" alt="FlowPass Navigation Preview"/>
</div>
