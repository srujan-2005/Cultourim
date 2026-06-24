import React, { useState, useRef, useEffect } from 'react';
import { Plane, Car, Bus, Train, Download, PlusCircle, X, MapPin, Play, Pause } from "lucide-react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import html2canvas from 'html2canvas';
const TravelRouteAnimator = () => {
    // States for route information
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [waypoints, setWaypoints] = useState([]);
    const [stopsList, setStopsList] = useState([]);
    const [newStop, setNewStop] = useState('');
    const [currentStep, setCurrentStep] = useState(1); // 1: Destinations, 2: Transport, 3: Animation
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [routeSegments, setRouteSegments] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    const canvasRef = useRef(null);
    const mapRef = useRef(null);
    const animationRef = useRef(null);

    // Transport options
    const transportOptions = {
        plane: {
            icon: <Plane size={24} />,
            color: "#3b82f6",
            speed: 2,
            pathType: "arc"
        },
        car: {
            icon: <Car size={24} />,
            color: "#ef4444",
            speed: 1,
            pathType: "road"
        },
        bus: {
            icon: <Bus size={24} />,
            color: "#10b981",
            speed: 0.8,
            pathType: "road"
        },
        train: {
            icon: <Train size={24} />,
            color: "#8b5cf6",
            speed: 1.5,
            pathType: "track"
        }
    };

    // Add a new stop
    const handleAddStop = () => {
        if (newStop.trim() !== '') {
            setStopsList([...stopsList, { name: newStop.trim(), transport: null }]);
            setNewStop('');
        }
    };

    // Remove a stop
    const handleRemoveStop = (index) => {
        const updatedStops = [...stopsList];
        updatedStops.splice(index, 1);
        setStopsList(updatedStops);
    };

    // Update transport mode for a specific segment
    const updateSegmentTransport = (index, mode) => {
        const updatedSegments = [...routeSegments];
        updatedSegments[index].transport = mode;
        setRouteSegments(updatedSegments);
    };

    // Move to the transport selection step
    const handleContinueToTransport = () => {
        // Create route segments from stops
        const allPoints = [
            { name: startPoint, isMainPoint: true },
            ...stopsList.map(stop => ({ name: stop.name, isMainPoint: false })),
            { name: endPoint, isMainPoint: true }
        ];

        const segments = [];
        for (let i = 0; i < allPoints.length - 1; i++) {
            segments.push({
                start: allPoints[i].name,
                end: allPoints[i + 1].name,
                transport: null,
                startIsMain: allPoints[i].isMainPoint,
                endIsMain: allPoints[i + 1].isMainPoint
            });
        }

        setRouteSegments(segments);
        setCurrentStep(2);
    };

    // Check if all segments have transport
    const allSegmentsHaveTransport = () => {
        return routeSegments.every(segment => segment.transport !== null);
    };

    // Start the animation
    const startAnimation = () => {
        setCurrentStep(3);
        initMap();
        setTimeout(() => {
            setIsAnimating(true);
        }, 1000);
    };


    // Replace the initMap function
    const initMap = () => {
        if (mapRef.current) return;


        setTimeout(() => {
            try {
                // Create Leaflet map
                mapRef.current = L.map('map-container').setView([30, 0], 2);

                // Add OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(mapRef.current);

                // Geocode locations and update map
                geocodeLocations().then(() => {
                    setMapLoaded(true);
                });
            } catch (err) {
                console.error('Error initializing map:', err);
            }
        }, 500);
        // Check if map container exists first
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.error('Map container element not found');
            return;
        }

    };

    // Add this geocoding function
    // Add this to your imports


    // Initialize API keys (add to the top of your component)
    const OPENWEATHER_API_KEY = process.env.VITE_OPENWEATHER_API_KEY || 'your_api_key_here'; // Add to .env.local
    const geocodeLocations = async () => {
        const allLocations = [startPoint, ...stopsList.map(stop => stop.name), endPoint];
        const waypoints = [];

        // Process each location
        for (let i = 0; i < allLocations.length; i++) {
            const location = allLocations[i];
            try {
                // Use OpenWeather Geocoding API
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
                );

                const data = await response.json();

                if (data && data.length > 0) {
                    // Get coordinates from the result - using proper property names
                    const { lat, lon } = data[0];

                    waypoints.push({
                        name: location,
                        lat: lat,
                        lng: lon  // Note: we're mapping OpenWeather's 'lon' to our 'lng'
                    });

                    // Add marker to map
                    if (mapRef.current) {
                        const isStartOrEnd = location === startPoint || location === endPoint;
                        const color = isStartOrEnd ? (location === startPoint ? "#22c55e" : "#ef4444") : "#f59e0b";

                        const marker = L.circleMarker([lat, lon], {  // Use 'lon' here
                            radius: 8,
                            fillColor: color,
                            color: "#fff",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).addTo(mapRef.current)
                            .bindTooltip(location);
                    }
                } else {
                    // Fallback to Mapbox if OpenWeather returns no results
                    try {
                        const mapboxResponse = await fetch(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`
                        );

                        const mapboxData = await mapboxResponse.json();

                        if (mapboxData.features && mapboxData.features.length > 0) {
                            // Get coordinates from the first result
                            const [lng, lat] = mapboxData.features[0].center;

                            waypoints.push({
                                name: location,
                                lat: lat,
                                lng: lng
                            });

                            // Add marker to map
                            if (mapRef.current) {
                                const isStartOrEnd = location === startPoint || location === endPoint;
                                const color = isStartOrEnd ? (location === startPoint ? "#22c55e" : "#ef4444") : "#f59e0b";

                                L.circleMarker([lat, lng], {
                                    radius: 8,
                                    fillColor: color,
                                    color: "#fff",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                }).addTo(mapRef.current)
                                    .bindTooltip(location);
                            }
                        } else {
                            throw new Error("Both geocoding services failed");
                        }
                    } catch (err) {
                        // Final fallback to deterministic coordinates if both geocoding services fail
                        const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const lat = -80 + (seed % 160);
                        const lng = -170 + (seed % 340);

                        waypoints.push({
                            name: location,
                            lat: lat,
                            lng: lng
                        });

                        // Add fallback marker
                        if (mapRef.current) {
                            L.circleMarker([lat, lng], {
                                radius: 8,
                                fillColor: "#999",
                                color: "#fff",
                                weight: 1,
                                opacity: 0.7,
                                fillOpacity: 0.5
                            }).addTo(mapRef.current)
                                .bindTooltip(`${location} (approximate)`);
                        }
                    }
                }
            } catch (err) {
                console.error(`Error geocoding ${location}:`, err);
                // Add fallback on error
                const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const lat = -80 + (seed % 160);
                const lng = -170 + (seed % 340);

                waypoints.push({
                    name: location,
                    lat: lat,
                    lng: lng
                });

                // Add fallback marker
                if (mapRef.current) {
                    L.circleMarker([lat, lng], {
                        radius: 8,
                        fillColor: "#999",
                        color: "#fff",
                        weight: 1,
                        opacity: 0.7,
                        fillOpacity: 0.5
                    }).addTo(mapRef.current)
                        .bindTooltip(`${location} (approximate)`);
                }
            }
        }

        // Store waypoints and fit map to bounds
        setWaypoints(waypoints);

        if (mapRef.current && waypoints.length > 0) {
            const bounds = waypoints.map(wp => [wp.lat, wp.lng]);
            mapRef.current.fitBounds(bounds);
        }

        return waypoints;
    };

    // Reset animation
    const handleReset = () => {
        setStartPoint('');
        setEndPoint('');
        setStopsList([]);
        setRouteSegments([]);
        setCurrentStep(1);
        setIsAnimating(false);
        setAnimationProgress(0);
        setIsPaused(false);
        setMapLoaded(false);
    };

    // Toggle animation pause
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Download animation as video
    const handleDownload = () => {
        if (!mapRef.current) return;

        // Use html2canvas to capture the map (add as dependency)
        // import html2canvas from 'html2canvas';

        const mapElement = document.getElementById('map-container');

        // Create a recorder setup
        const startRecording = async () => {
            try {
                // Reset animation
                setAnimationProgress(0);
                setIsPaused(false);

                // Prepare recording chunks
                const chunks = [];
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = mapElement.offsetWidth;
                canvas.height = mapElement.offsetHeight;

                // Create a stream from the canvas
                const stream = canvas.captureStream(30);
                const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

                recorder.ondataavailable = e => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                recorder.onstop = () => {
                    // Create downloadable blob
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);

                    // Create download link
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `journey-${startPoint}-to-${endPoint}.webm`;
                    document.body.appendChild(a);
                    a.click();

                    // Cleanup
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 100);
                };

                // Start recording
                recorder.start();

                // Animation frame loop for recording
                let frameCount = 0;
                const totalFrames = 180; // 6 seconds at 30fps

                const captureFrame = async () => {
                    // Capture the map as an image
                    const mapImage = await html2canvas(mapElement);

                    // Draw to recording canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

                    frameCount++;

                    // Progress the animation a bit each frame
                    const animationStep = routeSegments.length / totalFrames;
                    setAnimationProgress(frameCount * animationStep);

                    if (frameCount < totalFrames) {
                        requestAnimationFrame(captureFrame);
                    } else {
                        // End recording after animation completes
                        recorder.stop();
                        setAnimationProgress(0); // Reset animation
                    }
                };

                // Start capturing frames
                captureFrame();

            } catch (error) {
                console.error("Recording failed:", error);
                alert("Could not create video. Try downloading a screenshot instead.");
            }
        };

        startRecording();
    };

    // Animation effect with real map simulation
    useEffect(() => {
        if (!isAnimating || !mapLoaded || isPaused || waypoints.length < 2) return;

        // Clear previous animations
        if (mapRef.current) {
            // Remove previous polylines
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Polyline && layer.options.className === 'route-line') {
                    mapRef.current.removeLayer(layer);
                }
            });
        }

        // Generate route paths
        const routes = [];
        for (let i = 0; i < routeSegments.length; i++) {
            const start = waypoints.find(wp => wp.name === routeSegments[i].start);
            const end = waypoints.find(wp => wp.name === routeSegments[i].end);

            if (!start || !end) continue;

            const transport = routeSegments[i].transport;
            const color = transportOptions[transport].color;

            // Determine path based on transport type
            let pathPoints = [];

            if (transport === 'plane') {
                // Create arc for planes
                const latlngs = [
                    [start.lat, start.lng],
                    [end.lat, end.lng]
                ];

                // Add arc points
                const pointsCount = 30;
                for (let j = 0; j <= pointsCount; j++) {
                    const t = j / pointsCount;

                    // Create a curved path by adding altitude
                    const p = L.latLng(
                        start.lat + t * (end.lat - start.lat),
                        start.lng + t * (end.lng - start.lng)
                    );

                    // Add curvature based on distance
                    const dist = start.lat - end.lat;
                    const curveOffset = Math.sin(Math.PI * t) * Math.min(Math.abs(dist) * 0.2, 15);

                    pathPoints.push([p.lat + curveOffset, p.lng]);
                }
            } else {
                // For ground transport, use waypoints or request directions from a service
                pathPoints = [[start.lat, start.lng], [end.lat, end.lng]];
            }

            routes.push({
                start,
                end,
                transport,
                pathPoints,
                color
            });
        }

        // Animate routes
        let lastTimestamp = 0;
        let animFrameId;

        const animate = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;

            if (elapsed > 1) { // Update every 30ms
                lastTimestamp = timestamp;

                // Draw route lines based on current progress
                for (let i = 0; i < routes.length; i++) {
                    const route = routes[i];
                    const transportType = route.transport;
                    const color = route.color;

                    // Determine how much of this route to render
                    const segmentProgressStart = i === 0 ? 0 : routes.slice(0, i).reduce((sum, r) => sum + 1, 0);
                    const currentSegmentProgress = Math.max(0, Math.min(1, animationProgress - segmentProgressStart));

                    if (currentSegmentProgress <= 0) continue;

                    // Create or update polyline
                    const pointsToDraw = Math.ceil(route.pathPoints.length * currentSegmentProgress);

                    if (pointsToDraw > 0) {
                        const lineId = `route-${i}`;

                        // Check if line exists
                        let line = mapRef.current._layers ? Object.values(mapRef.current._layers)
                            .find(l => l._leaflet_id === lineId) : null;

                        if (!line) {
                            // Create new line
                            const dashPattern = transportType === 'train' ? [6, 3] :
                                transportType === 'plane' ? [4, 4] : [];

                            line = L.polyline(route.pathPoints.slice(0, pointsToDraw), {
                                color: color,
                                weight: transportType === 'plane' ? 2 : 3,
                                dashArray: dashPattern.length ? dashPattern.join(',') : null,
                                className: 'route-line',
                                _leaflet_id: lineId
                            }).addTo(mapRef.current);
                        } else {
                            // Update existing line
                            line.setLatLngs(route.pathPoints.slice(0, pointsToDraw));
                        }

                        // Add vehicle marker for current segment
                        if (currentSegmentProgress > 0 && currentSegmentProgress < 1) {
                            const vehiclePos = Math.floor(route.pathPoints.length * currentSegmentProgress);

                            if (vehiclePos > 0 && vehiclePos < route.pathPoints.length) {
                                // Remove old vehicle marker
                                mapRef.current.eachLayer((layer) => {
                                    if (layer.options && layer.options.className === 'vehicle-marker') {
                                        mapRef.current.removeLayer(layer);
                                    }
                                });

                                // Add new vehicle marker
                            }
                        }
                    }
                }

                // Increment animation progress
                if (animationProgress < routes.length) {
                    // Speed based on current segment's transport
                    const currentSegmentIndex = Math.min(Math.floor(animationProgress), routes.length - 1);
                    const transportType = routes[currentSegmentIndex].transport;
                    const speed = transportOptions[transportType].speed / 100;
                    setAnimationProgress(prev => prev + speed);
                }
            }

            if (isAnimating && !isPaused) {
                animFrameId = requestAnimationFrame(animate);
            }
        };

        animFrameId = requestAnimationFrame(animate);

        return () => {
            if (animFrameId) {
                cancelAnimationFrame(animFrameId);
            }
        };
    }, [isAnimating, animationProgress, isPaused, mapLoaded, waypoints, routeSegments]);



    // Render step 1: Destinations input
    const renderDestinationsStep = () => (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <h3 className="text-lg font-pixel text-orange-300 mb-4">Route Details</h3>

            <div className="mb-4">
                <label className="block text-xs font-pixel text-violet-300 mb-2">
                    <MapPin size={14} className="inline mr-1" /> Starting Point
                </label>
                <input
                    type="text"
                    placeholder="Enter starting location"
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full p-2 bg-black/20 border border-orange-400/50 rounded-lg outline-none transition text-xs font-pixel text-orange-300"
                />
            </div>

            <div className="mb-4">
                <label className="block text-xs font-pixel text-violet-300 mb-2">
                    <MapPin size={14} className="inline mr-1" /> Destination
                </label>
                <input
                    type="text"
                    placeholder="Enter final destination"
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                    className="w-full p-2 bg-black/20 border border-orange-400/50 rounded-lg outline-none transition text-xs font-pixel text-orange-300"
                />
            </div>

            <div className="mb-6">
                <label className="block text-xs font-pixel text-violet-300 mb-2">
                    <MapPin size={14} className="inline mr-1" /> Stops Along the Way
                </label>

                <div className="flex mb-2">
                    <input
                        type="text"
                        placeholder="Add a stop (optional)"
                        value={newStop}
                        onChange={(e) => setNewStop(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddStop()}
                        className="flex-1 p-2 bg-black/20 border border-orange-400/50 rounded-l-lg outline-none transition text-xs font-pixel text-orange-300"
                    />
                    <button
                        onClick={handleAddStop}
                        className="px-3 py-2 bg-violet-500/50 hover:bg-violet-500/70 text-white rounded-r-lg transition"
                    >
                        <PlusCircle size={14} />
                    </button>
                </div>

                {stopsList.length > 0 && (
                    <div className="mb-2">
                        <p className="text-xs font-pixel text-orange-300 mb-2">Your stops:</p>
                        <div className="flex flex-wrap gap-2">
                            {stopsList.map((stop, index) => (
                                <div key={index} className="flex items-center bg-purple-500/20 rounded-full pl-3 pr-2 py-1">
                                    <span className="text-xs font-pixel text-orange-300 mr-2">{stop.name}</span>
                                    <button
                                        onClick={() => handleRemoveStop(index)}
                                        className="text-orange-300 hover:text-red-400"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleContinueToTransport}
                disabled={!startPoint || !endPoint}
                className={`w-full py-2 px-4 rounded-lg text-xs font-pixel
          ${!startPoint || !endPoint
                        ? 'bg-black/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500/70 to-orange-500/70 text-white hover:opacity-90'
                    }`}
            >
                Continue to Transport Selection
            </button>
        </div>
    );

    // Render step 2: Transport selection for each segment
    const renderTransportSelectionStep = () => (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <h3 className="text-lg font-pixel text-orange-300 mb-4">Select Transport Mode for Each Segment</h3>

            {routeSegments.map((segment, index) => (
                <div key={index} className="mb-6 p-3 bg-black/20 rounded-lg border border-violet-500/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-pixel text-violet-300">
                            <span className="text-green-300">{segment.start}</span>
                            <span className="mx-2">→</span>
                            <span className="text-orange-300">{segment.end}</span>
                        </div>

                        {segment.transport && (
                            <div className="flex items-center px-2 py-1 bg-black/30 rounded-lg">
                                <span className="ml-2 text-xs font-pixel" style={{ color: transportOptions[segment.transport].color }}>
                                {transportOptions[segment.transport].icon}
                                </span>
                                <span className="ml-2 text-xs font-pixel" style={{ color: transportOptions[segment.transport].color }}>
                                    {segment.transport.charAt(0).toUpperCase() + segment.transport.slice(1)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={() => updateSegmentTransport(index, 'plane')}
                            className={`p-2 ${segment.transport === 'plane' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-400/30'} 
              border rounded-lg transition flex flex-col items-center justify-center`}
                        >
                            <Plane size={20} className="text-blue-400 mb-1" />
                            <span className="text-xs font-pixel text-blue-300">Plane</span>
                        </button>

                        <button
                            onClick={() => updateSegmentTransport(index, 'car')}
                            className={`p-2 ${segment.transport === 'car' ? 'bg-red-500/30 border-red-400' : 'bg-black/20 border-red-400/30'} 
              border rounded-lg transition flex flex-col items-center justify-center`}
                        >
                            <Car size={20} className="text-red-400 mb-1" />
                            <span className="text-xs font-pixel text-red-300">Car</span>
                        </button>

                        <button
                            onClick={() => updateSegmentTransport(index, 'bus')}
                            className={`p-2 ${segment.transport === 'bus' ? 'bg-green-500/30 border-green-400' : 'bg-black/20 border-green-400/30'} 
              border rounded-lg transition flex flex-col items-center justify-center`}
                        >
                            <Bus size={20} className="text-green-400 mb-1" />
                            <span className="text-xs font-pixel text-green-300">Bus</span>
                        </button>

                        <button
                            onClick={() => updateSegmentTransport(index, 'train')}
                            className={`p-2 ${segment.transport === 'train' ? 'bg-purple-500/30 border-purple-400' : 'bg-black/20 border-purple-400/30'} 
              border rounded-lg transition flex flex-col items-center justify-center`}
                        >
                            <Train size={20} className="text-purple-400 mb-1" />
                            <span className="text-xs font-pixel text-purple-300">Train</span>
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex gap-3">
                <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-2 px-4 rounded-lg text-xs font-pixel bg-black/40 text-gray-300 hover:bg-black/60 transition"
                >
                    Back to Route Details
                </button>

                <button
                    onClick={startAnimation}
                    disabled={!allSegmentsHaveTransport()}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-pixel
            ${!allSegmentsHaveTransport()
                            ? 'bg-black/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-violet-500/70 to-orange-500/70 text-white hover:opacity-90'
                        }`}
                >
                    Start Animation
                </button>
            </div>
        </div>
    );

    // Render step 3: Animation with real map
    const renderAnimationStep = () => (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl w-3/4 p-4 border border-orange-500/30">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-pixel text-orange-300">
                    {startPoint} to {endPoint}
                </h3>

                <div className="flex gap-2">
                    <button
                        onClick={togglePause}
                        className="p-2 bg-black/40 hover:bg-purple-500/30 rounded-lg transition"
                    >
                        {isPaused ? <Play size={14} className="text-green-400" /> : <Pause size={14} className="text-orange-400" />}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="p-2 bg-black/40 hover:bg-blue-500/30 rounded-lg transition"
                        title="Download animation as video"
                    >
                        <Download size={14} className="text-blue-400" />
                    </button>

                    <button
                        onClick={handleReset}
                        className="p-2 bg-black/40 hover:bg-red-500/30 rounded-lg transition"
                    >
                        <X size={14} className="text-red-400" />
                    </button>
                </div>
            </div>

            <div className="relative bg-black/40 rounded-xl overflow-hidden" style={{ height: '300px' }}>
                <div
                    id="map-container"
                    className="absolute top-0 left-0 w-full h-full z-10" />

                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                            <p className="text-xs font-pixel text-orange-300">Loading map data...</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <div className="text-xs font-pixel text-violet-300 mb-2">Journey Progress:</div>
                <div className="w-full bg-black/40 rounded-full h-2.5">
                    <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-orange-500"
                        style={{ width: `${Math.min(100, (animationProgress / routeSegments.length) * 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-xs font-pixel text-violet-300 mb-2">Journey Segments:</div>
                <div className="space-y-2">
                    {routeSegments.map((segment, index) => {
                        // Calculate if this segment is active
                        const segmentStart = index;
                        const segmentEnd = index + 1;
                        const isActive = animationProgress >= segmentStart && animationProgress <= segmentEnd;
                        const isComplete = animationProgress > segmentEnd;

                        return (
                            <div
                                key={index}
                                className={`flex items-center p-2 rounded-lg ${isActive ? 'bg-black/40 border border-orange-500/50' : 'bg-black/20'}`}
                            >
                                <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                                <span className="mx-2 text-xs font-pixel text-gray-300">{segment.start}</span>
                                <span className="text-gray-400">→</span>

                                {segment.transport && (
                                    <div className="mx-2 text-white">
                                        {transportOptions[segment.transport].icon}
                                    </div>
                                )}

                                <span className="text-xs font-pixel text-gray-300">{segment.end}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed top-[17%] rounded-xl h-[85%] scrollbar-none left-[10%] w-[80%] bg-black/15 flex flex-col">
            <div className="mt-4 ml-[65%] h-[10%] text-3xl flex-end font-pixel bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
                <p className="flex flex-row">
                    HERITAGE HOP
                </p>
            </div>

            <div className="h-[85%] overflow-y-auto items-center scrollbar-none justify-center px-6 py-4 flex flex-col">
                {currentStep === 1 && renderDestinationsStep()}
                {currentStep === 2 && renderTransportSelectionStep()}
                {currentStep === 3 && renderAnimationStep()}
            </div>
        </div>
    );
};

export default TravelRouteAnimator;