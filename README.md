# Group Chat App

![Group Chat App Logo](path/to/your/logo.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Database](#database)
- [Authentication](#authentication)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Introduction

The Group Chat App is a comprehensive real-time messaging application that allows users to create and join chat groups, exchange messages, share multimedia content, and conduct video conferencing. This README provides an overview of the app, its features, and instructions for getting started.

## Features

- **Real-Time Messaging:** Instant messaging using WebSocket for real-time communication.
- **User Authentication:** Secure user authentication with Clerk to ensure privacy and control access.
- **Server/Channel:** Each User has their own server, having the full ability to create channels, invite people, and chat.
- **Message Persistence:** Storage of chat messages for a complete message history.
- **Notifications:** ...
- **Multimedia Support:** Share images, files, and links within chat groups.
- **Video Conferencing:** Seamless integration with LiveKit for conducting video conferences within the app.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MySQL database
- Prisma for ORM installed.
- Clerk account for authentication.

### Installation

1. Clone the repository:

 ```bash
 git clone https://github.com/huyenkvg/group-chat-app.git
 ```
2. Install dependencies:
  ```bash
  npm install
  ``` 
3. Create your own database with mysql.
4. Configuration:
 Sample of ENV:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # Cleck publishable key get from Clerk dashboard
CLERK_SECRET_KEY= # Cleck secret key get from Clerk dashboard

# Clerk dashboard: https://dashboard.clerk.com

NEXT_PUBLIC_CLERK_SIGN_IN_URL=  # /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=  # /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=  # /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL= # /

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL= #your DB for connection

NEXT_PUBLIC_SITE_URL= # your public site

# UploadThing API keys
# https://uploadthing.com/dashboard/
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

NEXT_PUBLIC_LIVEKIT_URL=wss://group-chat-app-xigy8h85.livekit.cloud
  ```
5. Migrate Database:
  ```
   npx prisma migrate dev
  ```
6. start
 ```
  npm run dev
 ```

## Technologies Used
- Node.js 
- WebSocket (e.g., Socket.IO)
- MySQL (Digital Ocean)
- Prisma (ORM)
- Next.js (React framework)
- Tailwind CSS with Shadcn (Shadow CSS framework)
- Clerk (Authentication)
- LiveKit (Video Conferencing)

