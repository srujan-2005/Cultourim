import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, X, Upload, Send, ChevronLeft } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
 
const TravelJournal = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [journal, setJournal] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const fileInputRef = useRef(null);
    const modalRef = useRef(null);
    const key = process.env.VITE_GOOGLE_API_KEY || 'your_api_key_here';
    const genAI = new GoogleGenerativeAI(key);
    
    // Load saved journal entries from localStorage on component mount
    useEffect(() => {
        const savedJournal = localStorage.getItem('travelJournal');
        if (savedJournal) {
            setJournal(JSON.parse(savedJournal));
        }
    }, []);

    // Save journal entries to localStorage whenever journal changes
    useEffect(() => {
        localStorage.setItem('travelJournal', JSON.stringify(journal));
    }, [journal]);

    // Add event listener for clicking outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeEntryDetails();
            }
        };

        if (selectedEntry) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedEntry]);

    // Add escape key listener to close modal
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeEntryDetails();
            }
        };

        if (selectedEntry) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [selectedEntry]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAddEntry = async () => {
        if (!location || !note) {
            alert('Please complete all fields.');
            return;
        }

        const generateStoryWithAI = async (location, note, imageFile) => {
            setIsGenerating(true);

            try {
                // Get the model
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                // Prepare content parts
                const contentParts = [
                    {
                        text: `Generate a vivid, first-person travel story (100-150 words) about my visit to ${location}. 
                    Incorporate this note: "${note}". 
                    Make it personal, reflective, and evocative of the location's atmosphere.
                    Include sensory details and a meaningful observation or realization.
                    but keep in mind to keep it crisp and short` }
                ];

                // Add image if available
                if (imageFile) {
                    const imageData = await readFileAsBase64(imageFile);
                    contentParts.push({
                        inlineData: {
                            data: imageData.split(',')[1],
                            mimeType: imageFile.type
                        }
                    });
                }

                // Generate content
                const result = await model.generateContent({
                    contents: [{ role: "user", parts: contentParts }]
                });

                const response = result.response;
                return response.text();
            } catch (error) {
                console.error("Error generating story:", error);
                return `As I wandered through ${location}, I couldn't help but reflect on how ${note.toLowerCase()}. The journey left me with unforgettable memories that I'll cherish forever.`;
            } finally {
                setIsGenerating(false);
            }
        };

        // Helper function to read file as base64
        const readFileAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        };

        const story = await generateStoryWithAI(location, note, image);

        const newEntry = {
            image: preview,
            location,
            note,
            story,
            date: new Date().toLocaleString(),
        };

        setJournal([newEntry, ...journal]);
        setImage(null);
        setPreview(null);
        setLocation('');
        setNote('');
    };

    const showEntryDetails = (entry) => {
        setSelectedEntry(entry);
    };

    const closeEntryDetails = () => {
        setSelectedEntry(null);
    };

    // Stop propagation to prevent closing when clicking inside modal content
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed top-[17%] rounded-xl h-[80%] left-[10%] w-[80%] bg-black/15 flex flex-col">
            <div className="mt-4 ml-[72%] h-[10%] text-2xl flex-end font-pixel bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
                <p className="flex flex-row">
                    VOYAGE VIBES
                </p>
            </div>

            <div className="h-full w-full overflow-y-auto px-6 py-4 flex flex-row">
                {/* Input Form Section */}
                <div className="mb-8 w-1/2 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
                    <div className="mb-4">
                        <label className="block text-xs font-pixel text-violet-300 mb-2">Travel Photo</label>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border border-dashed border-orange-400/50 rounded-lg p-4 cursor-pointer hover:bg-purple-500/10 transition"
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImage(null);
                                            setPreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Upload size={24} className="mx-auto mb-2 text-orange-400" />
                                    <p className="text-orange-400 font-pixel text-xs">Click to upload a travel photo</p>
                                    <p className="text-xs text-purple-300/70 mt-1 font-pixel">JPG, PNG or GIF files</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-pixel text-violet-300 mb-2">📍 Location</label>
                        <input
                            type="text"
                            placeholder="Where was this photo taken?"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 bg-black/20 border border-orange-400/50 rounded-lg outline-none transition text-xs font-pixel text-orange-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-pixel text-violet-300 mb-2">📝 Travel Note</label>
                        <textarea
                            placeholder="Share your thoughts, feelings, or a brief moment..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-black/20 border border-orange-400/50 rounded-lg outline-none transition text-xs font-pixel text-orange-300 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleAddEntry}
                        disabled={isGenerating || (!location || !note)}
                        className={`w-full py-2 px-4 rounded-lg text-xs font-pixel flex items-center justify-center
                        ${isGenerating || !location || !note
                            ? 'bg-black/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-violet-500/70 to-orange-500/70 text-white hover:opacity-90'
                        }`}
                    >
                        {isGenerating ? (
                            <>
                                <div className="flex space-x-2 mr-2">
                                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <span>Crafting Your Story...</span>
                            </>
                        ) : (
                            <>
                                <PlusCircle size={14} className="mr-2" />
                                <span>Generate AI Travel Story</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Journal Entries Gallery */}
                <div className="ml-8 flex-grow">
                    <h2 className="text-sm font-pixel text-orange-300 mb-4 pb-2 border-b-3 border-purple-500/20">
                        📓 Your Travel Memories
                    </h2>

                    {journal.length === 0 ? (
                        <div className="text-center py-8 bg-black/20 rounded-xl border border-purple-500/20">
                            <p className="text-gray-400 font-pixel text-xs">Your travel journal is empty. Add your first memory above!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {journal.map((entry, idx) => (
                                <div 
                                    key={idx} 
                                    className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 border-2 border-orange-500/30 h-48"
                                    onClick={() => showEntryDetails(entry)}
                                >
                                    {entry.image ? (
                                        <img
                                            src={entry.image}
                                            alt={`Travel to ${entry.location}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-orange-500/30 flex items-center justify-center">
                                            <p className="text-orange-300 font-pixel text-xs">No Image</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                        <h3 className="text-xs font-bold font-pixel text-orange-400 truncate">{entry.location}</h3>
                                        <p className="text-xs text-purple-300/70 font-pixel truncate">{entry.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Entry Details - Fixed with improved closing logic */}
            {selectedEntry && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={closeEntryDetails} // Close when clicking on the backdrop
                >
                    <div 
                        ref={modalRef}
                        className="bg-black/90 rounded-xl border border-orange-500/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-none"
                        onClick={handleModalContentClick} // Prevent propagation to parent
                    >
                        <div className="flex justify-between items-center p-4 border-b border-purple-500/30">
                            <h3 className="text-lg font-bold font-pixel text-orange-400">{selectedEntry.location}</h3>
                            <button 
                                onClick={closeEntryDetails}
                                className="text-violet-300 hover:text-orange-400 transition bg-black/40 p-2 rounded-full hover:bg-black/60 hover:cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4">
                            {selectedEntry.image && (
                                <div className="mb-4">
                                    <img
                                        src={selectedEntry.image}
                                        alt={`Travel to ${selectedEntry.location}`}
                                        className="w-full h-64 object-cover rounded-lg border border-orange-500/30"
                                    />
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-violet-300 font-pixel">
                                        <strong>Location:</strong> {selectedEntry.location}
                                    </p>
                                    <p className="text-xs text-purple-300/70 font-pixel">{selectedEntry.date}</p>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-sm text-violet-300 font-pixel">
                                    <strong>Note:</strong> {selectedEntry.note}
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-500/20 to-orange-500/20 p-4 rounded-lg border-l-2 border-orange-400">
                                <p className="italic text-orange-300 text-sm leading-relaxed font-pixel">{selectedEntry.story}</p>
                            </div>
                        </div>
                        
                        {/* Additional close button at bottom */}
                        <div className="p-4 border-t border-purple-500/30 flex justify-center">
                            <button 
                                onClick={closeEntryDetails}
                                className="px-4 py-2 bg-gradient-to-r from-violet-500/70 to-orange-500/70 text-white text-xs font-pixel rounded-lg hover:opacity-90 transition hover:cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelJournal;