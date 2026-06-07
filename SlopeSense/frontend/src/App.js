import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3003";

// Custom marker icons
const selectedLocationIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const waterpointIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const currentLocationIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component for current location marker
function CurrentLocationMarker({ currentLocation }) {
  return currentLocation ? (
    <Marker position={currentLocation} icon={currentLocationIcon}>
      <Popup>
        <div className="location-popup">
          <strong>📍 Your Location</strong>
          <br />
          Lat: {currentLocation.lat.toFixed(6)}
          <br />
          Lng: {currentLocation.lng.toFixed(6)}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Component to handle map clicks
function LocationMarker({
  selectedLocation,
  setSelectedLocation,
  onPinSelect,
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      if (onPinSelect) {
        onPinSelect(lat, lng, "map");
      }
    },
  });

  return selectedLocation ? (
    <Marker position={selectedLocation} icon={selectedLocationIcon}>
      <Popup>
        Selected: {selectedLocation.lat.toFixed(4)},{" "}
        {selectedLocation.lng.toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
}

// Component to display groundwater charging points
function GroundwaterPoints({ points }) {
  return (
    <>
      {points.map((point, idx) => (
        <Marker key={idx} position={point.coords} icon={waterpointIcon}>
          <Popup>
            <strong>Groundwater Charging Point {idx + 1}</strong>
            <br />
            Slope: {point.slope}°<br />
            Suitability: {point.suitability}
            <br />
            Method: {point.method}
            <br />
            <em>{point.reason}</em>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

// Component to show slope zones
function SlopeZones({ slopeData }) {
  if (!slopeData) return null;

  return (
    <>
      {slopeData.map((zone, idx) => (
        <Circle
          key={idx}
          center={zone.center}
          radius={zone.radius}
          pathOptions={{
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.3,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{zone.label}</strong>
            <br />
            Slope: {zone.slopeRange}
          </Popup>
        </Circle>
      ))}
    </>
  );
}

function App() {
  const [view, setView] = useState(
    localStorage.getItem("slopeSenseEmail") ? "main" : "login",
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("slopeSenseEmail") || "",
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [result, setResult] = useState("");
  const [reportUrl, setReportUrl] = useState(null);
  const [reportMessage, setReportMessage] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLat, setSearchLat] = useState("28.61");
  const [searchLng, setSearchLng] = useState("77.23");
  const [slopeValue, setSlopeValue] = useState(null);
  const [groundwaterPoints, setGroundwaterPoints] = useState([]);
  const [slopeZones, setSlopeZones] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [rainSummary, setRainSummary] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("history");
  const [historyRecords, setHistoryRecords] = useState(() =>
    JSON.parse(localStorage.getItem("slopeSenseHistory") || "[]"),
  );
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("slopeSenseHistory", JSON.stringify(historyRecords));
  }, [historyRecords]);

  const reportSteps = [
    { label: "Select a location", done: !!selectedLocation },
    { label: "Analyze slope", done: slopeValue !== null },
    { label: "Generate PDF report", done: !!reportUrl },
    { label: "Download or email", done: !!reportUrl },
  ];

  const saveLoggedInUser = (email) => {
    localStorage.setItem("slopeSenseEmail", email);
    setUserEmail(email);
    setAuthError("");
    setView("main");
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setAuthError("");

    if (!registerEmail || !registerPassword || !registerConfirmPassword) {
      setAuthError("Please fill in all registration fields.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("slopeSenseUsers") || "[]");
    if (users.find((user) => user.email === registerEmail)) {
      setAuthError("This email is already registered. Please log in.");
      return;
    }

    users.push({ email: registerEmail, password: registerPassword });
    localStorage.setItem("slopeSenseUsers", JSON.stringify(users));
    saveLoggedInUser(registerEmail);
    setResult("Registration successful. You are now logged in.");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setAuthError("");

    const users = JSON.parse(localStorage.getItem("slopeSenseUsers") || "[]");
    const existingUser = users.find(
      (user) => user.email === loginEmail && user.password === loginPassword,
    );

    if (!existingUser) {
      setAuthError("Invalid email or password.");
      return;
    }

    saveLoggedInUser(loginEmail);
    setResult(
      "Login successful. You can now generate PDF reports to your registered email.",
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("slopeSenseEmail");
    setView("login");
    setUserEmail("");
    setSelectedLocation(null);
    setCurrentLocation(null);
    setLocationError(null);
    setResult("");
    setReportUrl(null);
    setSlopeValue(null);
    setGroundwaterPoints([]);
    setSlopeZones([]);
  };

  const getRechargeRecommendation = (slope, rainSummary = null) => {
    const rainNotes = rainSummary
      ? ` Annual rainfall is ${rainSummary.totalPrecipitation.toFixed(0)} mm. ${
          rainSummary.totalPrecipitation < 600
            ? 'Use compact recharge structures and maximize runoff capture for limited rain.'
            : rainSummary.totalPrecipitation < 1100
            ? 'Moderate rainfall supports well-sized recharge units with seasonal storage.'
            : 'High rainfall supports larger recharge systems with greater storage capacity.'
        }`
      : '';

    if (slope < 5) {
      return {
        category: "Very gentle",
        suitability: "Excellent",
        method: "Infiltration trench / Recharge pit",
        reason:
          "Very gentle slope with minimal runoff and high infiltration potential." + rainNotes,
      };
    }
    if (slope < 10) {
      return {
        category: "Gentle",
        suitability: "Very Good",
        method: "Percolation pond / Recharge ditch",
        reason:
          "Gentle slope supports controlled infiltration structures with low erosion risk." + rainNotes,
      };
    }
    if (slope < 15) {
      return {
        category: "Moderate",
        suitability: "Good",
        method: "Contour bunds / Check dams",
        reason:
          "Moderate slope requires contour-based runoff control to improve recharge safely." + rainNotes,
      };
    }
    return {
      category: "Steep",
      suitability: "Moderate",
      method: "Terrace structures / Small check dams",
      reason:
        "Steeper slope needs energy dissipation and smaller recharge units to prevent erosion." + rainNotes,
    };
  };

  const getLocationAnalysis = (lat, lng, rainSummary = null) => {
    const simulatedSlope = Math.min(
      30,
      Math.abs(Math.sin(lat * 0.12) * 7 + Math.cos(lng * 0.08) * 8 + 10),
    );
    const recommendation = getRechargeRecommendation(simulatedSlope, rainSummary);
    const points = generateGroundwaterPoints(
      lat,
      lng,
      simulatedSlope,
      recommendation,
      rainSummary,
    );
    const zones = generateSlopeZones(lat, lng, simulatedSlope);
    const weatherText = rainSummary
      ? `\nRainfall period: ${rainSummary.period}\nAnnual precipitation: ${rainSummary.totalPrecipitation.toFixed(0)} mm\nRainy days: ${rainSummary.rainyDays}\nPeak month: ${rainSummary.peakMonth}\nRainy season: ${rainSummary.rainySeason}`
      : '\nRainfall summary is being fetched for this location.';
    const resultText =
      `✅ Pin placed at ${lat.toFixed(6)}, ${lng.toFixed(6)}\n` +
      `Detected slope: ${simulatedSlope.toFixed(2)}° (${recommendation.category})\n` +
      `Predicted groundwater charging points: ${points.length}\n` +
      `Groundwater suitability: ${recommendation.suitability}\n` +
      `Suggested recharge method: ${recommendation.method}\n` +
      `${recommendation.reason}` +
      weatherText;

    return {
      slope: simulatedSlope,
      recommendation,
      points,
      zones,
      resultText,
    };
  };

  const fetchWeatherArchive = async (lat, lng) => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/weather-archive?latitude=${lat}&longitude=${lng}`,
      );
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error || 'Unable to fetch rainfall data for this location.',
        );
      }
      const data = await response.json();
      setRainSummary(data);
      return data;
    } catch (error) {
      setRainSummary(null);
      setWeatherError(error.message || 'Failed to load rainfall information.');
      return null;
    } finally {
      setWeatherLoading(false);
    }
  };

  const checkLocationAreaType = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10`,
      );
      if (!response.ok) {
        return { isLand: true, isSuitableArea: false, areaType: 'unknown' };
      }
      const data = await response.json();
      const category = (data?.category || '').toLowerCase();
      const type = (data?.type || '').toLowerCase();
      const address = data?.address || {};
      const displayText = [data?.class, category, type, address.landuse, address.natural, address.farm, address.leisure, address.place, address.suburb, address.village, address.town, address.city, address.wood, address.forest, address.field, data?.display_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const waterTypes = [
        'ocean',
        'sea',
        'bay',
        'strait',
        'reservoir',
        'river',
        'lake',
        'canal',
        'marina',
        'pond',
        'water',
      ];
      const farmTypes = [
        'farmland',
        'farm',
        'agriculture',
        'orchard',
        'vineyard',
        'meadow',
        'pasture',
        'field',
        'plantation',
        'cropland',
        'farmyard',
        'grazing',
      ];
      const forestTypes = [
        'wood',
        'forest',
        'grassland',
        'heath',
        'moor',
        'shrub',
        'scrub',
        'tree',
        'woodland',
      ];

      if (
        category === 'water' ||
        waterTypes.includes(type) ||
        address.water ||
        displayText.includes('water') ||
        displayText.includes('sea')
      ) {
        return { isLand: false, isSuitableArea: false, areaType: 'water' };
      }

      const isForest =
        forestTypes.includes(type) ||
        forestTypes.includes(data?.class) ||
        forestTypes.some((token) => displayText.includes(token));
      const isFarm =
        farmTypes.includes(type) ||
        farmTypes.includes(data?.class) ||
        farmTypes.some((token) => displayText.includes(token));

      if (isForest) {
        return { isLand: true, isSuitableArea: true, areaType: 'forest' };
      }
      if (isFarm) {
        return { isLand: true, isSuitableArea: true, areaType: 'farm' };
      }

      return { isLand: true, isSuitableArea: false, areaType: type || category || 'other' };
    } catch (err) {
      console.warn('Location area check failed:', err);
      return { isLand: true, isSuitableArea: false, areaType: 'unknown' };
    }
  };

  const analyzeLocation = async (lat, lng, source = "map") => {
    if (isNaN(lat) || isNaN(lng)) {
      setResult("Please choose a valid location.");
      return null;
    }

    const areaContext = await checkLocationAreaType(lat, lng);
    if (!areaContext.isLand) {
      const message =
        "Selected location appears to be water or ocean. Please choose a land location.";
      setResult(message);
      setLocationError(message);
      return null;
    }

    setSearchLat(lat.toFixed(6));
    setSearchLng(lng.toFixed(6));
    setSelectedLocation({ lat, lng });
    setLocationError(null);

    if (source === "current") {
      setCurrentLocation({ lat, lng });
    }

    if (mapInstance) {
      mapInstance.flyTo([lat, lng], 13, { duration: 0.9 });
    }

    setRainSummary(null);
    setWeatherError(null);
    setReportUrl(null); // Clear old report when starting new analysis

    const analysis = getLocationAnalysis(lat, lng);
    setSlopeValue(analysis.slope);
    setGroundwaterPoints(analysis.points);
    setSlopeZones(analysis.zones);
    setResult(analysis.resultText);

    const weather = await fetchWeatherArchive(lat, lng);
    if (weather) {
      const updatedAnalysis = getLocationAnalysis(lat, lng, weather);
      setSlopeValue(updatedAnalysis.slope);
      setGroundwaterPoints(updatedAnalysis.points);
      setSlopeZones(updatedAnalysis.zones);
      setResult(updatedAnalysis.resultText);
    }

    return analysis;
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser.";
      setLocationError(errorMsg);
      setResult(errorMsg);
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setResult("Detecting current location...");

    const handleGeoError = (error) => {
      let errorMsg;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg =
            "Location access was denied. Please allow location permissions and try again.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg =
            "Unable to determine current location at this time. Please try again later.";
          break;
        case error.TIMEOUT:
          errorMsg =
            "Location request timed out. Please try again or enter coordinates manually.";
          break;
        default:
          errorMsg = `Unable to determine current location: ${error.message}`;
      }
      setLocationError(errorMsg);
      setResult(errorMsg);
      setIsLocating(false);
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const analysis = await analyzeLocation(lat, lng, "current");
        if (analysis) {
          setLocationError(null);
        }
        setIsLocating(false);
      },
      handleGeoError,
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      },
    );
  };

  const generateGroundwaterPoints = (
    lat,
    lng,
    slope,
    recommendation,
    rainSummary = null,
  ) => {
    const points = [];
    const baseCount = slope < 5 ? 5 : slope < 10 ? 4 : slope < 15 ? 3 : 2;
    const rainFactor = rainSummary
      ? Math.max(
          0.75,
          Math.min(
            1.4,
            0.8 + rainSummary.totalPrecipitation / 1200,
          ),
        )
      : 1;
    const pointCount = Math.max(1, Math.round(baseCount * rainFactor));
    const baseDistance = slope < 5 ? 0.0032 : slope < 10 ? 0.0024 : slope < 15 ? 0.0018 : 0.0012;
    const downhillDirection = (lat + lng) % 2 >= 0 ? 1 : -1;

    const offsets = [
      { lat: baseDistance * downhillDirection, lng: 0 },
      { lat: 0, lng: baseDistance * downhillDirection },
      { lat: -baseDistance * downhillDirection, lng: 0 },
      { lat: 0, lng: -baseDistance * downhillDirection },
      { lat: baseDistance * downhillDirection * 0.8, lng: baseDistance * 0.8 },
    ];

    for (let i = 0; i < pointCount; i += 1) {
      const offset = offsets[i % offsets.length];
      points.push({
        coords: [lat + offset.lat, lng + offset.lng],
        slope: slope.toFixed(2),
        suitability: recommendation.suitability,
        method: recommendation.method,
        reason: recommendation.reason,
      });
    }

    return points;
  };

  const generateSlopeZones = (lat, lng, slope) => {
    const zones = [];
    const radius = 500;

    if (slope < 5) {
      zones.push({
        center: [lat, lng],
        radius,
        color: "#2ecc71",
        label: "Flat Terrain",
        slopeRange: "0-5°",
      });
    } else if (slope < 10) {
      zones.push({
        center: [lat, lng],
        radius,
        color: "#f1c40f",
        label: "Gentle Slope",
        slopeRange: "5-10°",
      });
    } else if (slope < 20) {
      zones.push({
        center: [lat, lng],
        radius,
        color: "#e67e22",
        label: "Moderate Slope",
        slopeRange: "10-20°",
      });
    } else {
      zones.push({
        center: [lat, lng],
        radius,
        color: "#e74c3c",
        label: "Steep Slope",
        slopeRange: ">20°",
      });
    }

    return zones;
  };

  const sendReport = async ({
    email,
    imageFile,
    location,
    slope,
    suitability,
    points,
    analysisText,
    rainSummary,
  }) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("locationLat", location.lat.toString());
    formData.append("locationLng", location.lng.toString());
    formData.append("slopeValue", slope.toString());
    formData.append("suitability", suitability);
    formData.append("points", JSON.stringify(points));
    formData.append("analysisText", analysisText);
    if (rainSummary) {
      formData.append("rainSummary", JSON.stringify(rainSummary));
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/report`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: "Report request failed." }));
      throw new Error(errorBody.error || errorBody.details || "Report request failed.");
    }

    return response.json();
  };

  const handleGeneratePdfReport = async () => {
    if (
      !selectedLocation ||
      slopeValue === null ||
      groundwaterPoints.length === 0
    ) {
      setResult(
        "Please analyze a location first before generating the PDF report.",
      );
      setReportMessage("");
      return;
    }

    setIsGeneratingReport(true);
    setReportMessage("⏳ Generating your PDF report...");
    setReportUrl(null);

    try {
      const recommendedSuitability =
        groundwaterPoints[0]?.suitability || "Unknown";
      const analysisText = result || "Slope analysis report generated by SlopeSense.";

      const reportResponse = await sendReport({
        email: userEmail || "",
        imageFile: null,
        location: selectedLocation,
        slope: slopeValue,
        suitability: recommendedSuitability,
        points: groundwaterPoints,
        analysisText,
        rainSummary,
      });

      setReportUrl(reportResponse.pdfUrl);
      const statusMsg = "Your Report Successfully Generated.";
      setResult((prev) => (prev ? `${prev}\n\n${statusMsg}` : statusMsg));
      setReportMessage(statusMsg);
    } catch (error) {
      setReportUrl(null);
      const errorMsg = `Report generation failed: ${error.message}`;
      setResult((prev) => (prev ? `${prev}\n\n${errorMsg}` : errorMsg));
      setReportMessage(errorMsg);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const saveCurrentAnalysisToHistory = () => {
    if (!selectedLocation || slopeValue === null || !result) {
      setFeedbackStatus("Analyze a location first to save it to history.");
      return;
    }

    const newRecord = {
      id: `${selectedLocation.lat}-${selectedLocation.lng}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      location: {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
      slope: slopeValue.toFixed(2),
      points: groundwaterPoints.length,
      rainfall: rainSummary ? `${rainSummary.totalPrecipitation.toFixed(0)} mm` : "Unavailable",
      summary: result,
    };

    setHistoryRecords((prev) => [newRecord, ...prev].slice(0, 20));
    setFeedbackStatus("✅ Analysis saved to history.");
  };

  const clearHistory = () => {
    setHistoryRecords([]);
    localStorage.removeItem("slopeSenseHistory");
    setFeedbackStatus("History cleared.");
  };

  const submitFeedback = (event) => {
    event.preventDefault();
    if (!feedbackText.trim()) {
      setFeedbackStatus("Please enter your feedback before submitting.");
      return;
    }

    const savedFeedback = JSON.parse(
      localStorage.getItem("slopeSenseFeedbacks") || "[]",
    );
    savedFeedback.unshift({
      id: `fb-${Date.now()}`,
      email: userEmail,
      message: feedbackText.trim(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("slopeSenseFeedbacks", JSON.stringify(savedFeedback));
    setFeedbackText("");
    setFeedbackStatus("Thank you! Your feedback has been saved.");
  };

  const formatHistoryDate = (isoDate) =>
    new Date(isoDate).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCoordinateSearch = async (e) => {
    e.preventDefault();
    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(lat) || isNaN(lng)) {
      setResult("Please enter valid coordinates.");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setResult(
        "Invalid coordinates. Latitude must be -90 to 90 and longitude -180 to 180.",
      );
      return;
    }

    const analysis = await analyzeLocation(lat, lng, "search");
    if (!analysis) {
      return;
    }

    if (userEmail && analysis) {
      const suitability = analysis.recommendation.suitability;
      const points = analysis.points;
      const analysisText = `Detected slope ${analysis.slope.toFixed(2)}° with ${suitability} groundwater recharge suitability.`;

      try {
        const reportResponse = await sendReport({
          email: userEmail,
          imageFile: null,
          location: { lat, lng },
          slope: analysis.slope,
          suitability,
          points,
          analysisText,
        });

        setReportUrl(reportResponse.pdfUrl || null);
        setResult((current) => `${current}\n\n📧 Report sent to ${userEmail}.`);
      } catch (error) {
        setReportUrl(null);
        setResult(
          (current) =>
            `${current}\n\n⚠️ Report generation failed: ${error.message}`,
        );
      }
    }
  };

  if (view === "login") {
    return (
      <div className="App auth-screen">
        <header className="App-header">
          <h1>Welcome to SlopeSense</h1>
          <p>
            Sign in to access advanced terrain analysis and reporting features.
          </p>
        </header>
        <main className="auth-main">
          <div className="auth-box">
            <h2>Login</h2>
            {authError && <div className="auth-error">{authError}</div>}
            <form onSubmit={handleLogin} className="auth-form">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@mail.com"
              />
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button type="submit" className="auth-btn">
                Login
              </button>
            </form>
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setAuthError("");
                  setView("register");
                }}
              >
                Register now
              </button>
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (view === "register") {
    return (
      <div className="App auth-screen">
        <header className="App-header">
          <h1>Join SlopeSense</h1>
          <p>
            Create your account to unlock comprehensive terrain analysis and
            automated reporting.
          </p>
        </header>
        <main className="auth-main">
          <div className="auth-box">
            <h2>Register</h2>
            {authError && <div className="auth-error">{authError}</div>}
            <form onSubmit={handleRegister} className="auth-form">
              <label>Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="your@mail.com"
              />
              <label>Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Create password"
              />
              <label>Confirm Password</label>
              <input
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="Repeat password"
              />
              <button type="submit" className="auth-btn">
                Register
              </button>
            </form>
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setAuthError("");
                  setView("login");
                }}
              >
                Login here
              </button>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header app-main-header">
        <div>
          <h1>SlopeSense</h1>
          <p>Smart Terrain Analysis for Sustainable Water Management</p>
        </div>
        <div className="header-meta">
          <span>
            Welcome, <strong>{userEmail}</strong>
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>
      <main className="dashboard-grid">
        <div className="main-content">
          <div className="summary-cards">
            <div className="summary-card">
              <span>Selected Location</span>
            <strong>
              {selectedLocation
                ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                : "Choose a point on the map"}
            </strong>
          </div>
          <div className="summary-card">
            <span>Detected Slope</span>
            <strong>
              {slopeValue !== null
                ? `${slopeValue.toFixed(2)}°`
                : "Awaiting analysis"}
            </strong>
          </div>
          <div className="summary-card">
            <span>Charging Points</span>
            <strong>{groundwaterPoints.length}</strong>
          </div>
          <div className="summary-card">
            <span>Rainfall</span>
            <strong>
              {weatherLoading
                ? 'Loading...'
                : rainSummary
                ? `${rainSummary.totalPrecipitation.toFixed(0)} mm`
                : 'No data'}
            </strong>
          </div>
        </div>
        <div className="search-section">
          <h2>Location Search</h2>
          <p className="instruction-text">
            Enter coordinates manually, use your current location, or drop a pin
            by clicking on the map to predict slope instantly.
          </p>
          <form onSubmit={handleCoordinateSearch} className="search-form">
            <div className="input-group">
              <div className="coordinate-input">
                <label htmlFor="search-lat">Latitude:</label>
                <input
                  id="search-lat"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={searchLat}
                  onChange={(e) => setSearchLat(e.target.value)}
                  placeholder="e.g., 28.61"
                  className="coord-input"
                />
              </div>
              <div className="coordinate-input">
                <label htmlFor="search-lng">Longitude:</label>
                <input
                  id="search-lng"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={searchLng}
                  onChange={(e) => setSearchLng(e.target.value)}
                  placeholder="e.g., 77.23"
                  className="coord-input"
                />
              </div>
              <button type="submit" className="search-btn">
                🔍 Analyze Location
              </button>
              <button
                type="button"
                className="location-btn"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
              >
                {isLocating ? "⏳ Locating..." : "📍 Current Location"}
              </button>
            </div>
          </form>
          {locationError && (
            <p
              style={{
                color: "var(--error)",
                marginTop: "12px",
                fontSize: "0.875rem",
              }}
            >
              ⚠️ {locationError}
            </p>
          )}
        </div>

        <div className="map-container">
          <div className="map-header">
            <div>
              <h2>Interactive Terrain Map</h2>
              <p className="map-instruction">
                Click anywhere on the map to drop a pin and instantly predict
                slope.
              </p>
            </div>
            <div className="map-legend">
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#2ecc71" }}
                ></span>{" "}
                Flat (0-5°)
              </span>
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#f1c40f" }}
                ></span>{" "}
                Gentle (5-10°)
              </span>
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#e67e22" }}
                ></span>{" "}
                Moderate (10-20°)
              </span>
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#e74c3c" }}
                ></span>{" "}
                Steep (20°)
              </span>
              <span className="legend-item">
                <span className="legend-marker" style={{ color: "#e74c3c" }}>
                  📍
                </span>{" "}
                Selected Location
              </span>
              <span className="legend-item">
                <span className="legend-marker" style={{ color: "#3498db" }}>
                  💧
                </span>{" "}
                Water Charging Point
              </span>
            </div>
          </div>
          <MapContainer
            center={[28.61, 77.23]}
            zoom={10}
            style={{ height: "450px", width: "100%" }}
            whenCreated={setMapInstance}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="&copy; Esri"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Terrain">
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenTopoMap"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <SlopeZones slopeData={slopeZones} />
            <GroundwaterPoints points={groundwaterPoints} />
            <LocationMarker
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onPinSelect={analyzeLocation}
            />
            <CurrentLocationMarker currentLocation={currentLocation} />
          </MapContainer>

          {selectedLocation && (
            <div className="location-info">
              <p>
                📍 Selected Location:{" "}
                <strong>
                  Lat {selectedLocation.lat.toFixed(6)}, Lng{" "}
                  {selectedLocation.lng.toFixed(6)}
                </strong>
              </p>
              {slopeValue !== null && (
                <p>
                  📈 Detected Slope: <strong>{slopeValue.toFixed(2)}°</strong>
                </p>
              )}
            </div>
          )}
        </div>

        {result && (
          <div className="result">
            <h2>📊 Analysis Results</h2>
            <div className="result-content">
              <p>{result}</p>
            </div>
            {weatherError && (
              <p
                style={{
                  color: 'var(--error)',
                  marginTop: '12px',
                  fontSize: '0.95rem',
                }}
              >
                ⚠️ {weatherError}
              </p>
            )}
            {rainSummary && (
              <div className="weather-summary">
                <h3>🌧 Rainfall Summary</h3>
                <p>
                  Period: <strong>{rainSummary.period}</strong>
                </p>
                <p>
                  Total rainfall: <strong>{rainSummary.totalPrecipitation.toFixed(0)} mm</strong>
                </p>
                <p>
                  Rainy days: <strong>{rainSummary.rainyDays}</strong>
                </p>
                <p>
                  Peak month: <strong>{rainSummary.peakMonth}</strong>
                </p>
                <p>
                  Rainy season: <strong>{rainSummary.rainySeason}</strong>
                </p>
              </div>
            )}
            {reportMessage && (
              <div className="report-status">
                <p>{reportMessage}</p>
              </div>
            )}
            <div className="report-workflow">
              {reportSteps.map((step, index) => (
                <div key={index} className={`report-step ${step.done ? 'done' : ''}`}>
                  <span className="step-index">{index + 1}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
            {groundwaterPoints.length > 0 && (
              <div className="waterpoints-list">
                <h3>💧 Identified Groundwater Charging Points</h3>
                <p className="waterpoints-count">
                  Total Points Found:{" "}
                  <strong>{groundwaterPoints.length}</strong>
                </p>

                <div className="export-buttons">
                  <button
                    onClick={handleGeneratePdfReport}
                    className="export-btn download-btn-small"
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? "⏳ Generating PDF..." : "📝 Generate PDF Report"}
                  </button>
                </div>

                {reportUrl && (
                  <div className="report-download" style={{ marginBottom: '20px' }}>
                    <a
                      href={reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="download-btn"
                    >
                      📄 Download Analysis Report (PDF)
                    </a>
                  </div>
                )}

                <div className="points-container">
                  {groundwaterPoints.map((point, idx) => (
                    <div key={idx} className="point-card">
                      <div className="point-header">
                        <h4>Point {idx + 1}</h4>
                        <span
                          className={`suitability-badge suitability-${point.suitability.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {point.suitability}
                        </span>
                      </div>
                      <div className="point-details">
                        <div className="detail-row">
                          <label>Latitude:</label>
                          <span className="coordinate">
                            {point.coords[0].toFixed(6)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <label>Longitude:</label>
                          <span className="coordinate">
                            {point.coords[1].toFixed(6)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <label>GPS Format:</label>
                          <span className="coordinate">
                            {point.coords[0].toFixed(6)},{" "}
                            {point.coords[1].toFixed(6)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <label>Slope:</label>
                          <span>{point.slope}°</span>
                        </div>
                        <div className="detail-row">
                          <label>Method:</label>
                          <span>{point.method}</span>
                        </div>
                        <div className="detail-row">
                          <label>Reason:</label>
                          <span>{point.reason}</span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${point.coords[0].toFixed(6)}, ${point.coords[1].toFixed(6)}`,
                          )
                        }
                        className="copy-coord-btn"
                        title="Copy coordinates"
                      >
                        📍 Copy Coordinates
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
        <aside className="sidebar">
          <div className="sidebar-panel-header">
            <h2>Quick Tools</h2>
            <p>Save history, view profile, or send feedback.</p>
          </div>
          <div className="sidebar-tabs">
            <button
              type="button"
              className={sidebarTab === "history" ? "sidebar-tab active" : "sidebar-tab"}
              onClick={() => setSidebarTab("history")}
            >
              History
            </button>
            <button
              type="button"
              className={sidebarTab === "profile" ? "sidebar-tab active" : "sidebar-tab"}
              onClick={() => setSidebarTab("profile")}
            >
              Profile
            </button>
            <button
              type="button"
              className={sidebarTab === "feedback" ? "sidebar-tab active" : "sidebar-tab"}
              onClick={() => setSidebarTab("feedback")}
            >
              Feedback
            </button>
          </div>

          <div className="sidebar-content">
            {sidebarTab === "history" && (
              <div className="sidebar-section">
                <div className="sidebar-section-header">
                  <h3>Saved Analyses</h3>
                  <button
                    type="button"
                    className="sidebar-action-btn"
                    onClick={saveCurrentAnalysisToHistory}
                  >
                    Save Current
                  </button>
                </div>
                {historyRecords.length === 0 ? (
                  <p className="sidebar-empty">
                    No history saved yet. Analyze a location and save it here.
                  </p>
                ) : (
                  <div className="history-list">
                    {historyRecords.map((record) => (
                      <div key={record.id} className="history-card">
                        <div className="history-card-header">
                          <strong>{formatHistoryDate(record.createdAt)}</strong>
                          <span>{record.points} points</span>
                        </div>
                        <p>
                          Lat {record.location.lat.toFixed(4)}, Lng {record.location.lng.toFixed(4)}
                        </p>
                        <p>Slope: {record.slope}°</p>
                        <p>Rainfall: {record.rainfall}</p>
                      </div>
                    ))}
                  </div>
                )}
                {historyRecords.length > 0 && (
                  <button
                    type="button"
                    className="sidebar-clear-btn"
                    onClick={clearHistory}
                  >
                    Clear History
                  </button>
                )}
              </div>
            )}

            {sidebarTab === "profile" && (
              <div className="sidebar-section">
                <h3>My Profile</h3>
                <p>
                  <strong>Email:</strong> {userEmail}
                </p>
                <p>
                  <strong>Saved analyses:</strong> {historyRecords.length}
                </p>
                <p>
                  <strong>Current plan:</strong> Local browser profile
                </p>
                <p className="sidebar-note">
                  Your profile settings and saved history are kept in your browser.
                </p>
              </div>
            )}

            {sidebarTab === "feedback" && (
              <div className="sidebar-section">
                <h3>Send Feedback</h3>
                <p className="sidebar-note">
                  Help improve SlopeSense by sharing your experience.
                </p>
                <form onSubmit={submitFeedback} className="feedback-form">
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Describe any issue or suggestion..."
                    rows={6}
                  />
                  <button type="submit" className="sidebar-action-btn">
                    Submit Feedback
                  </button>
                </form>
                {feedbackStatus && (
                  <p className="feedback-status">{feedbackStatus}</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
