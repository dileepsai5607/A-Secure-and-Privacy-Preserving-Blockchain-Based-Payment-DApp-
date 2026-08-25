
import React, { useRef, useEffect, useState } from 'react';
import { X, Zap, ShieldCheck } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
      }
    }
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const simulateScan = () => {
    // In a real app, we'd use a library like jsQR to parse the frames.
    // Here we simulate finding a valid UPI code.
    onScan("merchant_9921@suraksha");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="relative flex-1">
        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white bg-slate-900">
            <p>Camera permission denied. Please enable camera access in your mobile settings.</p>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 border-[40px] border-black/40 flex flex-col items-center justify-center">
          <div className="w-64 h-64 border-2 border-orange-500 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl translate-x-1 -translate-y-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl -translate-x-1 translate-y-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl translate-x-1 translate-y-1"></div>
            
            <div className="absolute inset-x-0 top-0 h-0.5 bg-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-[scan_2s_linear_infinite]"></div>
          </div>
          <p className="mt-8 text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">Align QR code within the frame</p>
        </div>

        {/* Controls */}
        <div className="absolute top-12 left-6 right-6 flex justify-between">
          <button onClick={onClose} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl text-white">
            <X size={24} />
          </button>
          <button className="p-3 bg-black/40 backdrop-blur-md rounded-2xl text-white">
            <Zap size={24} />
          </button>
        </div>

        {/* Simulation trigger for desktop demo */}
        <button 
          onClick={simulateScan}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-orange-600 text-white rounded-full font-bold shadow-xl animate-pulse"
        >
          SIMULATE SCAN
        </button>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full border border-teal-500/30">
          <ShieldCheck size={14} /> Encrypted Tunnel
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
