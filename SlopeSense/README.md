# SlopeSense - Groundwater Recharge Detection System

## Project Description

SlopeSense is a smart application that analyzes land terrain and calculates slope using elevation data. Based on slope and terrain conditions, it suggests the best locations for groundwater recharge points. The system helps in water conservation and efficient land use planning.

## Features

- 📷 Upload land image / map
- 🗺️ Detect slope using image processing
- 📊 Show slope percentage / angle
- 📍 Suggest recharge points
- 📄 Generate report
- 💾 Save analysis history
- 🔐 User authentication

## Technology Stack

### Frontend
- React.js (Web)
- React Native (Mobile - planned)

### Backend
- Node.js with Express

### Database
- MySQL

### AI/Model
- Python with OpenCV for image processing

### Other
- Multer for file uploads
- CORS for cross-origin requests

## Project Structure

```
SlopeSense/
├── frontend/          # React web app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── mobile/            # React Native app
│   ├── App.js
│   └── package.json
├── backend/           # Node.js server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── database/          # Database schema
│   └── schema.sql
├── ai-model/          # Python slope detection
│   └── slope_detection.py
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.7 or higher)
- MySQL
- npm or yarn
- OpenCV-Python library for image processing
- Virtual environment (Python venv)

### Backend Setup
1. Navigate to backend directory:
   ```
   cd SlopeSense/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up database:
   - Create MySQL database named `slopesense`
   - Run the schema.sql file: `mysql -u root -p slopesense < ../database/schema.sql`
   - Update database credentials in `.env` file if needed

4. Create `.env` file with your configuration:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=slopesense
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   PYTHON_PATH=d:/1PROJECT/.venv/Scripts/python.exe
   ```

5. Start the server:
   ```
   npm start
   ```
   Server will run on http://localhost:3003

### Frontend Setup
1. Navigate to frontend directory:
   ```
   cd SlopeSense/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3003
   ```

4. Start the React app:
   ```
   npm start
   ```
   App will run on http://localhost:3000
   
   **Note**: If port 3000 is already in use, React will prompt you to run on an alternate port.

### React Native Mobile App Setup

1. Navigate to mobile directory:
   ```
   cd SlopeSense/mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. For Android:
   - Set up Android Studio and Android SDK
   - Start Metro server: `npx react-native start`
   - Run on device/emulator: `npx react-native run-android`

4. For iOS (macOS only):
   - Set up Xcode
   - Start Metro server: `npx react-native start`
   - Run on simulator: `npx react-native run-ios`

Note: Update the server URL in mobile/App.js if deploying backend to different host (use IP address for physical device).

### Python Setup
1. Create a virtual environment in the project root:
   ```
   python -m venv .venv
   ```

2. Activate the virtual environment:
   - **On Windows**:
     ```
     .venv\Scripts\activate
     ```
   - **On macOS/Linux**:
     ```
     source .venv/bin/activate
     ```

3. Install required Python packages:
   ```
   pip install opencv-python numpy pillow
   ```

4. The `slope_detection.py` script will be called by the backend via the virtual environment Python executable
5. Verify the Python path in the backend's `server.js` matches your system configuration

## Usage

### Getting Started
1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```
   The server will run on http://localhost:3003

2. **Start the frontend React app** (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```
   The app will run on http://localhost:3000

3. **Using the Application**:
   - Open http://localhost:3000 in your web browser
   - Upload a land/terrain image through the web interface
   - Wait for the slope analysis to complete
   - View the calculated slope angle and percentage
   - Review suggested recharge point locations
   - Generate and download a PDF report of the analysis
   - Access generated reports from the reports section

### Example Workflow
1. User uploads a satellite image or terrain map
2. Backend receives the image and saves it to the uploads directory
3. Python AI model analyzes the image using computer vision
4. Slope angle is calculated using image gradients
5. Frontend displays results with visualizations
6. User can generate a PDF report with the analysis
7. Report is stored and can be retrieved later

## API Endpoints

### Image Analysis
- **`POST /analyze`**
  - Description: Upload an image and analyze slope
  - Parameters:
    - `image` (file, required): Image file (JPG, PNG)
  - Response:
    ```json
    {
      "result": "Average slope: 25.34 degrees"
    }
    ```

### PDF Report Generation
- **`POST /generate-report`**
  - Description: Generate and download PDF report with analysis
  - Parameters:
    - `email` (string): User email
    - `locationLat` (number): Latitude
    - `locationLng` (number): Longitude
    - `slopeValue` (number): Calculated slope value
    - `suitability` (string): Recharge suitability assessment
    - `analysisText` (string): Analysis summary
    - `imagePath` (string): Path to the uploaded image

### Health Check
- **`GET /`**
  - Description: Server health check
  - Response: Server status

## Database Schema

The MySQL database includes the following tables:

- **users**: User accounts with authentication
- **images**: Uploaded satellite/terrain images linked to users
- **analyses**: Slope analysis results linked to images
- **recharge_points**: Suggested groundwater recharge point locations
- **reports**: Generated PDF reports with analysis data

See [database/schema.sql](database/schema.sql) for detailed schema.

## Project Features in Detail

### Image Processing (AI Model)
- Uses OpenCV and NumPy for image gradient analysis
- Calculates slope angles using Sobel operators
- Applies Gaussian blur for noise reduction
- Returns average slope in degrees

### File Management
- Multer-based image upload with timestamp naming
- Automatic directory creation for uploads and reports
- PDF report generation with PDFKit
- Static file serving for generated reports

### Backend Capabilities
- CORS support for cross-origin requests
- Environment configuration via `.env` file
- File upload handling and validation
- PDF report generation with embedded images
- Email notification support (Nodemailer configured)

## Troubleshooting

### Common Issues and Solutions

**Issue**: Python script not found error
- **Solution**: Verify the Python path in `server.js` matches your `.venv` installation

**Issue**: Port 3000/3003 already in use
- **Solution**: Change the port in `server.js` or `package.json`, or kill the process using that port

**Issue**: Database connection failed
- **Solution**: Ensure MySQL is running and credentials in `.env` file are correct

**Issue**: CORS errors
- **Solution**: Verify the backend server is running on the expected port and frontend has correct API URL

**Issue**: Image upload fails
- **Solution**: Check that `uploads/` directory exists and has write permissions

**Issue**: Python dependencies missing
- **Solution**: Activate virtual environment and run `pip install opencv-python numpy pillow`

## Development

### Running in Development Mode
```bash
# Backend (with auto-reload)
cd backend
npm run dev

# Frontend (with hot reload)
cd frontend
npm start
```

### Code Structure
- `ai-model/`: Python scripts for image analysis
- `backend/`: Express.js server and API routes
- `frontend/`: React components and pages
- `mobile/`: React Native mobile application
- `database/`: MySQL schema and migrations

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a new branch for your feature
2. Make your changes with clear commit messages
3. Test thoroughly before submitting a pull request
4. Update documentation as needed

## Authors

SlopeSense Development Team

## Future Enhancements

- Google Maps integration with real coordinates
- Android/iOS app using React Native
- User login system with JWT authentication
- Cloud deployment (AWS/Azure)
- CI/CD pipeline with GitHub Actions
- 3D terrain visualization using Three.js
- Machine learning model for improved slope detection
- REST API documentation with Swagger
- Unit and integration tests


## License

This project is for educational purposes. You are free to use, modify, and distribute this project as needed for learning and non-commercial purposes.

## Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

## Acknowledgments

- OpenCV for image processing
- React and React Native communities
- Express.js framework
- All open-source contributors