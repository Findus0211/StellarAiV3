import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, AlertTriangle } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage, AppSettings } from '../types';

interface ImageGeneratorProps {
  settings: AppSettings;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ settings }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt, settings.nsfwEnabled);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt
      };
      setGeneratedImages(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (err) {
      setError("Failed to generate image. Try a different prompt or check safety settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stellar-light to-stellar">
            Stellar Vision
          </h1>
          <p className="text-gray-400">Generate high-quality images using Google Gemini Imagen 3.</p>
          {settings.nsfwEnabled && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded border border-red-900/50">
              <AlertTriangle size={12} /> NSFW Allowed
            </span>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Describe the image you want to imagine..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-stellar focus:ring-1 focus:ring-stellar outline-none text-white"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-stellar to-stellar-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={18} /> Generate
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedImages.map((img) => (
            <div key={img.id} className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg transition hover:shadow-stellar/20">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-sm line-clamp-2 mb-2">{img.prompt}</p>
                <a 
                  href={img.url} 
                  download={`stellar-ai-${img.id}.png`}
                  className="bg-white/20 backdrop-blur hover:bg-white/30 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>

        {generatedImages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <ImageIcon size={64} className="mb-4 opacity-50" />
            <p>Your imagination canvas is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;