# League of Legends Stats

A full-stack application for retrieving and displaying League of Legends player statistics with a modern React frontend and FastAPI backend.

## 🚀 Features

- **Player Statistics**: Complete player data including rankings and match history
- **Real-time Search**: Fast player lookup with region selection
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript and Pydantic integration
- **Error Handling**: Comprehensive error management and user feedback

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Riot Games API Key ([Get one here](https://developer.riotgames.com/))

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd LeagueOfLegendsStats
   ```

2. **Backend Setup**

   ```bash
   pip install -r requirements.txt
   ```

   Create a `.env` file in the `backend` directory:

   ```env
   RIOT_API_KEY=your_riot_api_key_here
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ```

   Optionally, create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

## 🚀 Quick Start

**Start Backend:**

```bash
cd backend
uvicorn main:app --reload
```

**Start Frontend:**

```bash
cd frontend
npm run dev
```

**Access the application:**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## 📚 API Endpoints

- `GET /player/{summoner_name}/{tag_line}` - Complete player information
- `GET /account/{summoner_name}/{tag_line}` - Account information
- `GET /summoner/puuid/{puuid}` - Summoner by PUUID
- `GET /rankings/{puuid}` - League rankings

**Example:** `GET /player/Faker/T1`

## 🏗️ Tech Stack

**Backend:** FastAPI, Python, Pydantic, CORS support
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS

## 📂 Project Structure

```
LeagueOfLegendsStats/
├── backend/           # FastAPI application
│   ├── app/          # Core application modules
│   └── main.py       # Application entry point
├── frontend/         # React application
│   └── src/          # Source code
└── README.md
```

## 🔧 Development

**Backend commands:**

- `uvicorn main:app --reload` - Development server
- `uvicorn main:app --host 0.0.0.0 --port 8000` - Production

**Frontend commands:**

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Note**: This project is not affiliated with Riot Games. League of Legends is a trademark of Riot Games, Inc.
