const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

dotenv.config();

// Python executable to use when spawning model scripts. Override with `PYTHON_PATH` if needed.
const pythonExecutable = process.env.PYTHON_PATH || process.env.PYTHON || 'python';

// Initialize MongoDB connection. If no MONGO_URI is provided, attempt to start an
// in-memory MongoDB (mongodb-memory-server) for local development.
let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
async function initMongo() {
    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('MongoDB connected');
            return;
        } catch (err) {
            console.error('MongoDB connection error:', err);
        }
    }

    // Fallback: try to start an in-memory MongoDB for development (optional dependency)
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Started in-memory MongoDB for development');

        const cleanup = async () => {
            try { await mongoose.disconnect(); } catch (e) {}
            try { await mongod.stop(); } catch (e) {}
            process.exit(0);
        };
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('exit', cleanup);
    } catch (err) {
        console.warn('MONGO_URI not found and in-memory MongoDB not available. MongoDB features will be disabled.', err);
    }
}

initMongo();

const reportSchema = new mongoose.Schema({
    email: { type: String, required: true },
    locationLat: { type: Number, required: true },
    locationLng: { type: Number, required: true },
    slopeValue: { type: Number, required: true },
    suitability: String,
    method: String,
    reason: String,
    points: [{
        coords: [Number],
        slope: String,
        suitability: String,
        method: String,
        reason: String,
    }],
    analysisText: String,
    imagePath: String,
    pdfPath: String,
    createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3003;

app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ensure uploads and reports directories exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
}

app.use('/reports', express.static(reportsDir));

function fetchOpenMeteoArchive(lat, lng, startDate = '2025-01-01', endDate = '2025-12-31') {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum&timezone=auto`;
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                if (resp.statusCode < 200 || resp.statusCode >= 300) {
                    return reject(new Error(`Open-Meteo API error ${resp.statusCode}`));
                }
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}

function summarizeRainfallArchive(archive, startDate, endDate) {
    const time = archive?.daily?.time || [];
    const precipitation = archive?.daily?.precipitation_sum || [];

    if (!Array.isArray(time) || !Array.isArray(precipitation) || precipitation.length === 0) {
        throw new Error('The weather API did not return precipitation data.');
    }

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const monthTotals = {};
    precipitation.forEach((value, index) => {
        const month = new Date(`${time[index]}T00:00:00Z`).getUTCMonth();
        monthTotals[month] = (monthTotals[month] || 0) + Number(value || 0);
    });

    const totalPrecipitation = precipitation.reduce((sum, value) => sum + Number(value || 0), 0);
    const rainyDays = precipitation.reduce(
        (count, value) => count + (Number(value || 0) >= 1 ? 1 : 0),
        0,
    );
    const averagePrecipitation = totalPrecipitation / precipitation.length;

    const sortedMonths = Object.entries(monthTotals).sort((a, b) => b[1] - a[1]);
    const peakMonthIndex = sortedMonths[0] ? Number(sortedMonths[0][0]) : 0;
    const peakMonth = monthNames[peakMonthIndex];

    const rainySeasonMonths = Object.entries(monthTotals)
        .filter(([, total]) => total >= 100)
        .map(([monthIndex]) => monthNames[Number(monthIndex)]);
    const rainySeason = rainySeasonMonths.length
        ? rainySeasonMonths.join(', ')
        : peakMonth;

    return {
        period: `${startDate} to ${endDate}`,
        totalPrecipitation,
        rainyDays,
        averagePrecipitation,
        peakMonth,
        rainySeason,
        monthlyPrecipitation: Object.fromEntries(
            Object.entries(monthTotals).map(([monthIndex, total]) => [
                monthNames[Number(monthIndex)],
                total,
            ]),
        ),
    };
}

app.get('/weather-archive', async (req, res) => {
    const { latitude, longitude, start_date, end_date } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({
            error: 'latitude and longitude query parameters are required',
        });
    }

    const startDate = start_date || '2025-01-01';
    const endDate = end_date || '2025-12-31';

    try {
        const archive = await fetchOpenMeteoArchive(latitude, longitude, startDate, endDate);
        const summary = summarizeRainfallArchive(archive, startDate, endDate);
        return res.json(summary);
    } catch (err) {
        console.error('Weather archive fetch failed:', err);
        return res.status(500).json({
            error: err.message || 'Failed to retrieve weather archive data',
        });
    }
});

// API endpoint to analyze slope
app.post('/analyze', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;

    // Call Python script
    const pythonProcess = spawn(pythonExecutable, [path.join(__dirname, '../ai-model/slope_detection.py'), imagePath]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: error || 'Python script failed' });
        }
        res.json({ result: result.trim() });
    });
});

app.post('/predict-recharge', (req, res) => {
    const { latMin, lonMin, latMax, lonMax, demFile, count } = req.body;
    const scriptPath = path.join(__dirname, '../ai-model/recharge_prediction.py');
    // pythonExecutable is defined earlier (use environment or default 'python3')

    const pythonArgs = [scriptPath, '--output-json'];
    if (latMin !== undefined) pythonArgs.push('--lat-min', latMin.toString());
    if (lonMin !== undefined) pythonArgs.push('--lon-min', lonMin.toString());
    if (latMax !== undefined) pythonArgs.push('--lat-max', latMax.toString());
    if (lonMax !== undefined) pythonArgs.push('--lon-max', lonMax.toString());
    if (demFile) pythonArgs.push('--dem-file', demFile);
    if (count !== undefined) pythonArgs.push('--count', count.toString());

    const pythonProcess = spawn(pythonExecutable, pythonArgs);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: errorOutput || 'Recharge prediction failed' });
        }

        try {
            const jsonResult = JSON.parse(output);
            return res.json(jsonResult);
        } catch (parseError) {
            return res.status(500).json({ error: 'Failed to parse model output', details: parseError.message, raw: output });
        }
    });
});

// Health check
function createPdfReport({ email, locationLat, locationLng, slopeValue, suitability, points, analysisText, rainSummary, imagePath }) {
    return new Promise((resolve, reject) => {
        const sanitizeText = (text) => {
            if (!text) return '';
            const str = String(text);
            return str.replace(/\u00B0/g, ' degrees')
                      .replace(/[^\x00-\x7F]/g, '')
                      .replace(/\n\s*\n/g, '\n')
                      .trim();
        };

        const filename = `slope-report-${Date.now()}.pdf`;
        const pdfPath = path.join(reportsDir, filename);
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const stream = fs.createWriteStream(pdfPath);

        doc.on('error', (err) => reject(err));
        doc.pipe(stream);

        doc.font('Helvetica-Bold').fontSize(22).fillColor('#003366').text('SlopeSense Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(11).fillColor('#555').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(1);
        doc.strokeColor('#007BFF').lineWidth(1).moveTo(doc.x, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1);

        doc.fillColor('#0D47A1').font('Helvetica-Bold').fontSize(13).text('Location & Summary');
        doc.moveDown(0.25);
        doc.font('Helvetica').fontSize(11).fillColor('#000');
        doc.text(`Email: ${sanitizeText(email) || 'Not provided'}`);
        doc.text(`Location: ${sanitizeText(locationLat)}, ${sanitizeText(locationLng)}`);
        doc.text(`Slope: ${sanitizeText(slopeValue)} degrees`);
        doc.text(`Suitability: ${sanitizeText(suitability) || 'Unknown'}`);
        doc.moveDown(0.75);

        if (
            rainSummary &&
            typeof rainSummary === 'object' &&
            Object.keys(rainSummary).length > 0
        ) {
            const totalPrecipitation = Number(rainSummary.totalPrecipitation);
            const totalPrecipText = Number.isFinite(totalPrecipitation)
                ? `${totalPrecipitation.toFixed(0)} mm`
                : 'N/A';

            doc.fillColor('#0D47A1').font('Helvetica-Bold').fontSize(13).text('Rainfall Summary');
            doc.moveDown(0.25);
            doc.font('Helvetica').fontSize(11).fillColor('#000').text(`Period: ${sanitizeText(rainSummary.period || 'N/A')}`);
            doc.text(`Total precipitation: ${sanitizeText(totalPrecipText)}`);
            doc.text(`Rainy days: ${sanitizeText(rainSummary.rainyDays || 'N/A')}`);
            doc.text(`Peak month: ${sanitizeText(rainSummary.peakMonth || 'N/A')}`);
            doc.text(`Rainy season: ${sanitizeText(rainSummary.rainySeason || 'N/A')}`);
            doc.moveDown(0.75);
        }

        doc.fillColor('#0D47A1').font('Helvetica-Bold').fontSize(13).text('Analysis Summary');
        doc.moveDown(0.25);
        doc.font('Helvetica').fontSize(11).fillColor('#000').text(sanitizeText(analysisText) || 'No additional summary provided.', { lineGap: 4 });
        doc.moveDown(1);

        if (imagePath && fs.existsSync(imagePath)) {
            try {
                doc.addPage();
                doc.font('Helvetica-Bold').fontSize(18).fillColor('#003366').text('Uploaded Slope Image', { align: 'center' });
                doc.moveDown(0.5);
                doc.image(imagePath, {
                    fit: [480, 420],
                    align: 'center',
                    valign: 'center',
                });
                doc.moveDown(1);
            } catch (error) {
                doc.addPage();
                doc.font('Helvetica-Bold').fontSize(14).fillColor('#003366').text('Slope image could not be embedded.', { align: 'left' });
            }
        }

        doc.addPage();
        doc.fillColor('#0D47A1').font('Helvetica-Bold').fontSize(18).text('Groundwater Charging Points', { align: 'center' });
        doc.moveDown(0.75);
        doc.font('Helvetica').fontSize(11).fillColor('#000');

        if (Array.isArray(points) && points.length > 0) {
            points.forEach((point, idx) => {
                const lat = point.coords?.[0] ? Number(point.coords[0]).toFixed(6) : 'N/A';
                const lng = point.coords?.[1] ? Number(point.coords[1]).toFixed(6) : 'N/A';

                doc.fillColor('#007BFF').font('Helvetica-Bold').text(`Point ${idx + 1}`, { continued: false });
                doc.moveDown(0.25);
                doc.fillColor('#000').font('Helvetica').text(`  Coordinates: ${lat}, ${lng}`);
                doc.text(`  Slope: ${sanitizeText(point.slope)} degrees`);
                doc.text(`  Suitability: ${sanitizeText(point.suitability)}`);
                if (point.method) doc.text(`  Recommended method: ${sanitizeText(point.method)}`);
                if (point.reason) doc.text(`  Reason: ${sanitizeText(point.reason)}`);
                doc.moveDown(0.75);
            });
        } else {
            doc.text('No groundwater charging points were generated for this location.');
        }

        doc.addPage();
        doc.font('Helvetica').fontSize(10).fillColor('#666').text('Generated by SlopeSense – actionable slope analysis for groundwater recharge planning.', { align: 'center' });
        doc.end();

        stream.on('finish', () => resolve(pdfPath));
        stream.on('error', (err) => reject(err));
    });
}

function createMailTransport() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

app.post('/report', upload.single('image'), async (req, res) => {
    const {
        email,
        locationLat,
        locationLng,
        slopeValue,
        suitability,
        points,
        analysisText,
    } = req.body;

    try {
        if (!locationLat || !locationLng || !slopeValue) {
            return res.status(400).json({ error: 'Location and slope values are required.' });
        }

        const requestedEmail = email && email.trim() ? email.trim() : null;

        let parsedPoints = [];
        try {
            parsedPoints = points ? JSON.parse(points) : [];
        } catch (error) {
            parsedPoints = [];
        }

        const recommendation = parsedPoints.length > 0 ? {
            method: parsedPoints[0].method || '',
            reason: parsedPoints[0].reason || '',
        } : { method: '', reason: '' };

        const rawRainSummary = req.body.rainSummary || '';
        const rainSummary = rawRainSummary.trim()
            ? JSON.parse(rawRainSummary)
            : null;
        const pdfPath = await createPdfReport({
            email,
            locationLat,
            locationLng,
            slopeValue,
            suitability: suitability || 'Unknown',
            points: parsedPoints,
            analysisText,
            rainSummary,
            imagePath: req.file ? req.file.path : null,
        });

        const protocol = req.headers['x-forwarded-proto']
            ? String(req.headers['x-forwarded-proto']).split(',')[0].trim()
            : req.protocol;
        const baseUrl = `${protocol}://${req.get('host')}`;
        const pdfUrl = `${baseUrl}/download-report/${encodeURIComponent(path.basename(pdfPath))}`;
        const transporter = createMailTransport();
        const emailRequested = Boolean(requestedEmail);
        const shouldEmail = transporter && emailRequested;

        if (mongoose.connection.readyState === 1) {
            try {
                await Report.create({
                    email: requestedEmail || 'no-email@slopesense.local',
                    locationLat: Number(locationLat),
                    locationLng: Number(locationLng),
                    slopeValue: Number(slopeValue),
                    suitability: suitability || 'Unknown',
                    method: recommendation.method,
                    reason: recommendation.reason,
                    points: parsedPoints,
                    analysisText,
                    imagePath: req.file ? req.file.path : null,
                    pdfPath,
                });
            } catch (saveError) {
                console.error('Error saving report to MongoDB:', saveError);
            }
        }

        if (emailRequested && !transporter) {
            return res.json({
                message: 'Report generated successfully, but email service is not configured.',
                pdfUrl,
                emailError: 'Email service is not configured. Report can still be downloaded.',
            });
        }

        if (shouldEmail) {
            try {
                await transporter.sendMail({
                    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                    to: requestedEmail,
                    subject: 'Your SlopeSense PDF Report',
                    text: 'Please find your SlopeSense report attached.',
                    attachments: [{ filename: path.basename(pdfPath), path: pdfPath }],
                });

                return res.json({ message: 'Report generated and sent to your email.', pdfUrl });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
                return res.json({
                    message: 'Report generated successfully, but email could not be sent.',
                    pdfUrl,
                    emailError: emailError.message || 'Unable to send email.',
                });
            }
        }

        return res.json({ message: 'Report generated successfully.', pdfUrl });
    } catch (err) {
        console.error('Report Generation Error:', err);
        res.status(500).json({ error: 'Internal server error during report generation.', details: err.message });
    }
});

app.get('/download-report/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(reportsDir, filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Report not found');
    }
    return res.download(filePath);
});

app.get('/', (req, res) => {
    res.send('SlopeSense Backend Server');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});