# Group Chat App

[DEMO](http://128.199.149.6/)

Because I don't have the domain name & setup SSL yet. 

So you may need to ignore Chrome’s secure origin policy to use th Video Chat, follow these steps. Navigate to chrome://flags/#unsafely-treat-insecure-origin-as-secure in Chrome.

Find and enable the Insecure origins treated as secure section (see below). Add any addresses you want to ignore the secure origin policy for. Remember to include the port number too (if required). Save and restart Chrome.
Remember this is for dev purposes only. The live working app will need to be hosted on https for users to be able to use their microphone or camera.

"unsafely-treat-insecure-origin-as-secure" flag is not working on Chrome
(https://stackoverflow.com/questions/52759992/how-to-access-camera-and-microphone-in-chrome-without-https)
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
 git clone git@github.com:huyenkvg/group-chat-app.git
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

# You can keep this URL values
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

# Get API key from your Livekit project
# read more at https://docs.livekit.io/
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=wss://group-chat-app-xigy8h85.livekit.cloud

  ```
5. Migrate & push Database:
  ```
   npx prisma migrate
   npx prisma db push 
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

