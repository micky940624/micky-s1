import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Smartphone, Copy, CheckCircle } from 'lucide-react';

interface UPIQRCodeProps {
  upiId: string;
  amount: number;
  businessName: string;
  merchantName?: string;
}

const UPIQRCode: React.FC<UPIQRCodeProps> = ({ upiId, amount, businessName, merchantName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [upiId, amount]);

  const generateQRCode = async () => {
    try {
      const merchantDisplayName = merchantName || businessName;
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantDisplayName)}&am=${amount.toFixed(2)}&cu=INR&tr=${Date.now()}`;
      const qrUrl = await QRCode.toDataURL(upiUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-blue-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Pay via UPI</h3>
        </div>
        <p className="text-gray-600">Scan QR code or use UPI ID</p>
      </div>

      {qrCodeUrl && (
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Amount: ₹{amount.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">UPI ID</p>
            <p className="font-medium text-gray-900">{upiId}</p>
          </div>
          <button
            onClick={copyUPIId}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UPIQRCode;