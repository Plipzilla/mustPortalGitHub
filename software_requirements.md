# MUST E-Admission Portal - Software Requirements and Design Specification

**Document Version:** 1.0  
**Date:** January 2025  
**Project:** MUST E-Admission Portal  
**Institution:** Malawi University of Science and Technology (MUST)  
**Document Type:** Software Prototype Requirements & Design Specification  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [Software Architecture](#4-software-architecture)
5. [User Interface Design](#5-user-interface-design)
6. [Database Design](#6-database-design)
7. [Program Design](#7-program-design)
8. [System Integration](#8-system-integration)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Considerations](#10-deployment-considerations)
11. [Future Enhancements](#11-future-enhancements)

---

## 1. Executive Summary

### 1.1 Project Overview

The MUST E-Admission Portal is a comprehensive online university application system designed to replace traditional paper-based admission processes. The platform serves as a digital gateway for prospective students to apply for undergraduate and postgraduate programs at Malawi University of Science and Technology.

### 1.2 System Scope

**Primary Users:**
- **Applicants:** Prospective undergraduate and postgraduate students
- **Administrators:** University staff managing admissions
- **System Administrators:** IT personnel maintaining the platform

**Core Functionality:**
- Multi-step online application forms
- Document upload and management
- Application tracking and status updates
- Administrative review and decision making
- User management and role-based access control

### 1.3 Business Objectives

1. **Digitize Admission Process:** Replace paper-based applications with digital workflow
2. **Improve Efficiency:** Reduce processing time by 80%
3. **Enhance Accessibility:** Enable 24/7 access from any location
4. **Ensure Data Security:** Protect sensitive applicant information
5. **Reduce Costs:** Minimize operational expenses for both university and applicants

---

## 2. Functional Requirements

### 2.1 User Authentication and Account Management

#### 2.1.1 User Registration
- **FR-001:** System shall allow new users to register with email and password
- **FR-002:** System shall support social login (Google, Facebook)
- **FR-003:** System shall send email verification upon registration
- **FR-004:** System shall enforce password complexity requirements (minimum 8 characters)
- **FR-005:** System shall prevent duplicate account creation with same email address

#### 2.1.2 User Authentication
- **FR-006:** System shall authenticate users using email/password combination
- **FR-007:** System shall support OAuth2 authentication for social logins
- **FR-008:** System shall implement session timeout after 30 minutes of inactivity
- **FR-009:** System shall lock accounts after 5 consecutive failed login attempts
- **FR-010:** System shall provide password reset functionality via email

#### 2.1.3 User Profile Management
- **FR-011:** Users shall be able to view and update their profile information
- **FR-012:** System shall maintain user activity logs and last login timestamps
- **FR-013:** Users shall be able to change their passwords
- **FR-014:** System shall support user account deactivation

### 2.2 Application Management

#### 2.2.1 Application Type Selection
- **FR-015:** System shall support two application types: Undergraduate and Postgraduate
- **FR-016:** System shall present different form flows based on selected application type
- **FR-017:** System shall display program-specific requirements for each application type

#### 2.2.2 Multi-Step Application Form

**Step 1: Personal Information**
- **FR-018:** System shall collect personal details (name, DOB, nationality, contact info)
- **FR-019:** System shall support passport photo upload (JPG/PNG, max 5MB)
- **FR-020:** System shall validate age requirements (minimum 16 years)
- **FR-021:** System shall provide country/nationality dropdown selections

**Step 2: Program and Education History**
- **FR-022:** System shall allow selection of up to 4 program choices in order of preference
- **FR-023:** System shall collect education history appropriate to application type
- **FR-024:** For undergraduate: Secondary school information and grades
- **FR-025:** For postgraduate: University education and qualifications
- **FR-026:** System shall support dynamic subject and grade entry

**Step 3: Work Experience and Motivation (Postgraduate Only)**
- **FR-027:** System shall collect work experience with dynamic row addition
- **FR-028:** System shall provide text area for motivation essay (300-500 words)
- **FR-029:** System shall support motivation document upload (PDF/DOCX, max 5MB)
- **FR-030:** System shall validate word count for motivation essays

**Step 4: Special Needs and Support**
- **FR-031:** System shall capture disability/special needs requirements
- **FR-032:** System shall provide conditional fields based on special needs selection
- **FR-033:** System shall collect detailed descriptions for accommodation needs

**Step 5: Referees and Declaration**
- **FR-034:** System shall require minimum 2, maximum 3 referee contacts
- **FR-035:** System shall validate referee email addresses
- **FR-036:** System shall present declaration terms and require agreement
- **FR-037:** System shall include final submission checklist

#### 2.2.3 Draft Management
- **FR-038:** System shall auto-save form data every 30 seconds
- **FR-039:** System shall allow manual saving of application drafts
- **FR-040:** System shall calculate and display completion percentage
- **FR-041:** System shall allow users to continue incomplete applications
- **FR-042:** System shall limit users to maximum 3 draft applications
- **FR-043:** System shall show last saved timestamp

#### 2.2.4 Application Submission
- **FR-044:** System shall validate all required fields before submission
- **FR-045:** System shall generate unique application numbers
- **FR-046:** System shall send confirmation email upon successful submission
- **FR-047:** System shall archive draft applications after submission
- **FR-048:** System shall update application status to "submitted"

#### 2.2.5 Application Tracking
- **FR-049:** Users shall be able to view all their applications and status
- **FR-050:** System shall display application progress and current stage
- **FR-051:** System shall show submission date and deadline information
- **FR-052:** System shall notify users of status changes via email

### 2.3 Administrative Functions

#### 2.3.1 Application Review
- **FR-053:** Administrators shall be able to view all submitted applications
- **FR-054:** System shall provide filtering and search capabilities for applications
- **FR-055:** Administrators shall be able to review application details
- **FR-056:** System shall support application status updates (under review, approved, rejected)
- **FR-057:** Administrators shall be able to add review comments
- **FR-058:** System shall track reviewer information and decision dates

#### 2.3.2 User Management
- **FR-059:** System administrators shall be able to create new user accounts
- **FR-060:** System shall support role assignment (admin, user)
- **FR-061:** Administrators shall be able to view user statistics and activity
- **FR-062:** System shall provide user search and filtering capabilities
- **FR-063:** Administrators shall be able to reset user passwords
- **FR-064:** System shall support bulk user operations

#### 2.3.3 Dashboard and Reporting
- **FR-065:** System shall provide administrative dashboard with key metrics
- **FR-066:** Dashboard shall display application statistics (total, pending, approved, rejected)
- **FR-067:** System shall generate application trend reports
- **FR-068:** Administrators shall be able to export application data
- **FR-069:** System shall provide user analytics and engagement metrics

### 2.4 Document Management

#### 2.4.1 File Upload
- **FR-070:** System shall support file uploads for required documents
- **FR-071:** System shall validate file types (PDF, JPG, PNG, DOCX)
- **FR-072:** System shall enforce file size limits (5MB for photos, 10MB for documents)
- **FR-073:** System shall provide file preview functionality
- **FR-074:** System shall scan uploaded files for viruses

#### 2.4.2 Document Storage
- **FR-075:** System shall store uploaded documents securely
- **FR-076:** System shall maintain document version history
- **FR-077:** System shall provide document download functionality for administrators
- **FR-078:** System shall implement document retention policies

### 2.5 Communication and Notifications

#### 2.5.1 Email Notifications
- **FR-079:** System shall send welcome emails upon registration
- **FR-080:** System shall send application submission confirmations
- **FR-081:** System shall notify users of application status changes
- **FR-082:** System shall send reminder emails for incomplete applications
- **FR-083:** System shall notify administrators of new submissions

#### 2.5.2 System Messages
- **FR-084:** System shall display in-app notifications for important updates
- **FR-085:** System shall provide real-time feedback for form validation
- **FR-086:** System shall show success/error messages for user actions

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

#### 3.1.1 Response Time
- **NFR-001:** System shall respond to user requests within 3 seconds under normal load
- **NFR-002:** Page load times shall not exceed 5 seconds on 3G connections
- **NFR-003:** File uploads shall provide progress indicators and complete within 30 seconds
- **NFR-004:** Auto-save operations shall complete within 2 seconds
- **NFR-005:** Database queries shall execute within 1 second for standard operations

#### 3.1.2 Throughput
- **NFR-006:** System shall support 500 concurrent users during peak admission periods
- **NFR-007:** System shall handle 10,000 application submissions per admission cycle
- **NFR-008:** File upload system shall support 100 concurrent uploads
- **NFR-009:** Email system shall process 1,000 notifications per hour

#### 3.1.3 Resource Utilization
- **NFR-010:** System shall maintain CPU utilization below 80% under normal load
- **NFR-011:** Memory usage shall not exceed 4GB for application server
- **NFR-012:** Database storage shall support growth of 100GB annually
- **NFR-013:** Network bandwidth shall not exceed 100 Mbps during peak usage

### 3.2 Scalability Requirements

#### 3.2.1 Horizontal Scaling
- **NFR-014:** System architecture shall support horizontal scaling of web servers
- **NFR-015:** Database shall support read replicas for improved performance
- **NFR-016:** File storage shall support distributed storage solutions
- **NFR-017:** Load balancing shall distribute traffic across multiple servers

#### 3.2.2 Vertical Scaling
- **NFR-018:** System shall utilize additional CPU cores when available
- **NFR-019:** Application shall efficiently use increased memory allocation
- **NFR-020:** Database shall benefit from additional storage IOPS

### 3.3 Reliability Requirements

#### 3.3.1 Availability
- **NFR-021:** System shall maintain 99.5% uptime during admission periods
- **NFR-022:** Planned maintenance windows shall not exceed 4 hours monthly
- **NFR-023:** System shall automatically recover from transient failures
- **NFR-024:** Critical functions shall remain available during partial system failures

#### 3.3.2 Data Integrity
- **NFR-025:** System shall prevent data loss through automated backups
- **NFR-026:** Data consistency shall be maintained across all system components
- **NFR-027:** Transaction rollbacks shall preserve data integrity
- **NFR-028:** Concurrent operations shall not corrupt shared data

#### 3.3.3 Error Handling
- **NFR-029:** System shall gracefully handle and log all errors
- **NFR-030:** Users shall receive meaningful error messages
- **NFR-031:** System shall provide automatic retry mechanisms for transient failures
- **NFR-032:** Critical errors shall trigger immediate administrator notifications

### 3.4 Security Requirements

#### 3.4.1 Authentication and Authorization
- **NFR-033:** System shall implement OAuth2 authentication standards
- **NFR-034:** Role-based access control shall restrict unauthorized access
- **NFR-035:** Session management shall prevent session hijacking
- **NFR-036:** Multi-factor authentication shall be available for administrators

#### 3.4.2 Data Protection
- **NFR-037:** All data transmission shall use TLS 1.3 encryption
- **NFR-038:** Sensitive data shall be encrypted at rest using AES-256
- **NFR-039:** Personal information shall comply with data protection regulations
- **NFR-040:** System shall implement data anonymization for analytics

#### 3.4.3 Security Monitoring
- **NFR-041:** System shall log all security-relevant events
- **NFR-042:** Intrusion detection shall monitor for suspicious activities
- **NFR-043:** Failed authentication attempts shall be tracked and reported
- **NFR-044:** Security patches shall be applied within 30 days of release

### 3.5 Usability Requirements

#### 3.5.1 User Experience
- **NFR-045:** Interface shall be intuitive for users with basic computer skills
- **NFR-046:** System shall provide contextual help and guidance
- **NFR-047:** Error messages shall be clear and actionable
- **NFR-048:** Forms shall provide real-time validation feedback

#### 3.5.2 Accessibility
- **NFR-049:** Interface shall comply with WCAG 2.1 AA accessibility standards
- **NFR-050:** System shall support screen readers and assistive technologies
- **NFR-051:** Color contrast shall meet accessibility requirements
- **NFR-052:** Keyboard navigation shall be fully supported

#### 3.5.3 Responsive Design
- **NFR-053:** Interface shall adapt to screen sizes from 320px to 1920px
- **NFR-054:** Touch interfaces shall have appropriately sized interactive elements
- **NFR-055:** System shall function on iOS, Android, and desktop browsers
- **NFR-056:** Mobile performance shall match desktop functionality

### 3.6 Compatibility Requirements

#### 3.6.1 Browser Compatibility
- **NFR-057:** System shall support Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **NFR-058:** JavaScript shall be ES2020 compatible
- **NFR-059:** CSS shall use modern features with appropriate fallbacks
- **NFR-060:** System shall degrade gracefully on older browsers

#### 3.6.2 Platform Compatibility
- **NFR-061:** Backend shall run on Linux and Windows Server environments
- **NFR-062:** Database shall be compatible with MySQL 8.0+
- **NFR-063:** File storage shall support local and cloud storage solutions
- **NFR-064:** Email system shall integrate with standard SMTP servers

### 3.7 Maintainability Requirements

#### 3.7.1 Code Quality
- **NFR-065:** Code shall maintain test coverage above 80%
- **NFR-066:** Documentation shall be updated with each release
- **NFR-067:** Code shall follow established style guides and conventions
- **NFR-068:** Static analysis tools shall be used to maintain code quality

#### 3.7.2 Deployment and Operations
- **NFR-069:** System shall support automated deployment processes
- **NFR-070:** Configuration shall be externalized for different environments
- **NFR-071:** Logging shall provide sufficient detail for troubleshooting
- **NFR-072:** Monitoring shall provide real-time system health indicators

---

## 4. Software Architecture

### 4.1 Architectural Overview

#### 4.1.1 Architectural Pattern
The MUST E-Admission Portal follows a **Three-Tier Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   React SPA     │  │   Admin Portal  │  │  Mobile Web  │ │
│  │  (TypeScript)   │  │    (React)      │  │  (Responsive)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                        ┌─────┴─────┐
                        │    API    │
                        │   Layer   │
                        └─────┬─────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC TIER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Controllers  │  │   Services   │  │   Middleware     │  │
│  │  (Laravel)   │  │  (Business   │  │ (Auth, CORS,     │  │
│  │              │  │   Logic)     │  │  Validation)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATA TIER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    MySQL     │  │  File Storage│  │   Redis Cache    │  │
│  │   Database   │  │   (Local/S3) │  │   (Sessions)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Architectural Principles

**1. Separation of Concerns**
- **Presentation Layer:** Handles user interface and user experience
- **Business Logic Layer:** Implements application rules and workflows
- **Data Layer:** Manages data persistence and retrieval

**2. Single Responsibility Principle**
- Each component has a single, well-defined responsibility
- Controllers handle HTTP requests/responses
- Services implement business logic
- Models manage data access

**3. Dependency Injection**
- Loose coupling between components
- Testable and maintainable code structure
- Easy to swap implementations

**4. API-First Design**
- RESTful API serves as the core interface
- Frontend applications consume API endpoints
- Enables future mobile app development

### 4.2 Frontend Architecture

#### 4.2.1 React Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header/          # Navigation and branding
│   ├── Footer/          # Site footer
│   ├── PrivateRoute.tsx # Authentication routing
│   └── PublicRoute.tsx  # Public access routing
├── pages/               # Page-level components
│   ├── Home/           # Landing page
│   ├── Auth/           # Login/signup pages
│   ├── Dashboard/      # User dashboard
│   ├── Application/    # Multi-step application form
│   ├── Admin/          # Administrative interface
│   └── Contact/        # Contact/support page
├── auth/               # Authentication context
├── services/           # API communication
├── styles/             # Global styles and themes
└── utils/              # Utility functions
```

#### 4.2.2 State Management Architecture

**Context API Pattern:**
```typescript
// Application State Hierarchy
AppContext
├── AuthContext          // User authentication state
├── ApplicationContext   // Form data and progress
└── ThemeContext        // UI theme and preferences

// State Flow
User Action → Component → Context → API Service → Backend
                ↓
Component Re-render ← State Update ← API Response
```

#### 4.2.3 Component Design Patterns

**Atomic Design Structure:**
- **Atoms:** Basic UI elements (buttons, inputs, icons)
- **Molecules:** Component combinations (form fields, cards)
- **Organisms:** Complex components (headers, forms, tables)
- **Templates:** Page layouts and structures
- **Pages:** Complete page implementations

### 4.3 Backend Architecture

#### 4.3.1 Laravel Application Structure

```
app/
├── Http/
│   ├── Controllers/     # Request handling
│   ├── Middleware/      # Request/response processing
│   └── Requests/        # Input validation
├── Models/              # Data models and relationships
├── Services/            # Business logic implementation
├── Repositories/        # Data access abstraction
├── Jobs/                # Background job processing
├── Mail/                # Email templates and logic
├── Notifications/       # User notifications
└── Providers/           # Service providers and bindings
```

#### 4.3.2 Service Layer Pattern

```php
// Service Layer Architecture
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │───▶│    Services     │───▶│  Repositories   │
│                 │    │                 │    │                 │
│ HTTP Request    │    │ Business Logic  │    │ Data Access     │
│ Response        │    │ Validation      │    │ Persistence     │
│ Routing         │    │ Transformation  │    │ Querying        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 4.3.3 API Design Patterns

**RESTful Resource Structure:**
```
GET    /api/applications              # List applications
POST   /api/applications              # Create application
GET    /api/applications/{id}         # Get specific application
PUT    /api/applications/{id}         # Update application
DELETE /api/applications/{id}         # Delete application

GET    /api/applications/{id}/drafts  # Get application drafts
POST   /api/applications/drafts       # Save draft
```

### 4.4 Data Flow Architecture

#### 4.4.1 Request Processing Flow

```
1. User Action (Frontend)
   ↓
2. HTTP Request (Axios)
   ↓
3. Laravel Router
   ↓
4. Middleware Stack
   ├── CORS
   ├── Authentication
   ├── Rate Limiting
   └── Input Sanitization
   ↓
5. Controller Method
   ↓
6. Service Layer
   ├── Business Logic
   ├── Validation
   └── Data Transformation
   ↓
7. Repository/Model
   ↓
8. Database Query
   ↓
9. Response Formation
   ↓
10. JSON Response (Frontend)
```

#### 4.4.2 Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Login     │───▶│   Laravel   │───▶│   Database  │
│  (Frontend) │    │   Passport  │    │   (Users)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │
       │            ┌─────────────┐
       │            │ JWT Token   │
       │            │ Generation  │
       │            └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌─────────────┐
│ Token Store │    │ Subsequent  │
│ (LocalStore)│    │ API Calls   │
└─────────────┘    └─────────────┘
```

### 4.5 Security Architecture

#### 4.5.1 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                    │
├─────────────────────────────────────────────────────────┤
│ 1. Network Security (HTTPS, CORS, Rate Limiting)       │
├─────────────────────────────────────────────────────────┤
│ 2. Authentication (OAuth2, JWT, Session Management)    │
├─────────────────────────────────────────────────────────┤
│ 3. Authorization (RBAC, Permissions, Route Guards)     │
├─────────────────────────────────────────────────────────┤
│ 4. Input Validation (CSRF, XSS, SQL Injection)         │
├─────────────────────────────────────────────────────────┤
│ 5. Data Protection (Encryption, Hashing, Sanitization) │
└─────────────────────────────────────────────────────────┘
```

#### 4.5.2 Authentication & Authorization Architecture

```
User Request
     ↓
┌─────────────┐
│   Route     │
│  Middleware │ ←── auth:api
└─────────────┘
     ↓
┌─────────────┐
│  Passport   │ ←── Token Validation
│ Middleware  │
└─────────────┘
     ↓
┌─────────────┐
│ Permission  │ ←── Role Check
│ Middleware  │
└─────────────┘
     ↓
┌─────────────┐
│ Controller  │
│   Method    │
└─────────────┘
```

---

## 5. User Interface Design

### 5.1 Design System and Visual Language

#### 5.1.1 Design Principles

**1. Clarity and Simplicity**
- Clean, uncluttered interfaces
- Logical information hierarchy
- Consistent visual patterns
- Minimal cognitive load

**2. Accessibility First**
- WCAG 2.1 AA compliance
- High contrast color schemes
- Screen reader compatibility
- Keyboard navigation support

**3. Responsive Design**
- Mobile-first approach
- Fluid layouts and flexible grids
- Touch-friendly interactive elements
- Cross-device consistency

**4. Progressive Disclosure**
- Step-by-step information revelation
- Contextual help and guidance
- Optional advanced features
- Clear progress indicators

#### 5.1.2 Color Palette and Typography

**Primary Color Palette:**
```css
:root {
  /* Primary Colors */
  --primary: #003366;           /* MUST Blue - Trust, Professionalism */
  --primary-light: #0066cc;     /* Lighter blue for hover states */
  --primary-dark: #002244;      /* Darker blue for emphasis */
  
  /* Secondary Colors */
  --secondary: #4CAF50;         /* Success Green - Growth, Achievement */
  --secondary-light: #81C784;   /* Light green for success states */
  --secondary-dark: #388E3C;    /* Dark green for emphasis */
  
  /* Neutral Colors */
  --gray-50: #F9FAFB;          /* Light backgrounds */
  --gray-100: #F3F4F6;         /* Card backgrounds */
  --gray-300: #D1D5DB;         /* Borders */
  --gray-600: #4B5563;         /* Secondary text */
  --gray-900: #111827;         /* Primary text */
  
  /* Semantic Colors */
  --success: #10B981;           /* Success messages */
  --warning: #F59E0B;           /* Warning messages */
  --error: #EF4444;             /* Error messages */
  --info: #3B82F6;              /* Information messages */
}
```

**Typography System:**
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes (Type Scale) */
--text-xs: 0.75rem;      /* 12px - Small labels */
--text-sm: 0.875rem;     /* 14px - Body text small */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body text */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - Section headings */
--text-3xl: 1.875rem;    /* 30px - Page headings */
--text-4xl: 2.25rem;     /* 36px - Hero headings */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### 5.1.3 Spacing and Layout System

**Spacing Scale (8px Base Unit):**
```css
:root {
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
}
```

**Layout Grid System:**
```css
/* Container Widths */
--container-sm: 640px;      /* Small screens */
--container-md: 768px;      /* Medium screens */
--container-lg: 1024px;     /* Large screens */
--container-xl: 1280px;     /* Extra large screens */
--container-2xl: 1536px;    /* 2X large screens */

/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### 5.2 Component Design Specifications

#### 5.2.1 Form Components

**Input Fields:**
```css
.form-input {
  /* Base Styles */
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  transition: all 0.2s ease;
  
  /* Focus State */
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1);
  }
  
  /* Error State */
  &.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  /* Success State */
  &.success {
    border-color: var(--success);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
}
```

**Button Components:**
```css
.btn {
  /* Base Button */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: var(--font-semibold);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  
  /* Primary Button */
  &.btn-primary {
    background: var(--primary);
    color: white;
    
    &:hover {
      background: var(--primary-light);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
    }
  }
  
  /* Secondary Button */
  &.btn-secondary {
    background: var(--gray-100);
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
    
    &:hover {
      background: var(--gray-200);
    }
  }
}
```

#### 5.2.2 Navigation Components

**Header Navigation:**
```typescript
interface HeaderProps {
  user?: User;
  isAdmin?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isAdmin, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-brand">
          <img src="/logo.png" alt="MUST" className="logo" />
          <h1 className="brand-text">E-Admission Portal</h1>
        </div>
        
        <nav className="header-nav">
          {user ? (
            <UserMenu user={user} onLogout={onLogout} />
          ) : (
            <AuthLinks />
          )}
        </nav>
      </div>
    </header>
  );
};
```

**Progress Indicator:**
```typescript
interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  completedSteps?: number[];
}

const ProgressIndicator: React.FC<ProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  completedSteps = []
}) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="step-indicators">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={cn('step-indicator', {
              'active': index === currentStep - 1,
              'completed': completedSteps.includes(index + 1),
              'pending': index > currentStep - 1
            })}
          >
            <div className="step-number">
              {completedSteps.includes(index + 1) ? '✓' : index + 1}
            </div>
            <div className="step-title">{title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5.3 Page Layout Specifications

#### 5.3.1 Application Form Layout

**Multi-Step Form Structure:**
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER                               │
│  Logo + Navigation + User Menu                          │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                PROGRESS INDICATOR                       │
│  Step 1 ● ─── Step 2 ○ ─── Step 3 ○ ─── Step 4 ○     │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                   FORM CONTENT                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │              Current Step Form                  │   │
│  │                                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Field 1   │  │   Field 2   │              │   │
│  │  └─────────────┘  └─────────────┘              │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │           Field 3                       │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                 FORM NAVIGATION                         │
│  [Save Draft]           [Previous] [Next/Submit]       │
└─────────────────────────────────────────────────────────┘
```

#### 5.3.2 Dashboard Layout

**User Dashboard Structure:**
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER                               │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                WELCOME SECTION                          │
│  Welcome, [User Name]                                   │
│  Track and manage your applications here                │
│                                              [New App]  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              QUICK ACCESS CARDS                         │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │   Continue    │  │   Continue    │  │    Start    │ │
│  │ Undergraduate │  │ Postgraduate  │  │     New     │ │
│  │     Draft     │  │     Draft     │  │ Application │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              APPLICATION HISTORY                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  App #  │  Type  │  Program  │  Status  │  Date │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ UG2025001│  UG   │ Comp Sci  │Submitted │ Jan15 │   │
│  │ PG2025002│  PG   │ MBA       │ Draft    │ Jan10 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Responsive Design Specifications

#### 5.4.1 Breakpoint Strategy

**Mobile First Approach:**
```css
/* Base styles - Mobile (320px+) */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .form-grid {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### 5.4.2 Touch Interaction Design

**Touch Target Specifications:**
```css
/* Minimum touch target size: 44px x 44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 8px;
}

/* Button sizing for touch */
.btn-mobile {
  padding: 12px 24px;
  font-size: 16px; /* Prevent zoom on iOS */
}

/* Form inputs for touch */
.form-input-mobile {
  padding: 12px 16px;
  font-size: 16px;
}
```

### 5.5 Interaction Design Patterns

#### 5.5.1 Form Interaction Patterns

**Real-time Validation:**
```typescript
const useFieldValidation = (value: string, rules: ValidationRule[]) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  
  useEffect(() => {
    const validateField = async () => {
      for (const rule of rules) {
        const result = await rule.validate(value);
        if (!result.isValid) {
          setError(result.message);
          setIsValid(false);
          return;
        }
      }
      setError(null);
      setIsValid(true);
    };
    
    if (value) {
      const debounceTimer = setTimeout(validateField, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [value, rules]);
  
  return { error, isValid };
};
```

**Progressive Enhancement:**
```typescript
// Auto-save functionality
const useAutoSave = (data: any, saveFunction: (data: any) => Promise<void>) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (data && Object.keys(data).length > 0) {
        setIsSaving(true);
        try {
          await saveFunction(data);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 30000); // 30 seconds
    
    return () => clearTimeout(autoSaveTimer);
  }, [data, saveFunction]);
  
  return { lastSaved, isSaving };
};
```

---

## 6. Database Design

### 6.1 Database Architecture Overview

#### 6.1.1 Database Engine Selection

**MySQL 8.0+ Selection Rationale:**
- **ACID Compliance:** Ensures data integrity and consistency
- **JSON Support:** Native JSON column type for flexible application data
- **Performance:** Optimized query execution and indexing
- **Scalability:** Support for read replicas and horizontal scaling
- **Community:** Large community and extensive documentation
- **Cost:** Open-source with enterprise features

#### 6.1.2 Database Design Principles

**1. Normalization Strategy (3NF)**
- Eliminate data redundancy
- Ensure data integrity
- Reduce storage requirements
- Simplify data maintenance

**2. Strategic Denormalization**
- Performance optimization for frequently accessed data
- Reduce complex joins in reporting queries
- Cache calculated values (completion percentages)

**3. Data Integrity**
- Foreign key constraints
- Check constraints for data validation
- Unique constraints for business rules
- NOT NULL constraints for required fields

### 6.2 Conceptual Data Model

#### 6.2.1 Entity Relationship Overview

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│    Users    │──────▶│ ApplicationDrafts │──────▶│ WorkExperiences │
│             │       │                  │       │                 │
│ - id        │       │ - id             │       │ - id            │
│ - name      │       │ - user_id        │       │ - draft_id      │
│ - email     │       │ - type           │       │ - organization  │
│ - password  │       │ - data (JSON)    │       │ - position      │
└─────────────┘       │ - completion_%   │       │ - from_date     │
        │              └──────────────────┘       │ - to_date       │
        │                       │                 └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐       ┌─────────────────┐
│ApplicationSubmissions│ │     Referees     │──────▶│ SubmissionRefs  │
│                 │    │                  │       │                 │
│ - id            │    │ - id             │       │ - submission_id │
│ - user_id       │    │ - name           │       │ - referee_id    │
│ - app_number    │    │ - email          │       └─────────────────┘
│ - status        │    │ - institution    │
│ - data (JSON)   │    └──────────────────┘
│ - decision_date │
└─────────────────┘
```

#### 6.2.2 Core Entities Description

**Users Entity:**
- Central user account management
- Authentication and authorization
- Profile information
- Session management

**ApplicationDrafts Entity:**
- Work-in-progress applications
- JSON storage for flexible form data
- Progress tracking and auto-save
- Multiple drafts per user

**ApplicationSubmissions Entity:**
- Final submitted applications
- Immutable application data
- Status tracking and workflow
- Administrative review information

**Supporting Entities:**
- WorkExperiences: Professional background
- Referees: Reference contacts
- Roles/Permissions: Access control

### 6.3 Logical Data Model

#### 6.3.1 Detailed Table Specifications

**Users Table:**
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    -- Identity
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    
    -- Authentication
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    
    -- Social Auth
    provider VARCHAR(50) NULL,
    provider_id VARCHAR(255) NULL,
    avatar VARCHAR(255) NULL,
    
    -- Session Management
    last_activity_at TIMESTAMP NULL,
    session_timeout INT DEFAULT 1800,
    
    -- Account Status
    is_active BOOLEAN DEFAULT TRUE,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_provider (provider, provider_id),
    INDEX idx_last_activity (last_activity_at),
    INDEX idx_active (is_active, created_at)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Application Drafts Table:**
```sql
CREATE TABLE application_drafts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    -- User Relationship
    user_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Application Type
    application_type ENUM('undergraduate', 'postgraduate') NOT NULL,
    
    -- Quick Access Fields (Denormalized)
    first_name VARCHAR(255) NULL,
    surname VARCHAR(255) NULL,
    email_address VARCHAR(255) NULL,
    program_title VARCHAR(255) NULL,
    faculty VARCHAR(255) NULL,
    
    -- Progress Tracking
    current_step INT DEFAULT 1,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_complete BOOLEAN DEFAULT FALSE,
    
    -- Data Storage
    data JSON NOT NULL,
    
    -- Timestamps
    last_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_step_range CHECK (current_step BETWEEN 0 AND 5),
    CONSTRAINT chk_completion_range CHECK (completion_percentage BETWEEN 0 AND 100),
    CONSTRAINT unique_user_type UNIQUE (user_id, application_type),
    
    -- Indexes
    INDEX idx_user_type (user_id, application_type),
    INDEX idx_completion (completion_percentage),
    INDEX idx_last_saved (last_saved),
    INDEX idx_program ((CAST(data->'$.step2.programInfo.firstChoice' AS CHAR(255))))
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Application Submissions Table:**
```sql
CREATE TABLE application_submissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    -- Unique Identifier
    application_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- User Relationship
    user_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Application Details
    application_type ENUM('undergraduate', 'postgraduate') NOT NULL,
    
    -- Applicant Information (Denormalized for Reporting)
    first_name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NULL,
    
    -- Program Information
    program_title VARCHAR(255) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    program_code VARCHAR(20) NULL,
    entry_requirements_met BOOLEAN DEFAULT FALSE,
    
    -- Application Data
    data JSON NOT NULL,
    
    -- Status Tracking
    status ENUM('submitted', 'under_review', 'additional_info_required', 
                'approved', 'rejected', 'waitlisted') DEFAULT 'submitted',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    -- Review Information
    reviewed_by BIGINT UNSIGNED NULL,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP NULL,
    admin_comments TEXT NULL,
    
    -- Decision Information
    decision_reason TEXT NULL,
    conditional_offer_terms TEXT NULL,
    
    -- Important Dates
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline_date DATE NULL,
    decision_date TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_submissions (user_id, submission_date DESC),
    INDEX idx_status_review (status, reviewed_at),
    INDEX idx_program_faculty (program_title, faculty),
    INDEX idx_application_number (application_number),
    INDEX idx_submission_date (submission_date),
    INDEX idx_reviewer (reviewed_by, reviewed_at),
    
    -- Full-text Search
    FULLTEXT INDEX ft_search (first_name, surname, email_address, program_title)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 6.3.2 Supporting Tables

**Work Experiences Table:**
```sql
CREATE TABLE work_experiences (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    -- Draft Relationship
    draft_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (draft_id) REFERENCES application_drafts(id) ON DELETE CASCADE,
    
    -- Experience Details
    organization VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    nature_of_work TEXT NULL,
    from_date DATE NOT NULL,
    to_date DATE NULL,
    is_current BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_draft (draft_id),
    INDEX idx_dates (from_date, to_date)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Referees Table:**
```sql
CREATE TABLE referees (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    -- Draft Relationship
    draft_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (draft_id) REFERENCES application_drafts(id) ON DELETE CASCADE,
    
    -- Referee Information
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_draft (draft_id),
    INDEX idx_email (email)
) ENGINE=InnoDB CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6.4 Physical Data Model

#### 6.4.1 JSON Data Structure Specifications

**Application Draft JSON Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "step1": {
      "type": "object",
      "properties": {
        "applicationType": {"type": "string", "enum": ["undergraduate", "postgraduate"]},
        "title": {"type": "string", "enum": ["Mr", "Mrs", "Miss", "Ms", "Rev", "Dr", "Prof", "Other"]},
        "firstName": {"type": "string", "maxLength": 255},
        "surname": {"type": "string", "maxLength": 255},
        "dateOfBirth": {"type": "string", "format": "date"},
        "nationality": {"type": "string", "maxLength": 100},
        "countryOfResidence": {"type": "string", "maxLength": 100},
        "gender": {"type": "string", "enum": ["male", "female", "other"]},
        "maritalStatus": {"type": "string", "enum": ["single", "married", "divorced", "widowed"]},
        "emailAddress": {"type": "string", "format": "email"},
        "phoneNumber": {"type": "string", "maxLength": 20},
        "correspondenceAddress": {"type": "string"},
        "permanentAddress": {"type": "string"},
        "passportPhotoPath": {"type": "string"}
      },
      "required": ["firstName", "surname", "dateOfBirth", "nationality", "emailAddress"]
    },
    "step2": {
      "type": "object",
      "properties": {
        "programInfo": {
          "type": "object",
          "properties": {
            "levelOfStudy": {"type": "string", "enum": ["undergraduate", "postgraduate"]},
            "firstChoice": {"type": "string", "maxLength": 255},
            "secondChoice": {"type": "string", "maxLength": 255},
            "thirdChoice": {"type": "string", "maxLength": 255},
            "fourthChoice": {"type": "string", "maxLength": 255},
            "methodOfStudy": {"type": "string", "enum": ["full-time", "part-time", "distance"]}
          },
          "required": ["levelOfStudy", "firstChoice"]
        },
        "educationHistory": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "level": {"type": "string", "enum": ["secondary", "tertiary"]},
              "institution": {"type": "string", "maxLength": 255},
              "fromDate": {"type": "string", "format": "date"},
              "toDate": {"type": "string", "format": "date"},
              "qualification": {"type": "string", "maxLength": 255},
              "grades": {"type": "object"},
              "gpa": {"type": "number", "minimum": 0, "maximum": 5}
            }
          }
        }
      }
    },
    "step3": {
      "type": "object",
      "properties": {
        "workExperience": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "organization": {"type": "string", "maxLength": 255},
              "position": {"type": "string", "maxLength": 255},
              "fromDate": {"type": "string", "format": "date"},
              "toDate": {"type": "string", "format": "date"},
              "isCurrent": {"type": "boolean"},
              "natureOfWork": {"type": "string"}
            }
          }
        },
        "motivation": {
          "type": "object",
          "properties": {
            "essay": {"type": "string", "minLength": 300, "maxLength": 500},
            "fileUpload": {"type": "string"}
          }
        }
      }
    },
    "step4": {
      "type": "object",
      "properties": {
        "specialNeeds": {
          "type": "object",
          "properties": {
            "hasDisability": {"type": "boolean"},
            "disabilityDescription": {"type": "string"},
            "accommodationNeeds": {"type": "string"}
          }
        }
      }
    },
    "step5": {
      "type": "object",
      "properties": {
        "referees": {
          "type": "array",
          "minItems": 2,
          "maxItems": 3,
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string", "maxLength": 255},
              "position": {"type": "string", "maxLength": 255},
              "institution": {"type": "string", "maxLength": 255},
              "email": {"type": "string", "format": "email"},
              "phone": {"type": "string", "maxLength": 20},
              "address": {"type": "string"}
            },
            "required": ["name", "position", "institution", "email"]
          }
        },
        "declaration": {
          "type": "object",
          "properties": {
            "agreed": {"type": "boolean"},
            "fullName": {"type": "string"},
            "date": {"type": "string", "format": "date"},
            "signature": {"type": "string"}
          },
          "required": ["agreed", "fullName", "date"]
        }
      }
    }
  }
}
```

#### 6.4.2 Database Optimization Strategies

**Indexing Strategy:**
```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_user_app_type_status ON application_submissions 
    (user_id, application_type, status, submission_date DESC);

CREATE INDEX idx_status_priority_date ON application_submissions 
    (status, priority, submission_date);

CREATE INDEX idx_program_faculty_status ON application_submissions 
    (program_title, faculty, status);

-- JSON path indexes for frequently accessed data
CREATE INDEX idx_json_first_choice ON application_drafts 
    ((CAST(data->'$.step2.programInfo.firstChoice' AS CHAR(255))));

CREATE INDEX idx_json_completion ON application_drafts 
    ((CAST(data->'$.completionPercentage' AS DECIMAL(5,2))));

-- Covering indexes for reporting queries
CREATE INDEX idx_submission_report ON application_submissions 
    (submission_date, status, application_type, program_title, faculty)
    INCLUDE (first_name, surname, email_address);
```

**Partitioning Strategy:**
```sql
-- Partition submissions by year for better performance
ALTER TABLE application_submissions 
PARTITION BY RANGE (YEAR(submission_date)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### 6.5 Data Integrity and Constraints

#### 6.5.1 Business Rules Implementation

**Constraint Definitions:**
```sql
-- User business rules
ALTER TABLE users 
ADD CONSTRAINT chk_email_format 
CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

-- Application draft business rules
ALTER TABLE application_drafts
ADD CONSTRAINT chk_step_progression 
CHECK (current_step >= 0 AND current_step <= 5);

ALTER TABLE application_drafts
ADD CONSTRAINT chk_completion_logic 
CHECK ((completion_percentage = 100 AND is_complete = TRUE) OR 
       (completion_percentage < 100 AND is_complete = FALSE));

-- Application submission business rules
ALTER TABLE application_submissions
ADD CONSTRAINT chk_status_progression 
CHECK (status IN ('submitted', 'under_review', 'additional_info_required', 
                  'approved', 'rejected', 'waitlisted'));

ALTER TABLE application_submissions
ADD CONSTRAINT chk_review_logic 
CHECK ((status = 'submitted' AND reviewed_by IS NULL) OR 
       (status != 'submitted' AND reviewed_by IS NOT NULL));
```

#### 6.5.2 Triggers for Data Consistency

**Auto-Update Triggers:**
```sql
-- Update completion percentage on data changes
DELIMITER $$
CREATE TRIGGER update_completion_percentage
    BEFORE UPDATE ON application_drafts
    FOR EACH ROW
BEGIN
    DECLARE completion DECIMAL(5,2) DEFAULT 0.00;
    DECLARE total_steps INT DEFAULT 5;
    
    -- Calculate completion based on JSON data structure
    IF JSON_EXTRACT(NEW.data, '$.step1') IS NOT NULL AND 
       JSON_VALID(JSON_EXTRACT(NEW.data, '$.step1')) THEN
        SET completion = completion + (100.0 / total_steps);
    END IF;
    
    IF JSON_EXTRACT(NEW.data, '$.step2') IS NOT NULL AND 
       JSON_VALID(JSON_EXTRACT(NEW.data, '$.step2')) THEN
        SET completion = completion + (100.0 / total_steps);
    END IF;
    
    IF JSON_EXTRACT(NEW.data, '$.step3') IS NOT NULL AND 
       JSON_VALID(JSON_EXTRACT(NEW.data, '$.step3')) THEN
        SET completion = completion + (100.0 / total_steps);
    END IF;
    
    IF JSON_EXTRACT(NEW.data, '$.step4') IS NOT NULL AND 
       JSON_VALID(JSON_EXTRACT(NEW.data, '$.step4')) THEN
        SET completion = completion + (100.0 / total_steps);
    END IF;
    
    IF JSON_EXTRACT(NEW.data, '$.step5') IS NOT NULL AND 
       JSON_VALID(JSON_EXTRACT(NEW.data, '$.step5')) THEN
        SET completion = completion + (100.0 / total_steps);
    END IF;
    
    SET NEW.completion_percentage = completion;
    SET NEW.is_complete = (completion >= 100.0);
END$$
DELIMITER ;

-- Generate application numbers
DELIMITER $$
CREATE TRIGGER generate_application_number
    BEFORE INSERT ON application_submissions
    FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    DECLARE app_prefix VARCHAR(10);
    DECLARE year_suffix VARCHAR(4);
    
    SET year_suffix = YEAR(NOW());
    
    IF NEW.application_type = 'undergraduate' THEN
        SET app_prefix = CONCAT('UG', year_suffix);
    ELSE
        SET app_prefix = CONCAT('PG', year_suffix);
    END IF;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number, -6) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM application_submissions
    WHERE application_number LIKE CONCAT(app_prefix, '%');
    
    SET NEW.application_number = CONCAT(app_prefix, LPAD(next_number, 6, '0'));
END$$
DELIMITER ;
```

### 6.6 Database Security and Backup

#### 6.6.1 Security Measures

**User Privileges:**
```sql
-- Application user (limited privileges)
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON must_portal.* TO 'app_user'@'localhost';
GRANT EXECUTE ON must_portal.* TO 'app_user'@'localhost';

-- Read-only user for reporting
CREATE USER 'report_user'@'localhost' IDENTIFIED BY 'report_password';
GRANT SELECT ON must_portal.application_submissions TO 'report_user'@'localhost';
GRANT SELECT ON must_portal.users TO 'report_user'@'localhost';

-- Backup user
CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'backup_password';
GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON must_portal.* TO 'backup_user'@'localhost';
```

**Data Encryption:**
```sql
-- Enable transparent data encryption
ALTER TABLE application_submissions ENCRYPTION='Y';
ALTER TABLE application_drafts ENCRYPTION='Y';
ALTER TABLE users ENCRYPTION='Y';

-- Encrypt sensitive JSON fields
ALTER TABLE application_submissions 
ADD COLUMN encrypted_data VARBINARY(16000) 
GENERATED ALWAYS AS (AES_ENCRYPT(data, UNHEX(SHA2('encryption_key', 256)))) STORED;
```

#### 6.6.2 Backup and Recovery Strategy

**Backup Schedule:**
```bash
#!/bin/bash
# Daily incremental backup
mysqldump --single-transaction --routines --triggers \
          --user=backup_user --password=backup_password \
          --where="created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)" \
          must_portal > /backups/daily/must_portal_$(date +%Y%m%d).sql

# Weekly full backup
mysqldump --single-transaction --routines --triggers \
          --user=backup_user --password=backup_password \
          must_portal > /backups/weekly/must_portal_full_$(date +%Y%m%d).sql

# Monthly archive
tar -czf /backups/monthly/must_portal_$(date +%Y%m).tar.gz /backups/weekly/
```

**Recovery Procedures:**
```sql
-- Point-in-time recovery
mysql must_portal < /backups/weekly/must_portal_full_20250115.sql
mysqlbinlog --start-datetime="2025-01-15 12:00:00" \
            --stop-datetime="2025-01-16 11:59:59" \
            /var/log/mysql/mysql-bin.000001 | mysql must_portal
```

---

## 7. Program Design

### 7.1 Overall Program Architecture

#### 7.1.1 Architectural Patterns

**Model-View-Controller (MVC) Pattern:**
```
┌─────────────────────────────────────────────────────────┐
│                        VIEW LAYER                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │   React SPA     │  │   Admin Panel   │  │  Mobile │ │
│  │  Components     │  │   Interface     │  │   Web   │ │
│  └─────────────────┘  └─────────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                        HTTP Requests
                              │
┌─────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │ ApplicationCtrl │  │    AuthCtrl     │  │AdminCtrl│ │
│  │ - saveDraft()   │  │ - login()       │  │ - users()│ │
│  │ - submit()      │  │ - register()    │  │ - stats()│ │
│  │ - loadDraft()   │  │ - refresh()     │  └─────────┘ │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
                              │
                      Service Layer Calls
                              │
┌─────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │ApplicationSvc   │  │   AuthService   │  │UserSvc  │ │
│  │ - validate()    │  │ - authenticate()│  │ - crud()│ │
│  │ - transform()   │  │ - authorize()   │  │ - roles()│ │
│  │ - notify()      │  │ - tokens()      │  └─────────┘ │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
                              │
                        Data Access
                              │
┌─────────────────────────────────────────────────────────┐
│                      MODEL LAYER                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │ApplicationDraft │  │      User       │  │  Role   │ │
│  │ApplicationSub   │  │ - attributes    │  │Permission│ │
│  │WorkExperience   │  │ - relationships │  └─────────┘ │
│  │Referee          │  │ - validation    │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

**Repository Pattern Implementation:**
```php
interface ApplicationRepositoryInterface
{
    public function findByUser(int $userId): Collection;
    public function findDraftByType(int $userId, string $type): ?ApplicationDraft;
    public function saveDraft(array $data): ApplicationDraft;
    public function submitApplication(ApplicationDraft $draft): ApplicationSubmission;
    public function updateStatus(int $submissionId, string $status): bool;
}

class ApplicationRepository implements ApplicationRepositoryInterface
{
    public function __construct(
        private ApplicationDraft $draftModel,
        private ApplicationSubmission $submissionModel
    ) {}
    
    public function findByUser(int $userId): Collection
    {
        return $this->submissionModel
            ->where('user_id', $userId)
            ->with(['reviewer'])
            ->orderBy('submission_date', 'desc')
            ->get();
    }
    
    public function findDraftByType(int $userId, string $type): ?ApplicationDraft
    {
        return $this->draftModel
            ->where('user_id', $userId)
            ->where('application_type', $type)
            ->first();
    }
}
```

#### 7.1.2 Service-Oriented Architecture (SOA)

**Service Layer Design:**
```php
// Application Service - Core Business Logic
class ApplicationService
{
    public function __construct(
        private ApplicationRepositoryInterface $repository,
        private ValidationService $validator,
        private NotificationService $notifier,
        private FileService $fileService
    ) {}
    
    public function saveDraft(array $data): ApplicationDraft
    {
        // 1. Validate input data
        $validatedData = $this->validator->validateDraft($data);
        
        // 2. Process file uploads
        $processedData = $this->fileService->processUploads($validatedData);
        
        // 3. Save to repository
        $draft = $this->repository->saveDraft($processedData);
        
        // 4. Calculate completion
        $draft->completion_percentage = $this->calculateCompletion($draft);
        $draft->save();
        
        return $draft;
    }
    
    public function submitApplication(int $draftId): ApplicationSubmission
    {
        DB::beginTransaction();
        
        try {
            // 1. Load and validate draft
            $draft = $this->repository->findById($draftId);
            $this->validator->validateForSubmission($draft);
            
            // 2. Convert to submission
            $submission = $this->repository->submitApplication($draft);
            
            // 3. Send notifications
            $this->notifier->notifySubmission($submission);
            
            // 4. Archive draft
            $draft->delete();
            
            DB::commit();
            return $submission;
            
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
```

### 7.2 Frontend Program Design

#### 7.2.1 React Component Architecture

**Component Hierarchy:**
```typescript
// Application Component Tree
App
├── Router
│   ├── PublicRoutes
│   │   ├── Home
│   │   ├── Login
│   │   ├── Signup
│   │   └── Programs
│   └── PrivateRoutes
│       ├── Dashboard
│       ├── Application
│       │   ├── ApplicationTypeSelection
│       │   ├── Step1PersonalInfo
│       │   ├── Step2Education
│       │   ├── Step3WorkMotivation
│       │   ├── Step4SpecialNeeds
│       │   └── Step5RefereesDeclaration
│       └── Admin
│           ├── AdminDashboard
│           ├── UserManagement
│           └── ApplicationReview

// Context Providers
└── Providers
    ├── AuthProvider
    ├── ApplicationProvider
    └── ThemeProvider
```

**State Management Pattern:**
```typescript
// Context + Reducer Pattern
interface ApplicationState {
    formData: ApplicationFormData;
    currentStep: number;
    isLoading: boolean;
    isSaving: boolean;
    errors: Record<string, string>;
    completionPercentage: number;
    lastSaved: string | null;
}

type ApplicationAction = 
    | { type: 'UPDATE_FORM_DATA'; section: string; data: any }
    | { type: 'SET_CURRENT_STEP'; step: number }
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_ERRORS'; errors: Record<string, string> }
```