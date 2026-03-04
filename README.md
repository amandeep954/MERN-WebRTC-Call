# 📹 MERN WebRTC Video Calling App

A real-time video calling application built using React, Node.js, Socket.io, and WebRTC.

---

## ✨ Features

- 🎥 Real-time Video & Audio Communication  
- 🏠 Room-based Joining System (Lobby & Rooms)  
- ⚡ Peer-to-Peer Connection using WebRTC (Low Latency)  
- 🔄 Signaling Server handled via Socket.io  
- 💬 Instant connection between users  

---

## 💻 Tech Stack

### 🚀 Frontend
- React.js (Vite)  
- WebRTC API  
- HTML5  
- CSS3  

### 🔧 Backend
- Node.js  
- Express.js  
- Socket.io  

---

## 📁 Project Structure

```
MERN-WebRTC-Call/
│
├── client/        # React Frontend
│
├── server/        # Node + Socket.io Backend
│
└── README.md
```

---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/amandeep954/MERN-WebRTC-Call.git
cd MERN-WebRTC-Call
```

---

### 2️⃣ Setup Backend (Server)

Open a terminal and run:

```bash
cd server
npm install
node index.js
```

Server will run on:
```
http://localhost:8000
```
*(or the port defined in your server file)*

---

### 3️⃣ Setup Frontend (Client)

Open another terminal and run:

```bash
cd client
npm install
npm run dev
```

Frontend will run on:
```
http://localhost:5173
```

---

## 🔌 How It Works

1. User joins a room.
2. Socket.io handles signaling between peers.
3. WebRTC establishes a direct Peer-to-Peer connection.
4. Video & Audio streams are shared in real-time.

---

## 🌟 Future Improvements

- 🔒 Authentication System  
- 📱 Mobile Responsive UI  
- 🌐 Deployment (Render / Vercel)  
- 🎨 Improved UI Design  
- 📹 Screen Sharing Feature  

---

## 👨‍💻 Author

**Aman Deep**  
MERN Stack Developer  
📍 Ghaziabad, Uttar Pradesh  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

## 📜 License

This project is open-source and available under the MIT License.
