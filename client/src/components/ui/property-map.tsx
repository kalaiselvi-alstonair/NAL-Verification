import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Property {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  riskLevel: 'high' | 'medium' | 'low';
  status: 'verified' | 'in-progress' | 'pending';
  description?: string;
}

interface PropertyMapProps {
  properties?: Property[];
  height?: string;
  showLegend?: boolean;
}

// Mock property data for demonstration
const mockProperties: Property[] = [
  {
    id: 1,
    name: "Plot No. 45, Whitefield",
    address: "Whitefield, Bangalore, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    riskLevel: 'low',
    status: 'verified',
    description: 'Property verified with no issues found'
  },
  {
    id: 2,
    name: "Flat 12B, Green Acres",
    address: "Green Acres, Mumbai, Maharashtra",
    lat: 19.0760,
    lng: 72.8777,
    riskLevel: 'medium',
    status: 'in-progress',
    description: 'Verification in progress - minor documentation issues'
  },
  {
    id: 3,
    name: "Villa 7, Sunshine Gardens",
    address: "Sunshine Gardens, Delhi, NCR",
    lat: 28.7041,
    lng: 77.1025,
    riskLevel: 'high',
    status: 'pending',
    description: 'High risk - legal disputes detected'
  },
  {
    id: 4,
    name: "Commercial Complex, Tech Park",
    address: "Tech Park, Hyderabad, Telangana",
    lat: 17.3850,
    lng: 78.4867,
    riskLevel: 'low',
    status: 'verified',
    description: 'Commercial property verified successfully'
  },
  {
    id: 5,
    name: "Residential Plot, Lake View",
    address: "Lake View, Chennai, Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    riskLevel: 'medium',
    status: 'in-progress',
    description: 'Verification ongoing - zoning compliance check'
  }
];

// Custom marker icons for different risk levels
const createCustomIcon = (riskLevel: string) => {
  const color = getMarkerColor(riskLevel);
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      ">
        ${riskLevel === 'high' ? '!' : riskLevel === 'medium' ? '~' : '✓'}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const getMarkerColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'high':
      return '#ef4444'; // Red
    case 'medium':
      return '#f59e0b'; // Amber
    case 'low':
      return '#10b981'; // Green
    default:
      return '#6b7280'; // Gray
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'pending':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <MapPin className="h-4 w-4 text-gray-600" />;
  }
};

export function PropertyMap({ properties = mockProperties, height = "500px", showLegend = true }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const getRiskLevelStats = () => {
    const stats = {
      high: properties.filter(p => p.riskLevel === 'high').length,
      medium: properties.filter(p => p.riskLevel === 'medium').length,
      low: properties.filter(p => p.riskLevel === 'low').length
    };
    return stats;
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent-blue" />
            Property Risk Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            style={{ height, width: '100%' }}
            className="rounded-lg border border-card-shadow overflow-hidden"
          >
            <MapContainer
              center={[23.5937, 78.9629]} // Center of India
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              scrollWheelZoom={true}
              doubleClickZoom={true}
              boxZoom={true}
              dragging={true}
              animate={true}
              easeLinearity={0.35}
            >
              {/* Beautiful tile layer from OpenStreetMap */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Alternative beautiful tile layers - uncomment to try different styles */}
              {/* 
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              */}
              
              {/* 
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              */}

              {/* Property markers */}
              {properties.map((property) => (
                <Marker
                  key={property.id}
                  position={[property.lat, property.lng]}
                  icon={createCustomIcon(property.riskLevel)}
                  eventHandlers={{
                    click: () => setSelectedProperty(property)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold text-gray-800 mb-2">{property.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getMarkerColor(property.riskLevel) }}
                        ></div>
                        <span className="text-sm font-medium">
                          Risk: {property.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(property.status)}
                        <span className="text-sm font-medium">
                          Status: {property.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      {property.description && (
                        <p className="text-xs text-gray-500">{property.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Risk level circles for better visualization */}
              {properties.map((property) => (
                <Circle
                  key={`circle-${property.id}`}
                  center={[property.lat, property.lng]}
                  radius={50000} // 50km radius
                  pathOptions={{
                    color: getMarkerColor(property.riskLevel),
                    fillColor: getMarkerColor(property.riskLevel),
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {showLegend && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Level Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">!</div>
                <div>
                  <div className="font-semibold text-red-700">High Risk</div>
                  <div className="text-sm text-red-600">{getRiskLevelStats().high} properties</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">~</div>
                <div>
                  <div className="font-semibold text-amber-700">Medium Risk</div>
                  <div className="text-sm text-amber-600">{getRiskLevelStats().medium} properties</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                <div>
                  <div className="font-semibold text-green-700">Low Risk</div>
                  <div className="text-sm text-green-600">{getRiskLevelStats().low} properties</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-main">{selectedProperty.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
              </div>
              <div className="flex gap-2">
                <Badge 
                  variant="secondary" 
                  className={`${
                    selectedProperty.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                    selectedProperty.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}
                >
                  {selectedProperty.riskLevel.toUpperCase()} RISK
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`${
                    selectedProperty.status === 'verified' ? 'bg-green-100 text-green-700' :
                    selectedProperty.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {selectedProperty.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              {selectedProperty.description && (
                <p className="text-sm text-muted-foreground">{selectedProperty.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 