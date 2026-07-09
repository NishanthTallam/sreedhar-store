"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MapPin, Navigation, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface AddressMapPickerProps {
  onAddressSelect?: (addressData: any) => void;
}

const INITIAL_LOCATION = { lat: 14.3364, lng: 77.7814 };
const NOMINATIM_EMAIL = "tallamnishanth@gmail.com"; // Required by Nominatim ToS

export function AddressMapPicker({ onAddressSelect }: AddressMapPickerProps) {
  const [position, setPosition] = useState<{lat: number, lng: number}>(INITIAL_LOCATION);
  const [addressData, setAddressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Reverse geocoding function using Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&email=${NOMINATIM_EMAIL}`);
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.suburb || addr.neighbourhood || data.display_name;
        const city = addr.city || addr.town || addr.village || addr.county || "";
        const state = addr.state || "";
        const pincode = addr.postcode || "";

        setAddressData({
          latitude: lat,
          longitude: lng,
          formattedAddress: data.display_name,
          street,
          city,
          state,
          pincode
        });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Do initial reverse geocode on mount
  useEffect(() => {
    reverseGeocode(INITIAL_LOCATION.lat, INITIAL_LOCATION.lng);
  }, []);

  // Map events hook component to handle clicks and center changes
  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });

    useEffect(() => {
      map.flyTo(position, map.getZoom());
    }, [position, map]);

    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&email=${NOMINATIM_EMAIL}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition({ lat, lng });
    setSearchResults([]);
    setSearchQuery("");
    reverseGeocode(lat, lng);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      () => {
        setIsLoading(false);
        alert("Failed to get current location");
      }
    );
  };

  const handleSave = () => {
    if (onAddressSelect && addressData) {
      onAddressSelect(addressData);
    }
  };

  const markerEventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          reverseGeocode(newPos.lat, newPos.lng);
        }
      },
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative z-[500]">
        <div className="flex gap-2">
          <Input 
            placeholder="Search for an address..." 
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button type="button" onClick={handleSearch} disabled={isLoading} variant="secondary" className="px-3 shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <div 
                key={result.place_id} 
                className="cursor-pointer px-4 py-2 text-sm hover:bg-neutral-100 border-b last:border-0 border-neutral-100"
                onClick={() => selectSearchResult(result)}
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 z-10">
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={position} 
            draggable={true}
            eventHandlers={markerEventHandlers}
          />
          <MapEvents />
        </MapContainer>
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-4 right-4 z-[400] gap-2 bg-white shadow-md"
          onClick={useCurrentLocation}
          type="button"
        >
          <Navigation className="h-4 w-4 text-brand-600" />
          Use Current Location
        </Button>
      </div>

      {addressData && (
        <div className="rounded-lg border border-neutral-200 p-4 space-y-4 bg-white relative z-0">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-600" />
              Selected Location
              {isLoading && <Loader2 className="h-3 w-3 animate-spin text-neutral-400" />}
            </h4>
            <p className="text-sm text-neutral-600">{addressData.formattedAddress}</p>
          </div>
          
          <Button type="button" className="w-full" onClick={handleSave} disabled={isLoading}>
            Confirm & Save Address
          </Button>
        </div>
      )}
    </div>
  );
}
