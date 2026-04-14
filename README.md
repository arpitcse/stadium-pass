<div align="center">
  
# 🏟️ FlowPass 

**Real-time crowd-aware navigation powered by Firebase & AI**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

[Live Demo](#) | [GitHub Repository](#)

</div>

<br />

## ⚠️ The Problem

Large-scale events constantly suffer from hidden inefficiencies. Attendees at packed stadiums or concert venues frequently experience:
- **Severe Crowd Congestion:** Bottlenecks forming at primary entrances and popular concourses.
- **Excessive Wait Times:** Frustrating delays at amenities, bathrooms, and security checkpoints.
- **Inefficient Movement:** Relying on static, outdated signage that leads everyone down the exact same path.

**The Impact:** This doesn't just result in a poor user experience—it poses genuine safety risks in emergencies and diminishes the overall perceived value of attending a live event.

---

## 💡 Our Solution

**FlowPass** is a premium, real-time smart navigation system built specifically for large venues. It shifts routing logic away from "the shortest geographical path" to **"the most intelligent path."**

By leveraging real-time crowd data and AI-inspired decision-making, FlowPass acts as a dynamic traffic controller in your pocket—guiding users to their seats or amenities via the safest, fastest, and least congested routes.

---

## ✨ Key Features

### 🔹 Smart Navigation
- **What it does:** Dynamically routes attendees to their specific gates and seats based on live venue conditions.
- **Why it matters:** Prevents bottlenecking by evenly distributing crowd flow across all available venue infrastructure.

### 🔹 Real-Time Simulation
- **What it does:** Continuously updates venue density levels on a live interactive map using a sophisticated polling architecture.
- **Why it matters:** Gives users immediate visibility into which areas to completely avoid at any given moment.

### 🔹 AI-Powered Insights
- **What it does:** Generates natural language feedback and routing advice based on current congestion parameters.
- **Why it matters:** Translates complex crowd data into actionable, easy-to-understand guidance (e.g., *"Gate 4 South is clear. Fastest entry path!"*).

### 🔹 Firebase Integration
- **What it does:** Secures user identity and handles scalable, real-time data syncing.
- **Why it matters:** Ensures data consistency across thousands of concurrent users in a packed stadium setting.

### 🔹 Digital Ticket Routing
- **What it does:** Parses the user's specific ticket/seat code to determine their ultimate destination automatically.
- **Why it matters:** Creates a frictionless experience where the user doesn't need to manually configure their endpoint.

### 🔹 Notifications System
- **What it does:** Pushes floating, non-intrusive alerts over the map interface when route conditions change.
- **Why it matters:** Keeps the user continuously informed without interrupting their immediate navigation flow.

### 🔹 Smooth UI/UX
- **What it does:** Employs premium glassmorphism, instant theming, and Framer Motion spring physics.
- **Why it matters:** A tool used in a stressful, crowded environment must feel incredibly responsive, tactile, and reliable.

---

## 🛠️ Google Tech Stack Integration

FlowPass relies heavily on the Google developer ecosystem to guarantee scale and intelligence:

- **Firebase Authentication & Firestore:**
  - *Usage:* Underpins the entire identity system. We utilize Firebase to securely authenticate users before granting access to the live mapping layer. Firestore acts as the hypothetical real-time sync engine for live facility densities.
- **Google Gemini AI:**
  - *Usage:* Forms the "Intelligence Layer." Crowd density metrics are sent to the Gemini API, which returns optimized, context-aware suggestions directly into the user's navigation feed, turning raw data into an intelligent assistant.

---

## 🏗️ System Architecture

Our stack is separated for flexibility and performance:

- **Frontend:** React + Vite (Providing a lightning-fast, native app feel)
- **Backend & Auth:** Firebase Platform
- **Mapping & Visualization:** React Leaflet
- **AI Layer:** Google Gemini API (with deterministic fallback simulations for extreme API load)

---

## 🔄 How It Works

1. **Authentication:** User logs in securely via Firebase.
2. **Contextualization:** User enters or scans their digital ticket code.
3. **Data Polling:** The system fetches current stadium density data from the intelligence layer.
4. **AI Generation:** The Gemini model or fallback logic analyzes the current state and determines the optimal path.
5. **Dynamic Updates:** The map updates with a glowing route, and the user receives live notifications if conditions shift while they are walking.

---

## 🧠 AI Logic Explained

FlowPass does **not** rely on simple Dijkstra algorithms for the shortest physical distance. Our routing logic prioritizes:
1. **Crowd Density:** Heavily penalizing paths passing through "High" density zones.
2. **Wait Time Efficiency:** Factoring in the historical throughput of specific security gates.
3. **Safety Indexing:** Ensuring emergency corridors maintain low occupancy levels.

---

## 🎨 UI/UX Highlights

- **Premium SaaS Aesthetic:** Leveraging advanced "glassmorphism" with `backdrop-blur` and intricate border opacity handling.
- **Fluid Micro-interactions:** Every button and card utilizes spring animations for instant tactile feedback.
- **Instant Theming:** Sub-millisecond light/dark mode toggling strictly utilizing CSS variables—no expensive React re-renders.
- **Mobile First:** Designed to feel like an installed iOS/Android app from within a mobile browser.

---

## 🚧 Limitations

In this current iteration:
- **Simulated Data:** The real-time crowd data is heavily simulated generated locally.
- **No Physical GPS Tracking:** Indoor positioning is mocked; the user's dot currently acts as a static point of reference rather than a live Bluetooth/UWB feed.
- **API Fallbacks:** The Gemini AI insight layer uses a safety fallback to pre-programmed logic to handle rate limit concerns.

---

## 🚀 Future Improvements

To take FlowPass to an enterprise production level:
- **IoT Sensor Integration:** Hooking the data engine directly into turnstiles, optical sensors, and WiFi density scanners.
- **Google Maps Web Platform:** Transitioning the 2D layout to a full indoor mapping solution via Google's spatial mapping APIs.
- **Predictive ML:** Moving from reactive routing to predictive routing (e.g., "The game ends in 10 minutes, start routing users away from Gate 1 now").

---

## ⚡ Performance & Optimization

- **Vite Bundler:** Exploiting Vite's blazingly fast HMR and optimized production rollup chunks.
- **Memoization:** Strategic use of `useMemo` and `useCallback` in the highly volatile `NavigationScreen` to prevent map re-renders during state polling.
- **Animation Offloading:** Utilizing Framer Motion to leverage the GPU for UI transitions, keeping the main JS thread unblocked.

---

## 🔒 Security

- **Strict Route Protection:** Protected wrappers verify Firebase Auth tokens before permitting access to core routes.
- **Environment Management:** API keys (`VITE_GEMINI_API_KEY`, Firebase configs) are isolated from source code.
- **Input Sanitization:** Guarding against XSS via strict control over seat code string parsing.

---

## 🧪 Testing

- **React Testing Library:** Integrated a safe, minimalist ViTest suite.
- **Core Stability:** Test coverage ensures that the foundational transitions (like Splash Screen to Authentication flow) function predictably without locking the application state.

---

## 💻 Installation

To run FlowPass locally:

```bash
git clone https://github.com/Arpit599222/FlowPass.git
cd FlowPass
npm install
npm run dev
```

---



## 📸 Screenshots

A glimpse into the FlowPass experience, showcasing the intuitive interface, live navigation system, and smart ticket-based routing.

| Dashboard | Live Navigation | Digital Ticket |
|----------|----------------|----------------|
| <img src="https://github.com/user-attachments/assets/acb50d3f-dd94-497a-ab67-140440d79a83" width="300"/> | <img src="https://github.com/user-attachments/assets/0ec157e1-ac12-4da3-8e76-38c9d235755f" width="300"/> | <img src="https://github.com/user-attachments/assets/f166f874-8a12-477d-b722-f268a6628f98" width="300"/> |

---

## 👨‍💻 Contributor

**Arpit Raj**  
*B.Tech CSE*

---

<div align="center">
  <br />
  <strong>FlowPass reimagines how people move inside large venues — making navigation intelligent, safe, and efficient.</strong>
</div>
