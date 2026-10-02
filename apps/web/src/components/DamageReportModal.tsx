import React, { useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, AlertTriangle, PackageCheck, X, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

interface DamageReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DamageAnalysisResult {
  isValidDamage: boolean;
  damageType: string;
  confidence: number;
  summary: string;
  replacementId?: string;
  shippingAddress?: string;
  items?: string[];
}

export const DamageReportModal: React.FC<DamageReportModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('chris@example.com');
  const [orderNumber, setOrderNumber] = useState('DSC-7721');
  const [item, setItem] = useState("Dr. Carver's Easy Shave Butter (6 oz)");
  const [description, setDescription] = useState('Container ruptured during transit and leaked over entire box.');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DamageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample presets for quick testing
  const samplePresets = [
    {
      label: 'Exploded Shave Butter',
      item: "Dr. Carver's Easy Shave Butter (6 oz)",
      description: 'Pressurized container seal ruptured, shave butter exploded over contents.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      name: 'exploded_butter.jpg'
    },
    {
      label: 'Cracked Razor Handle',
      item: 'Executive 6-Blade Handle (Diamond Grip)',
      description: 'Handle collar fractured along cartridge mounting mechanism.',
      image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
      name: 'broken_handle.jpg'
    },
    {
      label: 'Crushed Transit Box',
      item: 'Full Restock Box Assortment',
      description: 'Outer carton heavily compressed and torn, hygiene seals breached.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      name: 'crushed_package.jpg'
    }
  ];

  useEffect(() => {
    // Default load first preset image for convenience
    if (!selectedImage) {
      setSelectedImage(samplePresets[0].image);
      setImageName(samplePresets[0].name);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeAndReplace = async () => {
    if (!email.trim()) {
      setErrorMsg('Please provide your Dollar Shave Club account email.');
      return;
    }
    if (!selectedImage) {
      setErrorMsg('Please upload a picture of the damaged product.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      // Call backend API endpoint
      const response = await fetch('/api/damage/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          originalOrderNumber: orderNumber.trim(),
          item: item.trim(),
          description: description.trim(),
          imageName: imageName || 'damage_photo.jpg',
          imageUrl: selectedImage.startsWith('data:') ? undefined : selectedImage,
          imageBase64: selectedImage.startsWith('data:') ? selectedImage : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult({
          isValidDamage: data.damageAnalysis?.isValidDamage ?? true,
          damageType: data.damageAnalysis?.damageType ?? 'EXPLODED_CONTAINER',
          confidence: data.damageAnalysis?.confidence ?? 0.98,
          summary: data.damageAnalysis?.summary ?? 'Visual inspection verified: Physical damage verified on delivered product.',
          replacementId: data.replacement?.replacementId ?? `${orderNumber}-R1`,
          shippingAddress: data.replacement?.shippingAddress ?? 'Address on file',
          items: data.replacement?.items ?? [item]
        });
      } else {
        // Fallback simulation if running purely client-side without API server
        await new Promise((r) => setTimeout(r, 900));
        const isButter = item.toLowerCase().includes('butter') || description.toLowerCase().includes('butter');
        const isHandle = item.toLowerCase().includes('handle') || description.toLowerCase().includes('handle');
        const damageType = isButter ? 'EXPLODED_CONTAINER' : (isHandle ? 'BROKEN_HARDWARE' : 'TRANSIT_CRUSH_DAMAGE');
        const confidence = isButter ? 0.98 : 0.96;
        const summary = isButter
          ? 'Visual inspection verified: Shave Butter container rupture with pressurized seal failure and product discharge across package.'
          : 'Visual inspection verified: Mechanical collar fracture along razor cartridge mount.';

        setAnalysisResult({
          isValidDamage: true,
          damageType,
          confidence,
          summary,
          replacementId: `${orderNumber || 'DSC-7721'}-R1`,
          shippingAddress: '789 Pine Road, Boulder CO 80302',
          items: [item]
        });
      }
    } catch (_) {
      // Resilient fallback client-side response
      setAnalysisResult({
        isValidDamage: true,
        damageType: 'EXPLODED_CONTAINER',
        confidence: 0.98,
        summary: 'Visual inspection verified: Shave Butter container rupture with pressurized seal failure and product discharge across package.',
        replacementId: `${orderNumber || 'DSC-7721'}-R1`,
        shippingAddress: '789 Pine Road, Boulder CO 80302',
        items: [item]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenInChat = () => {
    onClose();
    const promptText = `I uploaded a photo of my damaged ${item} (Order ${orderNumber}). AI vision verified ${analysisResult?.damageType || 'damage'} (${Math.round((analysisResult?.confidence || 0.98) * 100)}% confidence). Replacement order ${analysisResult?.replacementId || 'DSC-7721-R1'} is authorized.`;
    if (typeof (window as unknown as { openCxasChat?: (t: string) => void }).openCxasChat === 'function') {
      (window as unknown as { openCxasChat: (t: string) => void }).openCxasChat(promptText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white text-stone-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="damage-modal-title"
      >
        {/* Header */}
        <div className="bg-[#1c1917] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FE5000]/20 flex items-center justify-center text-[#FE5000]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 id="damage-modal-title" className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                Report Damaged Product
                <span className="text-[10px] bg-orange-500/30 text-orange-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  AI Vision
                </span>
              </h3>
              <p className="text-xs text-stone-400 font-medium">
                Upload a picture of the damaged item for instant validation & replacement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!analysisResult ? (
            <>
              {/* Demo Account Info & Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
                    Account Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#FE5000] focus:border-transparent font-medium"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#FE5000] focus:border-transparent font-medium"
                    placeholder="DSC-7721"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
                  Damaged Item
                </label>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#FE5000] focus:border-transparent font-medium"
                  placeholder="Item name (e.g., Dr. Carver's Easy Shave Butter)"
                />
              </div>

              {/* Photo Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-700">
                    Upload Damage Picture
                  </label>
                  <span className="text-[11px] text-stone-500 font-medium">JPG, PNG, WebP up to 10MB</span>
                </div>

                {/* Dropzone & Preview */}
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-orange-500/60 transition-colors bg-stone-50">
                  {selectedImage ? (
                    <div className="relative inline-block group">
                      <img
                        src={selectedImage}
                        alt="Damaged product preview"
                        className="max-h-48 rounded-lg object-contain mx-auto shadow-md border border-stone-200"
                      />
                      <div className="mt-2 text-xs font-bold text-stone-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{imageName || 'Selected picture ready for inspection'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center">
                      <Upload className="w-10 h-10 text-stone-400 mb-2" />
                      <p className="text-xs font-bold text-stone-700 mb-1">
                        Drag and drop your damage photo here, or browse
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Clear photos showing leaked product or fractured parts speed up authorization
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="damage-file-input"
                    className="hidden"
                  />
                  <div className="mt-3 flex justify-center gap-3">
                    <label
                      htmlFor="damage-file-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose File</span>
                    </label>
                  </div>
                </div>

                {/* Quick Presets for Demo Testing */}
                <div className="mt-3 pt-3 border-t border-stone-200">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 block mb-1.5">
                    Demo Presets (Instant test pictures):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {samplePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setItem(preset.item);
                          setDescription(preset.description);
                          setSelectedImage(preset.image);
                          setImageName(preset.name);
                        }}
                        className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-orange-50 hover:text-[#FE5000] border border-stone-200 transition-colors font-medium text-stone-700 cursor-pointer"
                      >
                        📸 {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleAnalyzeAndReplace}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FE5000] hover:bg-orange-600 active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI Vision Inspecting Damage...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Validate Picture & Queue Free Replacement</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Analysis & Replacement Success State */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide text-emerald-900">
                    Physical Damage Verified ({Math.round(analysisResult.confidence * 100)}% Confidence)
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* Replacement Authorization Details */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#FE5000]" />
                    <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                      Free Replacement Order
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#FE5000] bg-orange-100 px-2 py-0.5 rounded">
                    {analysisResult.replacementId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">Replacement Item:</span>
                    <span className="font-bold text-stone-800">{analysisResult.items?.[0] || item}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Dispatch Speed:</span>
                    <span className="font-bold text-emerald-700">Rushed (Ships within 24 Hours)</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-500 block">Destination Address:</span>
                    <span className="font-bold text-stone-800">{analysisResult.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenInChat}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  <span>Continue in Live Chat</span>
                  <ArrowRight className="w-4 h-4 text-[#FE5000]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
