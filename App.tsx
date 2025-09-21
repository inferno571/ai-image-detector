import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Footer } from './components/Footer';
import { History } from './components/History';
import { Chat } from './components/Chat';
import { analyzeImageForAIContent, highlightArtifacts } from './services/geminiService';
import type { AnalysisResult, AnalysisRecord, ChatMessage, AnalyzableImage } from './types';
import { UploadIcon, CheckCircleIcon, ExclamationIcon, AIEyeIcon } from './components/icons';
import { GoogleGenAI, Chat as GeminiChat } from '@google/genai';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [images, setImages] = useState<AnalyzableImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  
  const chatRef = useRef<GeminiChat | null>(null);
  const [isChatting, setIsChatting] = useState<boolean>(false);

  const selectedImage = images.find(img => img.id === selectedImageId) || null;

  const addImagesToBatch = useCallback((files: FileList | File[]) => {
    const newImages: AnalyzableImage[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      result: null,
      error: null,
      highlightedImageUrl: null,
      chatMessages: [],
    }));

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      if (!selectedImageId) {
        setSelectedImageId(newImages[0].id);
      }
    }
  }, [selectedImageId]);


  const handleImageSelect = (files: FileList) => {
    addImagesToBatch(files);
  };

  const handleBatchAnalyze = useCallback(async () => {
    const imagesToAnalyze = images.filter(img => img.status === 'pending');
    if (imagesToAnalyze.length === 0) {
      return;
    }

    setIsLoading(true);
    
    setImages(prev => prev.map(img => imagesToAnalyze.some(i => i.id === img.id) ? { ...img, status: 'loading' } : img));

    const analysisPromises = imagesToAnalyze.map(async (image) => {
      try {
        const result = await analyzeImageForAIContent(image.file);
        return { id: image.id, status: 'success' as const, result };
      } catch (err) {
        const message = err instanceof Error ? `Analysis failed: ${err.message}` : "An unknown error occurred during analysis.";
        return { id: image.id, status: 'error' as const, error: message };
      }
    });

    const results = await Promise.all(analysisPromises);
    
    const newHistoryRecords: AnalysisRecord[] = [];

    setImages(currentImages => {
      let updatedImages = [...currentImages];
      results.forEach(res => {
        const imageIndex = updatedImages.findIndex(img => img.id === res.id);
        if (imageIndex > -1) {
          const updatedImage = { ...updatedImages[imageIndex], status: res.status, result: res.status === 'success' ? res.result : null, error: res.status === 'error' ? res.error : null };
          
          if (res.status === 'success') {
            updatedImage.chatMessages = [{
              role: 'model',
              content: `**Analysis Complete:** The image is classified as **${res.result.classification}**.\n\n**Reasoning:**\n${res.result.reasoning}`
            }];
            newHistoryRecords.push({
              id: updatedImage.id,
              imageSrc: updatedImage.previewUrl,
              result: res.result,
              imageFile: updatedImage.file,
            });
          }
          updatedImages[imageIndex] = updatedImage;
        }
      });
      return updatedImages;
    });

    if (newHistoryRecords.length > 0) {
        setHistory(prev => [...newHistoryRecords, ...prev]);
    }
    setIsLoading(false);
  }, [images]);
  
  const handleHighlightClick = async () => {
    if (!selectedImage || !selectedImage.result) return;
    
    setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, status: 'highlighting' } : img));

    try {
      const highlightedImage = await highlightArtifacts(selectedImage.file, selectedImage.result.reasoning);
      setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, highlightedImageUrl: highlightedImage, status: 'success' } : img));
    } catch(err) {
        const errorMsg = err instanceof Error ? `Highlighting failed: ${err.message}.` : "An unknown error occurred during highlighting.";
        setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, error: errorMsg, status: 'error' } : img));
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !selectedImage) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, chatMessages: [...img.chatMessages, userMessage] } : img));
    setIsChatting(true);

    try {
      if (!chatRef.current) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) throw new Error("API Key not configured");
        const ai = new GoogleGenAI({ apiKey });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [{
              role: "user",
              parts: [{ text: "You are a helpful AI assistant specializing in image analysis. A user has just received an analysis of an image. Your job is to answer their follow-up questions about it. Here is the initial analysis summary you should base the conversation on." }],
            },
            {
              role: "model",
              parts: [{ text: "Understood. I will answer questions based on the provided analysis." }],
            },
            {
              role: "user",
              parts: [{ text: `Analysis Classification: ${selectedImage?.result?.classification}. Reasoning: ${selectedImage?.result?.reasoning}` }]
            },
            {
                role: "model",
                parts: [{text: "Okay, I have the context. I'm ready for the user's questions."}]
            }
          ]
        });
      }
      const response = await chatRef.current.sendMessage({ message });
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, chatMessages: [...img.chatMessages, modelMessage] } : img));

    } catch (err) {
       const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
       setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, chatMessages: [...img.chatMessages, errorMessage] } : img));
    } finally {
      setIsChatting(false);
    }
  };

  const handleSelectImage = (id: string) => {
      if(selectedImageId !== id) {
          setSelectedImageId(id);
          chatRef.current = null;
      }
  }

  const handleSelectHistory = (record: AnalysisRecord) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const imageFromHistory: AnalyzableImage = {
        id: record.id,
        file: record.imageFile,
        previewUrl: record.imageSrc,
        status: 'success',
        result: record.result,
        error: null,
        highlightedImageUrl: null,
        chatMessages: [{
            role: 'model',
            content: `**Analysis Complete:** The image is classified as **${record.result.classification}**.\n\n**Reasoning:**\n${record.result.reasoning}`
        }],
    }
    setImages([imageFromHistory]);
    setSelectedImageId(imageFromHistory.id);
    chatRef.current = null;
  };

  const pendingImageCount = images.filter(img => img.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans w-full relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial-glow opacity-50 z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial-glow opacity-30 z-0 transform translate-x-1/2 translate-y-1/2"></div>

      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-7xl flex-grow flex flex-col items-center z-10"
      >
        <div className="w-full bg-brand-secondary/50 border border-glass-border rounded-2xl shadow-glass backdrop-blur-lg p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 flex flex-col space-y-6 justify-start">
              <div>
                <h2 className="text-xl font-semibold text-brand-text mb-2">1. Provide Images</h2>
                <p className="text-sm text-brand-subtle mb-4">Upload one or more images. The analysis will begin when you're ready.</p>
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>

              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Image Queue</h3>
                    <button onClick={() => { setImages([]); setSelectedImageId(null); }} className="text-sm text-brand-accent hover:text-brand-accent-dark transition-colors duration-200">Clear All</button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 rounded-lg">
                    {images.map(image => (
                      <motion.button
                        key={image.id}
                        onClick={() => handleSelectImage(image.id)}
                        className={`relative group aspect-square rounded-md overflow-hidden border-2 ${selectedImageId === image.id ? 'border-brand-accent' : 'border-glass-border'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={image.previewUrl} alt="upload preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        {(image.status === 'loading' || image.status === 'highlighting') && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader /></div>}
                        {image.status === 'success' && <CheckCircleIcon className="absolute top-1 right-1 h-5 w-5 text-green-400 bg-black/50 rounded-full p-0.5" />}
                        {image.status === 'error' && <ExclamationIcon className="absolute top-1 right-1 h-5 w-5 text-red-400 bg-black/50 rounded-full p-0.5" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              <motion.button
                onClick={handleBatchAnalyze}
                disabled={pendingImageCount === 0 || isLoading}
                className="w-full bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 mt-auto shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/40"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                {isLoading ? <Loader /> : <UploadIcon className="h-5 w-5" />}
                <span>{isLoading ? 'Analyzing...' : `Analyze ${pendingImageCount > 0 ? pendingImageCount : ''} Image${pendingImageCount !== 1 ? 's' : ''}`}</span>
              </motion.button>
            </div>
            
            {/* RIGHT COLUMN */}
            <div className="lg:col-span-3 flex flex-col justify-start space-y-4 bg-black/20 rounded-lg min-h-[500px] lg:min-h-full p-4">
              <h2 className="text-xl font-semibold text-brand-text mb-2">2. Review Analysis</h2>
              {!selectedImage ? (
                <div className="text-center text-brand-subtle h-full flex flex-col items-center justify-center">
                  <AIEyeIcon className="h-16 w-16 mb-4 opacity-10" />
                  <p className="text-lg font-medium">Upload an image to begin</p>
                  <p>Your analysis results will appear here.</p>
                </div>
              ) : (
                <div className="flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 truncate">File: <span className="text-brand-subtle font-mono text-sm">{selectedImage.file.name}</span></h3>
                    <div className="relative w-full h-64 bg-black/20 rounded-lg border border-glass-border flex items-center justify-center overflow-hidden">
                      <img src={selectedImage.highlightedImageUrl || selectedImage.previewUrl} alt="Selected preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    {selectedImage.status === 'loading' && <div className="flex justify-center items-center h-full"><Loader large={true} text="Running deep learning analysis..."/></div>}
                    {selectedImage.status === 'error' && <div className="text-red-400 bg-red-900/20 border border-red-500/30 p-4 rounded-lg text-center">{selectedImage.error}</div>}
                    {(selectedImage.status === 'success' || selectedImage.status === 'highlighting') && selectedImage.result && (
                      <ResultDisplay
                        result={selectedImage.result}
                        isHighlighting={selectedImage.status === 'highlighting'}
                        onHighlightClick={handleHighlightClick}
                      />
                    )}
                    {selectedImage.status === 'pending' && (
                      <div className="text-center text-brand-subtle h-full flex items-center justify-center">
                        <p className="text-lg">This image is ready for analysis.</p>
                      </div>
                    )}
                  </div>
                  {selectedImage.result && (
                    <div className="border-t border-glass-border pt-4 mt-4">
                      <h2 className="text-xl font-semibold text-brand-text mb-2">3. Ask a Follow-up</h2>
                      <Chat messages={selectedImage.chatMessages} onSendMessage={handleSendMessage} isLoading={isChatting} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {history.length > 0 && (
          <History history={history} onSelect={handleSelectHistory} />
        )}

      </motion.main>
      <Footer />
    </div>
  );
};

export default App;
