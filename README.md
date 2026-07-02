# Survey SaaS Platform - Frontend

A modern survey management platform built with React, TypeScript, TanStack Router, React Query, ShadCN UI, and Recharts.

The application enables administrators to create surveys, manage responses, view analytics, and monitor platform activity through an intuitive dashboard.

---

> **100% free platform** — every feature is included, with no subscription, billing, or payment module.

## Features

### Authentication & Authorization

* User Login
* Secure Authentication
* Protected Routes
* Role-Based Access Control (RBAC)

### Dashboard

* Total Surveys
* Total Responses
* Total Users
* Published Surveys
* Draft Surveys
* Response Statistics
* Most Popular Survey
* Recent Survey Activity

### Survey Management

* Create Survey
* Edit Survey
* Delete Survey
* Publish / Draft Survey
* Survey Details View
* Survey Analytics

### Dynamic Survey Builder

* Create Sections
* Add Questions
* Reorder Questions
* Multiple Question Types

Supported Question Types:

* Text
* Textarea
* Number
* Radio
* Checkbox
* Dropdown

### Survey Responses

* Submit Responses
* View Survey Responses
* Response Tracking
* Response Analytics

### Analytics

* Dashboard Analytics
* Survey Analytics
* Response Trends
* Response Statistics
* Survey Status Distribution
* Platform Statistics

### UI Features

* Responsive Design
* Dark Mode Support
* Reusable Component Architecture
* Modern Dashboard Layout
* Interactive Charts

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite

### Routing

* TanStack Router

### State Management

* React Query (TanStack Query)

### Styling

* Tailwind CSS
* ShadCN UI

### Charts

* Recharts

### Icons

* Lucide React

### HTTP Client

* Axios

---

## Project Structure

```bash
src
│
├── routes
│   ├── dashboard
│   ├── surveys
│   ├── analytics
│   ├── responses
│   └── users
│
├── features
│   ├── analytics
│   │   ├── api
│   │   ├── hooks
│   │   ├── services
│   │   └── types
│   │
│   ├── surveys
│   │   ├── api
│   │   ├── hooks
│   │   ├── services
│   │   └── types
│   │
│   ├── responses
│   └── users
│
├── shared
│   ├── api
│   ├── constants
│   ├── hooks
│   └── utils
│
├── components
│   ├── ui
│   └── common
│
└── assets
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to project:

```bash
cd survey-saas-frontend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

---

## Run Development Server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:8080
```

---

## Build Production

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

## API Integration

The frontend communicates with the backend through Axios.

Example:

```ts
import { api } from "@/shared/api/axios";

export const getSurveys = async () => {
  const response = await api.get("/surveys");

  return response.data;
};
```

---

## React Query Example

```ts
import { useQuery } from "@tanstack/react-query";

export const useSurveys = () => {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: getSurveys,
  });
};
```

---

## Analytics Endpoints

### Dashboard Analytics

```http
GET /analytics/dashboard
```

### Survey Analytics

```http
GET /analytics/survey/:surveyId
```

---

## Dashboard Modules

### Overview Cards

* Total Surveys
* Total Responses
* Total Users
* Published Surveys

### Charts

* Survey Status Distribution
* Platform Distribution
* Response Trend

### Survey Insights

* Most Popular Survey
* Recent Surveys

---

## Code Quality

* ESLint
* TypeScript Strict Mode
* Feature-Based Architecture
* Reusable Components
* Clean API Layer
* Service Layer Pattern
* Custom Hooks Pattern

---

## Future Enhancements

* Export Analytics PDF
* Export Excel Reports
* Survey Templates
* Real-Time Analytics
* WebSocket Notifications
* Advanced Survey Rules Engine
* Team Management
* Multi-Tenant Support

---

## Author

Developed by Yasowant

Frontend Survey SaaS Platform built using modern React architecture and best practices.
