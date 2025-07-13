# League of Legends Stats

A full-stack application for retrieving and displaying League of Legends player statistics with a modern React frontend and FastAPI backend.

## 🚀 Features

### Backend (FastAPI)
- **Player Information**: Get complete player data including account details, summoner info, and rankings
- **Riot ID Support**: Uses the latest Riot ID system (GameName#TagLine)
- **Rate Limiting**: Built-in rate limiting to respect Riot API limits
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Type Safety**: Full type hints using Pydantic models
- **Async Support**: Asynchronous operations for better performance
- **CORS Support**: Configured for frontend integration

### Frontend (React + TypeScript)
- **Modern UI/UX**: Beautiful League of Legends themed interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Search**: Fast player lookup with region selection
- **Interactive Components**: Animated loading states, error handling, and smooth transitions
- **Rank Visualization**: Colorful rank icons and progress indicators
- **Statistics Dashboard**: Comprehensive display of player stats and rankings

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Riot Games API Key ([Get one here](https://developer.riotgames.com/))

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd LeagueOfLegendsStats
   ```

2. **Install backend dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Backend environment setup**

   Create a `.env` file in the `backend` directory:

   ```env
   RIOT_API_KEY=your_riot_api_key_here
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Frontend environment setup**

   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

## 🚀 Quick Start

### Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

The backend will be available at:
- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/redoc`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## 📚 API Endpoints

### Account Information

```http
GET /account/{summoner_name}/{tag_line}
```

Retrieves basic Riot account information.

**Example**: `GET /account/Faker/T1`

### Complete Player Information

```http
GET /player/{summoner_name}/{tag_line}
```

Retrieves all player information (account, summoner, rankings).

**Example**: `GET /player/Faker/T1`

### Summoner by PUUID

```http
GET /summoner/puuid/{puuid}
```

Retrieves summoner information by PUUID.

### Rankings

```http
GET /rankings/{puuid}
```

Retrieves league rankings for a summoner.

## 📝 Response Format

All endpoints return a standardized response format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "error": null,
  "status_code": null
}
```

## 🏗️ Project Structure

```
LeagueOfLegendsStats/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api.py          # Riot API client
│   │   ├── models.py       # Pydantic models
│   │   ├── exceptions.py   # Custom exceptions
│   │   └── routes.py       # FastAPI routes
│   ├── main.py            # FastAPI application
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # API configuration
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vite.config.ts     # Vite configuration
│   └── .env               # Frontend environment variables
├── README.md
└── LICENSE
```

## 🎨 Frontend Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Custom Components**: Modular and reusable UI components

### Key Frontend Components

- `SearchForm`: Player search interface with region selection
- `PlayerInfo`: Comprehensive player statistics display
- `RankIcon`: Visual rank representation with tier colors
- `StatCard`: Reusable statistics cards with icons
- `StatusBadge`: Animated status indicators
- `LoadingSpinner`: Engaging loading animations
- `ErrorMessage`: User-friendly error handling

## 🔧 Configuration

### Environment Variables

#### Backend (.env in /backend)
| Variable       | Description             | Required | Default |
| -------------- | ----------------------- | -------- | ------- |
| `RIOT_API_KEY` | Your Riot Games API key | Yes      | -       |

#### Frontend (.env in /frontend)
| Variable            | Description          | Required | Default               |
| ------------------- | -------------------- | -------- | --------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | No       | http://localhost:8000 |

### Rate Limiting

The API includes built-in rate limiting (10 requests/second) to comply with Riot API limits.

## 🛠️ Development

### Backend Scripts
```bash
# Start development server with hot reload
uvicorn main:app --reload

# Start production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🛡️ Error Handling

The API handles various error scenarios:

- **404**: Account not found
- **403**: Invalid or expired API key
- **429**: Rate limit exceeded
- **503**: Riot Games service unavailable
- **500**: Internal server error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Riot Games](https://developer.riotgames.com/) for providing the API
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [Pydantic](https://pydantic-docs.helpmanual.io/) for data validation
- [React](https://reactjs.org/) for the powerful UI library
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Vite](https://vitejs.dev/) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Note**: This project is not affiliated with Riot Games. League of Legends is a trademark of Riot Games, Inc.
