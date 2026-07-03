"use client";

import { useState } from "react";
import { CameraScanner } from "@/components/admin/CameraScanner";
import { Search, Package, AlertCircle } from "lucide-react";

export default function ScannerPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  
  const handleScanSuccess = (decodedText: string) => {
    setScannedCode(decodedText);
    // In a real app, this would trigger a lookup in the database
  };

  const handleScanError = (errorMessage: string) => {
    // Ignore routine scan errors when no QR/barcode is found in the frame
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Barcode Scanner</h1>
          <p className="text-sm text-gray-500 mt-1">Scan product barcodes to lookup inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Camera Scan</h2>
            <CameraScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Scan Result</h2>
            
            {scannedCode ? (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-4 text-green-600">
                  <Search className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Barcode Detected</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-xl text-center mb-6 border border-gray-200 text-gray-900">
                  {scannedCode}
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium">
                    <Package className="w-5 h-5 text-gray-400" />
                    Product Lookup
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Fetching product details for this barcode...
                  </p>
                  
                  {/* Skeleton loader for product details lookup simulation */}
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-xl bg-gray-200 h-16 w-16"></div>
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-3 bg-gray-200 rounded col-span-2"></div>
                          <div className="h-3 bg-gray-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No barcode scanned</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Point your camera at a barcode. The result will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
