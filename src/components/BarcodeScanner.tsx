import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, Keyboard, Search, Plus, Package } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
  mode?: 'search' | 'add' | 'stock';
  title?: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScanSuccess, 
  onClose, 
  isOpen, 
  mode = 'search',
  title 
}) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [scanMode, setScanMode] = useState<'auto' | 'manual'>('auto');
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const getTitle = () => {
    if (title) return title;
    switch (mode) {
      case 'add': return 'Scan to Add Product';
      case 'stock': return 'Scan to Update Stock';
      case 'search': return 'Scan to Search';
      default: return 'Scan Barcode';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'add': return <Plus className="w-6 h-6 mr-2" />;
      case 'stock': return <Package className="w-6 h-6 mr-2" />;
      case 'search': return <Search className="w-6 h-6 mr-2" />;
      default: return <Camera className="w-6 h-6 mr-2" />;
    }
  };

  // Get available cameras
  useEffect(() => {
    if (isOpen && !isInitialized) {
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back camera for barcode scanning
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
          setIsInitialized(true);
        }
      }).catch(err => {
        console.error('Error getting cameras:', err);
        setError('Camera access denied. Please allow camera permissions.');
        setIsInitialized(true);
      });
    }
  }, [isOpen, isInitialized]);

  // Scanner lifecycle management
  useEffect(() => {
    if (!isOpen || showManualInput || !selectedCamera || scanMode !== 'auto' || !isInitialized) {
      return;
    }

    const startScanner = async () => {
      try {
        setError('');
        const html5QrCode = new Html5Qrcode("camera-scanner");
        html5QrCodeRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          selectedCamera,
          config,
          (decodedText) => {
            // Success callback - immediately stop and close
            // Stop scanner first
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              html5QrCodeRef.current = null;
            }).catch(() => {
              // Ignore errors during cleanup
            });
            
            onScanSuccess(decodedText);
          },
          (error) => {
            // Error callback - can be ignored for continuous scanning
          }
        );
      } catch (err) {
        console.error('Error starting camera scanner:', err);
        setError('Failed to start camera. Please check camera permissions.');
        html5QrCodeRef.current = null;
      }
    };

    startScanner();

    // Cleanup function - synchronous cleanup
    return () => {
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        try {
          if (scanner.getState() === 2) { // SCANNING state
            scanner.stop().catch(() => {
              // Ignore errors during cleanup
            });
          }
          scanner.clear().catch(() => {
            // Ignore errors during cleanup
          });
        } catch (err) {
          // Ignore errors during cleanup
        } finally {
          html5QrCodeRef.current = null;
        }
      }
    };
  }, [isOpen, showManualInput, selectedCamera, scanMode, isInitialized, onScanSuccess, onClose]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
      setManualBarcode('');
      setShowManualInput(false);
      onClose();
    }
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  const handleClose = () => {
    setManualBarcode('');
    setShowManualInput(false);
    setError('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              {getIcon()}
              {getTitle()}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Scan Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setScanMode('auto');
                setShowManualInput(false);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                scanMode === 'auto' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
            <button
              onClick={() => {
                setScanMode('manual');
                setShowManualInput(true);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                scanMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Manual</span>
            </button>
          </div>

          {/* Camera Selection */}
          {cameras.length > 1 && scanMode === 'auto' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => handleCameraChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label || `Camera ${camera.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Manual Input Form */}
          {showManualInput ? (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Barcode/SKU
                </label>
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode, SKU, or product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {mode === 'add' ? 'Add Product' : mode === 'stock' ? 'Update Stock' : 'Search'}
              </button>
            </form>
          ) : (
            <div>
              <p className="text-sm text-gray-600 text-center mb-4">
                Position the barcode within the scanning area
              </p>
              
              {/* Camera Scanner Container */}
              <div 
                id="camera-scanner" 
                className="w-full min-h-[300px] bg-gray-100 rounded-lg flex items-center justify-center"
              >
                {!html5QrCodeRef.current && !error && (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Starting camera...</p>
                  </div>
                )}
              </div>

              {/* Scanner Status */}
              {html5QrCodeRef.current && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Scanning active</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Tips for better scanning:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Hold the device steady</li>
              <li>• Ensure good lighting</li>
              <li>• Keep barcode flat and clean</li>
              <li>• Try different angles if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;