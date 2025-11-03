import { Card } from './ui/card';
import { MapPin, Plane, ShoppingBag, Building, Cloud, Thermometer, Droplets, Wind, Gauge, Sun, Eye, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Enhanced type definitions for AccuWeather API with detailed data
interface WeatherData {
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  WeatherText: string;
  WeatherIcon: number; // Icon code for graphics
  RealFeelTemperature?: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  RelativeHumidity?: number;
  Wind?: {
    Speed: {
      Metric: {
        Value: number;
        Unit: string;
      };
    };
    Direction: {
      Degrees: number;
      Localized: string;
      English: string;
    };
  };
  WindGust?: {
    Speed: {
      Metric: {
        Value: number;
        Unit: string;
      };
    };
  };
  Pressure?: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  Visibility?: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  UVIndex?: number;
  CloudCover?: number;
  DewPoint?: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
}

// Helper function to get AccuWeather icon URL with fallback
const getAccuWeatherIcon = (iconCode: number) => {
  const paddedCode = iconCode.toString().padStart(2, '0');
  return `https://developer.accuweather.com/sites/default/files/${paddedCode}-s.png`;
};

// Helper function to check if it's currently night time (7pm - 7am)
const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7;
};

// Helper function to get weather icon component based on weather code and time of day
const getWeatherIconComponent = (iconCode: number) => {
  const isNight = isNightTime();
  
  // Clear/Sunny - Day codes: 1, 2 | Night codes: 33, 34
  if ([1, 2, 33, 34].includes(iconCode)) {
    if (isNight || iconCode >= 33) {
      return <Moon className="w-16 h-16 text-yellow-300" />;
    }
    return <Sun className="w-16 h-16 text-yellow-500" />;
  }
  
  // Partly cloudy - Day codes: 3, 4, 6 | Night codes: 35, 36, 38
  if ([3, 4, 6, 35, 36, 38].includes(iconCode)) {
    return <Cloud className="w-16 h-16 text-gray-400" />;
  }
  
  // Cloudy (code 7, 8) - same for day and night
  if ([7, 8].includes(iconCode)) {
    return <Cloud className="w-16 h-16 text-gray-500" />;
  }
  
  // Rain (codes 12, 13, 14, 18, 26, 39, 40) - same for day and night
  if ([12, 13, 14, 18, 26, 39, 40].includes(iconCode)) {
    return <Droplets className="w-16 h-16 text-primary" />;
  }
  
  // Default to cloud
  return <Cloud className="w-16 h-16 text-primary" />;
};

// Helper function to get UV index level
const getUVLevel = (uv: number) => {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
};

export function Map() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iconError, setIconError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not configured - map will not be available');
      return;
    }

    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      // Coordinates for 10 Senate Way, Kimberley (from the Get Directions button)
      const location = { lat: -28.7674381, lng: 24.7497489 };

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Add info window content
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #333;">Senate Way Guesthouse</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">10 Senate Way</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">Kimberley, Northern Cape</p>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">South Africa</p>
            <a href="https://www.google.com/maps/place/Senate+Way+Guest+House/@-28.7674381,24.747174,17z/data=!4m9!3m8!1s0x1e9b1b02995b68d9:0xb6d97e7d282e07dd!5m2!4m1!1i2!8m2!3d-28.7674381!4d24.7497489!16s%2Fg%2F11y4145j47?entry=ttu" 
               target="_blank" 
               rel="noopener noreferrer"
               style="color: #54a8fc; text-decoration: none; font-size: 14px;">
              Get Directions →
            </a>
          </div>
        `,
      });

      // Add marker
      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: 'Senate Way Guesthouse',
        animation: window.google.maps.Animation.DROP,
      });

      // Open info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Open info window by default
      infoWindow.open(map, marker);

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    loadGoogleMaps();

    return () => {
      // Cleanup - remove map instance if component unmounts
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log('Starting weather fetch...');
        setLoading(true);
        setError(null);
        
        // Check if we're in development or production
        // In development, use direct API (with CORS error handling)
        // In production (Netlify), use Netlify function proxy
        const isDevelopment = import.meta.env.DEV;
        const useProxy = !isDevelopment;
        
        if (useProxy) {
          // Use Netlify function to proxy the request (avoids CORS)
          console.log('Using Netlify function proxy for weather data...');
          
          // Get location data
          const locationResponse = await fetch(
            `/.netlify/functions/weather?endpoint=locations/v1/cities/search&q=Kimberley&country=ZA`
          );
          
          if (!locationResponse.ok) {
            const errorData = await locationResponse.json();
            console.error('Location fetch failed:', errorData);
            throw new Error(errorData.error || 'Failed to fetch location data');
          }
          
          const locationData = await locationResponse.json();
          console.log('Location data received:', locationData);
          
          if (locationData.length > 0) {
            const locationKey = locationData[0].Key;
            console.log('Location key found:', locationKey);
            
            // Get current weather
            const weatherResponse = await fetch(
              `/.netlify/functions/weather?endpoint=currentconditions/v1/${locationKey}&details=true`
            );
            
            if (!weatherResponse.ok) {
              const errorData = await weatherResponse.json();
              console.error('Weather fetch failed:', errorData);
              throw new Error(errorData.error || 'Failed to fetch weather data');
            }
            
            const weatherData = await weatherResponse.json();
            console.log('Weather data received:', weatherData);
            setWeather(weatherData[0] as WeatherData);
            setIconError(false);
            console.log('Weather data set successfully');
          } else {
            throw new Error('Location not found');
          }
        } else {
          // Development: Try direct API (may fail due to CORS)
          const apiKey = import.meta.env.VITE_ACCUWEATHER_API_KEY || '';
          
          if (!apiKey) {
            console.warn('AccuWeather API key not configured - weather data will not be available');
            setError('Weather service not configured');
            return;
          }
          
          console.log('Fetching location data for Kimberley...');
          try {
            const locationResponse = await fetch(
              `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=Kimberley&country=ZA`
            );
            
            if (!locationResponse.ok) {
              const errorText = await locationResponse.text();
              console.error('Location fetch failed:', errorText);
              throw new Error('Failed to fetch location data');
            }
            
            const locationData = await locationResponse.json();
            console.log('Location data received:', locationData);
            
            if (locationData.length > 0) {
              const locationKey = locationData[0].Key;
              console.log('Location key found:', locationKey);
              
              const weatherResponse = await fetch(
                `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`
              );
              
              if (!weatherResponse.ok) {
                const errorText = await weatherResponse.text();
                console.error('Weather fetch failed:', errorText);
                throw new Error('Failed to fetch weather data');
              }
              
              const weatherData = await weatherResponse.json();
              console.log('Weather data received:', weatherData);
              setWeather(weatherData[0] as WeatherData);
              setIconError(false);
              console.log('Weather data set successfully');
            } else {
              throw new Error('Location not found');
            }
          } catch (fetchError) {
            // Handle CORS errors in development
            if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
              console.warn('CORS error - weather data unavailable in development');
              setError('Weather data unavailable (CORS restriction - will work in production)');
            } else {
              throw fetchError;
            }
          }
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        setError(error instanceof Error ? error.message : 'Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">Our Location</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Perfectly situated in Kimberley with easy access to major attractions and amenities
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div 
              ref={mapRef} 
              className="w-full h-[450px]"
              style={{ minHeight: '450px' }}
              aria-label="Senate Way Guesthouse Location Map"
            />
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <div className="w-full h-[450px] flex items-center justify-center bg-muted text-muted-foreground">
                <p>Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.</p>
              </div>
            )}
          </div>

          {/* Nearby Attractions */}
          <div>
            <h3 className="mb-6">Nearby Attractions & Facilities</h3>
            
            <div className="space-y-4">
              <Card className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1">Kimberley Airport</h4>
                  <p className="text-sm text-muted-foreground">6 km away - Approximately 10 minutes by car</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1">North Cape Mall</h4>
                  <p className="text-sm text-muted-foreground">1.9 km away - Shopping and dining options</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1">Diamond Pavilion Shopping Centre</h4>
                  <p className="text-sm text-muted-foreground">1.9 km away - Convenient shopping nearby</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1">Kimberley Mine Museum</h4>
                  <p className="text-sm text-muted-foreground">3.4 km away - Historical diamond mining museum</p>
                </div>
              </Card>

              <Card className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1">The Big Hole</h4>
                  <p className="text-sm text-muted-foreground">3.6 km away - Iconic Kimberley landmark</p>
                </div>
              </Card>
            </div>

            <div className="mt-8 bg-secondary p-6 rounded-lg">
              <h4 className="mb-3">Address</h4>
              <p className="text-muted-foreground mb-4">
                10 Senate Way<br />
                Kimberley, Northern Cape<br />
                South Africa
              </p>
              <button
                onClick={() =>
                  window.open(
                    'https://www.google.com/maps/place/Senate+Way+Guest+House/@-28.7674381,24.747174,17z/data=!4m9!3m8!1s0x1e9b1b02995b68d9:0xb6d97e7d282e07dd!5m2!4m1!1i2!8m2!3d-28.7674381!4d24.7497489!16s%2Fg%2F11y4145j47?entry=ttu&g_ep=EgoyMDI1MTAyNi4wIKXMDSoASAFQAw%3D%3D',
                    '_blank'
                  )
                }
              >
                <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span>Get Directions</span>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Enhanced Weather Widget with Detailed Information */}
        {weather && !loading && !error && (
          <Card className="mt-8 p-6 bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:!bg-secondary/50 dark:from-transparent dark:to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {weather.WeatherIcon ? (
                  iconError ? (
                    getWeatherIconComponent(weather.WeatherIcon)
                  ) : (
                    <img 
                      src={getAccuWeatherIcon(weather.WeatherIcon)}
                      alt={weather.WeatherText}
                      className="w-16 h-16"
                      onError={() => setIconError(true)}
                      onLoad={() => setIconError(false)}
                    />
                  )
                ) : (
                  <Cloud className="w-16 h-16 text-primary" />
                )}
                <div>
                  <h3 className="text-xl font-semibold">Current Weather in Kimberley</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {weather.WeatherText}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Temperature Display */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card className="p-4 bg-card/80">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {weather.Temperature?.Metric?.Value ?? 'N/A'}°{weather.Temperature?.Metric?.Unit ?? 'C'}
                  </div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
              </Card>

              <Card className="p-4 bg-card/80">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Feels Like</p>
                    <p className="text-2xl font-semibold">
                      {weather.RealFeelTemperature?.Metric?.Value ?? weather.Temperature?.Metric?.Value ?? 'N/A'}°
                      {weather.RealFeelTemperature?.Metric?.Unit ?? weather.Temperature?.Metric?.Unit ?? 'C'}
                    </p>
                  </div>
                </div>
              </Card>

              {weather.Wind && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Wind className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wind Speed</p>
                      <p className="text-2xl font-semibold">
                        {Math.round(weather.Wind.Speed.Metric.Value)} {weather.Wind.Speed.Metric.Unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {weather.Wind.Direction.Localized}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {weather.RelativeHumidity && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Humidity</p>
                      <p className="text-2xl font-semibold">{weather.RelativeHumidity}%</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-3 gap-4">
              {weather.Pressure && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Gauge className="w-6 h-6 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pressure</p>
                      <p className="text-lg font-semibold">
                        {Math.round(weather.Pressure.Metric.Value)} {weather.Pressure.Metric.Unit}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {weather.UVIndex !== undefined && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Sun className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">UV Index</p>
                      <p className="text-lg font-semibold">
                        {weather.UVIndex}
                        <span className="text-xs ml-1">
                          ({getUVLevel(weather.UVIndex)})
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {weather.Visibility && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Visibility</p>
                      <p className="text-lg font-semibold">
                        {Math.round(weather.Visibility.Metric.Value)} {weather.Visibility.Metric.Unit}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {weather.WindGust && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-cyan-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wind Gust</p>
                      <p className="text-lg font-semibold">
                        {Math.round(weather.WindGust.Speed.Metric.Value)} {weather.WindGust.Speed.Metric.Unit}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {weather.DewPoint && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-primary/70" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dew Point</p>
                      <p className="text-lg font-semibold">
                        {Math.round(weather.DewPoint.Metric.Value)}°{weather.DewPoint.Metric.Unit}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {weather.CloudCover !== undefined && (
                <Card className="p-4 bg-card/80">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cloud Cover</p>
                      <p className="text-lg font-semibold">{weather.CloudCover}%</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        )}

        {loading && (
          <Card className="mt-8 p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          </Card>
        )}

        {error && (
          <Card className="mt-8 p-6">
            <div className="text-center text-muted-foreground">
              <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{error}</p>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
