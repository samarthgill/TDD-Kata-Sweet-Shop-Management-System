# Sweet Shop Management System

A full-stack Sweet Shop Management System with **React frontend**, **Flask backend**, and **MongoDB database**. This project implements user authentication, sweet management, inventory handling, and a responsive SPA for smooth user interaction.  

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [License](#license)

---

## Features

### Backend
- User registration and login (JWT-based authentication)
- CRUD operations for sweets (Admin only for create/update/delete)
- Purchase and restock sweets (inventory management)
- Search sweets by name, category, or price range
- RESTful API endpoints

### Frontend
- React SPA with modern UI
- Login & registration forms
- Dashboard to display all sweets
- Search and filter sweets
- Purchase functionality (disabled if out of stock)
- Admin panel for managing sweets

---

## Tech Stack

- **Frontend:** React, TypeScript, Axios
- **Backend:** Flask, Python
- **Database:** MongoDB
- **Authentication:** JWT
- **Testing:** Pytest (Backend), Jest (Frontend)
- **Version Control:** Git
- **Deployment:** Optional (Heroku, Vercel, or Netlify)

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- MongoDB running locally or via MongoDB Atlas
- Git

### Clone the repository
```bash
git clone <your-github-repo-url>
cd Sweet-Shop-Management-System
