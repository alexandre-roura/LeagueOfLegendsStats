"""Custom exceptions for the Riot Games API"""


class RiotApiException(Exception):
    """Base exception for Riot Games API"""
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AccountNotFoundException(RiotApiException):
    """Raised when an account is not found"""
    def __init__(self, summoner_name: str, tag_line: str):
        message = f"Account not found: {summoner_name}#{tag_line}"
        super().__init__(message, 404)


class RateLimitException(RiotApiException):
    """Raised when API rate limit is reached"""
    def __init__(self):
        message = "API rate limit reached. Please try again later."
        super().__init__(message, 429)


class ApiKeyException(RiotApiException):
    """Raised when the API key is invalid"""
    def __init__(self):
        message = "Invalid or expired API key"
        super().__init__(message, 403)


class ServiceUnavailableException(RiotApiException):
    """Raised when the Riot service is unavailable"""
    def __init__(self):
        message = "Riot Games service temporarily unavailable"
        super().__init__(message, 503)
