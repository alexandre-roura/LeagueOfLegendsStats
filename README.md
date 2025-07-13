# League of Legends Stats API

A robust FastAPI-based REST API for retrieving League of Legends player statistics using the Riot Games API.

## 🚀 Features

- **Player Information**: Get complete player data including account details, summoner info, and rankings
- **Riot ID Support**: Uses the latest Riot ID system (GameName#TagLine)
- **Rate Limiting**: Built-in rate limiting to respect Riot API limits
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Type Safety**: Full type hints using Pydantic models
- **Async Support**: Asynchronous operations for better performance

## 📋 Prerequisites

- Python 3.8+
- Riot Games API Key ([Get one here](https://developer.riotgames.com/))
- pip or pipenv for package management

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LeagueOfLegendsStats
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   RIOT_API_KEY=your_riot_api_key_here
   ```

## 🚀 Quick Start

1. **Start the development server**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Access the API**
   - API: `http://localhost:8000`
   - Interactive docs: `http://localhost:8000/docs`
   - OpenAPI schema: `http://localhost:8000/redoc`

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
├── frontend/              # Future frontend implementation
├── README.md
└── LICENSE
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RIOT_API_KEY` | Your Riot Games API key | Yes |

### Rate Limiting

The API includes built-in rate limiting (10 requests/second) to comply with Riot API limits.

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

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Note**: This project is not affiliated with Riot Games. League of Legends is a trademark of Riot Games, Inc.
