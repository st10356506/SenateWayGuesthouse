import { Card } from './ui/card';
import { MapPin, Plane, ShoppingBag, Building, Cloud, Thermometer, Droplets } from 'lucide-react';
import { useState, useEffect } from 'react';

// Type definitions for AccuWeather API
interface WeatherData {
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  WeatherText: string;
  RealFeelTemperature?: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  RelativeHumidity?: number;
}

export function Map() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log('🌤️ Starting weather fetch...');
        setLoading(true);
        setError(null);
        
        const apiKey = import.meta.env.VITE_ACCUWEATHER_API_KEY || '';
        console.log('🔑 API Key found:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO');
        console.log('🔑 Full env check:', import.meta.env);
        
        if (!apiKey) {
          console.warn('❌ AccuWeather API key not configured - weather data will not be available');
          setError('Weather service not configured');
          return;
        }
        
        // First get location key for Kimberley, South Africa
        console.log('📍 Fetching location data for Kimberley...');
        const locationResponse = await fetch(
          `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=Kimberley&country=ZA`
        );
        
        console.log('📍 Location response status:', locationResponse.status);
        console.log('📍 Location response ok:', locationResponse.ok);
        
        if (!locationResponse.ok) {
          const errorText = await locationResponse.text();
          console.error('❌ Location fetch failed:', errorText);
          throw new Error('Failed to fetch location data');
        }
        
        const locationData = await locationResponse.json();
        console.log('📍 Location data received:', locationData);
        
        if (locationData.length > 0) {
          const locationKey = locationData[0].Key;
          console.log('📍 Location key found:', locationKey);
          
          // Get current weather
          console.log('🌤️ Fetching weather data...');
          const weatherResponse = await fetch(
            `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
          );
          
          console.log('🌤️ Weather response status:', weatherResponse.status);
          console.log('🌤️ Weather response ok:', weatherResponse.ok);
          
          if (!weatherResponse.ok) {
            const errorText = await weatherResponse.text();
            console.error('❌ Weather fetch failed:', errorText);
            throw new Error('Failed to fetch weather data');
          }
          
          const weatherData = await weatherResponse.json();
          console.log('🌤️ Weather data received:', weatherData);
          setWeather(weatherData[0] as WeatherData);
          console.log('✅ Weather data set successfully');
        } else {
          console.error('❌ No location data found for Kimberley');
          throw new Error('Location not found');
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
    <section className="py-16 bg-white">
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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110932.13612822!2d24.662813!3d-28.738041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9b1a5c5b5c5c5c%3A0x1a5c5c5c5c5c5c5c!2sKimberley%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SenateWay Guesthouse Location"
            />
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
                Senate Way<br />
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

        {/* Weather Widget */}
        {weather && !loading && !error && (
          <Card className="mt-8 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Current Weather in Kimberley</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {weather?.Temperature?.Metric?.Value ?? 'N/A'}°{weather?.Temperature?.Metric?.Unit ?? ''}
                </div>
                <p className="text-sm text-muted-foreground">Temperature</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold mb-1">
                  {weather?.WeatherText ?? 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">Condition</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">
                  {weather?.RealFeelTemperature?.Metric?.Value ?? weather?.Temperature?.Metric?.Value ?? 'N/A'}°{weather?.RealFeelTemperature?.Metric?.Unit ?? weather?.Temperature?.Metric?.Unit ?? ''}
                </div>
                <p className="text-sm text-muted-foreground">Feels Like</p>
              </div>
            </div>
            {weather?.RelativeHumidity && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Droplets className="w-4 h-4" />
                  <span>Humidity: {weather.RelativeHumidity}%</span>
                </div>
              </div>
            )}
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

        {/* Distance Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Distance in property description is calculated using © OpenStreetMap
          </p>
        </div>
      </div>
    </section>
  );
}
