# Thinkcate - Personal Notes Application

A modern personal notes application with PDF and Excel support, built with NestJS backend and Flutter frontend.

## 🏗️ Project Structure

```
Thinkcate/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── shared/         # Shared modules (database, environment)
│   │   ├── modules/        # Feature modules
│   │   │   ├── notes/      # Notes management
│   │   │   ├── files/      # File management
│   │   │   └── upload/     # File upload
│   │   └── main.ts
│   ├── data/               # Database and uploads
│   └── package.json
├── frontend-web/           # Flutter Web (coming soon)
├── frontend-mobile/        # Flutter Mobile (coming soon)
└── README.md
```

## 🚀 Features

### Backend (NestJS)
- ✅ RESTful API
- ✅ PostgreSQL/SQLite support
- ✅ File upload (PDF, Excel, TXT, Markdown)
- ✅ Notes CRUD
- ✅ File management
- ✅ Search functionality
- ✅ Favorites system
- ✅ Tags support

### Frontend (Flutter)
- 🔄 Web application (PWA)
- 🔄 Mobile application (Android/iOS)
- 🔄 Responsive design
- 🔄 Offline support
- 🔄 File upload with drag & drop
- 🔄 Rich text editor
- 🔄 PDF/Excel viewer

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL / SQLite
- **ORM:** TypeORM
- **File Upload:** Multer
- **Validation:** class-validator

### Frontend
- **Framework:** Flutter
- **Language:** Dart
- **Platforms:** Web, Android, iOS
- **State Management:** Provider/Riverpod
- **HTTP Client:** Dio

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database settings in .env
npm run start:dev
```

### Frontend Setup (Coming Soon)
```bash
# Web
cd frontend-web
flutter pub get
flutter run -d chrome

# Mobile
cd frontend-mobile
flutter pub get
flutter run
```

## 🗄️ Database

The application supports both PostgreSQL and SQLite:

- **PostgreSQL:** For production and better performance
- **SQLite:** For development and simple deployment

Configure in `.env`:
```env
DATABASE_TYPE=postgres  # or sqlite
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=thinkcate_user
DATABASE_PASSWORD=thinkcate_password
DATABASE_NAME=thinkcate_db
```

## 📱 API Endpoints

### Notes
- `GET /notes` - List notes
- `POST /notes` - Create note
- `GET /notes/:id` - Get note
- `PATCH /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `GET /notes/search?q=query` - Search notes
- `GET /notes/favorites` - Get favorites

### Files
- `POST /files/upload` - Upload file
- `GET /files` - List files
- `GET /files/:id` - Get file
- `PATCH /files/:id` - Update file
- `DELETE /files/:id` - Delete file
- `GET /files/search?q=query` - Search files
- `GET /files/favorites` - Get favorites
- `GET /files/type/:type` - Filter by type

### Upload
- `POST /upload/file` - Upload file

## 🚀 Development

### Backend Development
```bash
cd backend
npm run start:dev    # Development server
npm run build        # Build for production
npm run start:prod   # Production server
```

### Database Migration
```bash
# The database will be created automatically on first run
# Tables are created via TypeORM synchronize
```

## 📄 License

This project is for personal use only.

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📞 Support

For questions or issues, please open an issue in the repository.
