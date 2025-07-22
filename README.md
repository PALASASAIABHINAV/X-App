# 🐦 X-Clone — A Full-Stack Social Media App

This is a fully functional **Twitter/X-clone** built using the **MERN** stack and **Zustand**. Users can register, login, post content, like/unlike posts, follow/unfollow other users, and receive notifications — all with a responsive and modern UI.

---

## 🚀 Features

- 📝 Create, view, and delete posts  
- ❤️ Like & Unlike posts (with like counts)  
- 👥 Follow / Unfollow users  
- 🔔 Real-time-like notifications for likes and follows  
- 🧠 Zustand for global state management  
- 🖼️ Update profile and cover images  
- 🔐 Secure user authentication (JWT) 
- 📱 Mobile-friendly and responsive design

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Zustand, Tailwind CSS, Axios  
- **Backend**: Node.js with Express.js  
- **Database**: MongoDB with Mongoose  
- **Authentication**: JWT  
- **Image Uploads**: Cloudinary  
- **State Management**: Zustand

---

## 📦 Installation & Setup (Local Development)

### For frontend:

```bash
cd frontend
npm install
npm run dev
```

### For backend:
🔑 Create a .env file inside the backend/ folder with the following keys:
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
cd backend
npm install
npm run dev
```
