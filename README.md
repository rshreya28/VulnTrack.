# 🛡️ VulnTrack
### Role-Based Vulnerability Management and Remediation Tracking System

VulnTrack is a full-stack web application designed to simplify the process of reporting, assigning, tracking, and resolving cybersecurity vulnerabilities. It provides a centralized platform where security analysts, administrators, and developers collaborate to manage security issues efficiently.

## 🌐 Live Deployment

**Live Website:** https://vuln-track-eta.vercel.app

**Backend API:** https://vulntrack-mwm6.onrender.com

> Note: The backend runs on Render's free plan and may take some time to start after inactivity.

## 🎯 Project Objectives

- Simplify vulnerability reporting and management.
- Provide secure role-based access for different users.
- Assign reported vulnerabilities to developers.
- Track vulnerability remediation progress.
- Enable analysts to verify completed fixes.
- Maintain centralized vulnerability and remediation records.

## 👥 User Roles

### 1. Admin
- View and manage users.
- Monitor reported vulnerabilities.
- Assign vulnerabilities to developers.
- Track remediation progress.
- Access the administrative dashboard.

### 2. Analyst
- Identify and report security vulnerabilities.
- Provide vulnerability details and severity levels.
- Monitor reported vulnerabilities.
- Review developer remediation updates.
- Verify fixes and reopen unresolved vulnerabilities.

### 3. Developer
- View assigned vulnerabilities.
- Analyze reported security issues.
- Implement necessary fixes.
- Update remediation details.
- Submit fixes for analyst verification.

## ✨ Key Features

- Secure user authentication using JWT.
- Role-based access control (RBAC).
- Separate Admin, Analyst, and Developer dashboards.
- Vulnerability reporting and severity classification.
- Developer assignment and issue tracking.
- Remediation updates and verification.
- Vulnerability status tracking.
- Centralized MySQL database.

## 🔄 Project Workflow

1. **Analyst** identifies and reports a vulnerability.
2. **Admin** reviews the vulnerability and assigns it to a Developer.
3. **Developer** investigates the issue and submits a fix.
4. **Analyst** verifies the remediation.
5. If the issue is resolved, it is closed.
6. If the issue remains unresolved, it is reopened for further remediation.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Authentication | Spring Security, JWT |
| API Communication | REST APIs |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Cloud Database | Aiven MySQL |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
VulnTrack/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Running the Project Locally

### Backend

1. Install Java, Maven, and MySQL.
2. Configure the database connection and required environment variables.
3. Open the `backend` directory.
4. Run the Spring Boot application using Maven.

```bash
cd backend
mvn spring-boot:run
```

### Frontend

1. Install Node.js.
2. Open the `frontend` directory.
3. Install dependencies.
4. Start the development server.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

## 🔐 Demo Login Credentials

Use the following demo accounts to explore the different role-based dashboards.

### Admin
- **Email: admin@vulntrack.com
- **Password:admin123

### Analyst
- **Email:analyst@vultrack.com
- **Password:analyst123

### Developer
- **Email:developer@vulntrack.com
- **Password:developer123

**Security Note:** These placeholders should be replaced only with credentials for dedicated, restricted demo accounts. Do not publish personal passwords, database credentials, or privileged production Admin credentials in a public repository.

## 📌 Conclusion

VulnTrack provides an organized approach to cybersecurity vulnerability management by connecting Analysts, Admins, and Developers through a role-based workflow. The platform helps improve vulnerability visibility, accountability, remediation tracking, and collaboration throughout the security issue resolution process.

---

**Project Name:** VulnTrack – Role-Based Vulnerability Management and Remediation Tracking System

**Category:** Cybersecurity / Full-Stack Web Development
