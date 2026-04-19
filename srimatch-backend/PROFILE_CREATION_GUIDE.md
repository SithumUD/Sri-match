# SriMatch Profile Creation Specification

This document provides the complete API specification and data requirements for creating and updating user profiles on the SriMatch platform.

## 1. Registration Flow
1. **User Auth**: Create an account using `/v1/auth/register`.
2. **Setup Profile**: Once authenticated, the user must complete their profile to access matching features.

## 2. Dynamic Data Requirements

### 📍 Location & Coordinates (CRITICAL)
For accurate horoscope matching, we now use a database-driven city list with precise coordinates.
- **Endpoint**: `GET /v1/locations/cities`
- **Response**: A list of city objects:
  ```json
  [
    {
      "name": "Colombo 01",
      "latitude": 6.9319,
      "longitude": 79.8478
    }
  ]
  ```
- **Action**: When a user selects a city, the frontend MUST send the `latitude` and `longitude` in the profile creation request.

### 🕒 Birth Information
- **`dateOfBirth`**: Format `YYYY-MM-DD` (e.g., `1990-05-15`)
- **`timeOfBirth`**: Format `HH:mm:ss` (e.g., `10:30:00`). This is essential for astrological calculations.

---

## 3. Profile Creation API Reference

**Endpoint**: `POST /v1/profiles` (or `PUT /v1/profiles` for updates)  
**Content-Type**: `application/json`

### Full Request Schema
```json
{
  "firstName": "Kamal",
  "lastName": "Perera",
  "gender": "MALE",
  "dateOfBirth": "1990-05-15",
  "timeOfBirth": "10:30:00",
  "maritalStatus": "NEVER_MARRIED",
  "city": "Colombo 01",
  "latitude": 6.9319,
  "longitude": 79.8478,
  "religion": "BUDDHIST",
  "ethnicity": "SINHALESE",
  "education": "BACHELORS",
  "profession": "Software Engineer",
  "height": 175,
  "about": "A brief description...",
  "interests": ["Coding", "Hiking"],
  "partnerPreferences": {
    "minAge": 20,
    "maxAge": 30,
    "preferredReligions": ["BUDDHIST", "OTHER"]
  }
}
```

---

## 4. Valid Enum Values

| Field | Allowed Values |
| :--- | :--- |
| **gender** | `MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY` |
| **maritalStatus** | `NEVER_MARRIED`, `DIVORCED`, `WIDOWED`, `SEPARATED`, `ANNULLED` |
| **religion** | `BUDDHIST`, `HINDU`, `MUSLIM`, `CHRISTIAN`, `CATHOLIC`, `OTHER`, `NO_RELIGION` |
| **ethnicity** | `SINHALESE`, `TAMIL`, `MOOR`, `BURGHER`, `MALAY`, `OTHER` |
| **education** | `HIGH_SCHOOL`, `DIPLOMA`, `BACHELORS`, `MASTERS`, `DOCTORATE`, `OTHER` |
| **bodyType** | `SLIM`, `ATHLETIC`, `AVERAGE`, `OVERWEIGHT`, `PLUS_SIZE`, `MUSCULAR` |
| **complexion** | `FAIR`, `WHEATISH`, `MEDIUM`, `DUSKY`, `DARK` |
| **smoking** | `NEVER`, `OCCASIONALLY`, `REGULARLY`, `TRYING_TO_QUIT` |
| **drinking** | `NEVER`, `SOCIALLY`, `OCCASIONALLY`, `REGULARLY` |
| **horoscopeSign** | `ARIES`, `TAURUS`, `GEMINI`, `CANCER`, `LEO`, `VIRGO`, `LIBRA`, `SCORPIO`, `SAGITTARIUS`, `CAPRICORN`, `AQUARIUS`, `PISCES` |

---

## 5. Testing & Examples

Use the following JSON payloads to test the complete flow (including horoscope matching).

### 🧑 Profile A (Male) - Kamal
```json
{
  "firstName": "Kamal",
  "lastName": "Perera",
  "gender": "MALE",
  "dateOfBirth": "1990-05-15",
  "timeOfBirth": "10:30:00",
  "maritalStatus": "NEVER_MARRIED",
  "city": "Ampara",
  "latitude": 7.2833,
  "longitude": 81.6667,
  "religion": "BUDDHIST",
  "ethnicity": "SINHALESE",
  "education": "BACHELORS",
  "profession": "Software Engineer",
  "height": 175,
  "about": "Seeking a compatible partner for a lifelong journey."
}
```

### 👩 Profile B (Female) - Nimali
```json
{
  "firstName": "Nimali",
  "lastName": "Silva",
  "gender": "FEMALE",
  "dateOfBirth": "1993-08-20",
  "timeOfBirth": "14:15:00",
  "maritalStatus": "NEVER_MARRIED",
  "city": "Pottuvil",
  "latitude": 6.8667,
  "longitude": 81.8333,
  "religion": "BUDDHIST",
  "ethnicity": "SINHALESE",
  "education": "MASTERS",
  "profession": "Doctor",
  "height": 162,
  "about": "Compassionate and career-oriented family person."
}
```

---

## 6. Testing Horoscope Matching
Once both profiles are created, trigger the matching analysis from User A's account:

**Endpoint**: `GET /v1/horoscope/match/{targetProfileId}`
- **Logic**: Compares the authenticated user's profile against the target profile.
- **Result**: Returns a total point score (out of 36) and detailed Porutham analysis (Gana, Yoni, Rasi, etc.).
