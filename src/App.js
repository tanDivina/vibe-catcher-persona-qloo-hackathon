import React, { useState, useEffect, useRef } from 'react';
import { User, Send, CornerDownLeft, Bot, Download, PlusCircle, Users, MessageSquare, Trash2, ArrowLeft, Zap, X } from 'lucide-react';
import axios from 'axios';

// --- Custom Hand-Drawn SVG Icons ---
const DoodlePeopleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.68,32.41C45.68,43.2,36.72,52,26.84,52S8,43.2,8,32.41,16.95,22.82,26.84,22.82,45.68,21.62,45.68,32.41Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M52,78s-1.4-20.4,11.6-26.8c0,0,12-4.8,22.4,0,0,0,12.4,6,12.4,26.8" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M86.11,44.29c0,9.33-7.11,16.89-15.89,16.89s-15.89-7.56-15.89-16.89S62.44,27.4,70.22,27.4,86.11,34.96,86.11,44.29Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="32" r="2" fill="black"/>
        <circle cx="32" cy="32" r="2" fill="black"/>
        <path d="M24 40 Q 27 44 30 40" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
);

const DoodleChartIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 V 30 L 30 45 L 50 20 L 70 40 L 90 10" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 70 H 95" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="30" cy="45" r="4" fill="white" stroke="black" strokeWidth="2"/>
        <circle cx="50" cy="20" r="4" fill="white" stroke="black" strokeWidth="2"/>
        <circle cx="70" cy="40" r="4" fill="white" stroke="black" strokeWidth="2"/>
        <circle cx="90" cy="10" r="4" fill="white" stroke="black" strokeWidth="2"/>
    </svg>
);

const DoodleTargetIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="30" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="40" r="18" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="40" r="6" fill="black"/>
        <path d="M50 75 L 50 85" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 85 H 60" stroke="black" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

const DoodleLightbulbIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,16.33c-12.25,0-22.17,9.92-22.17,22.17,0,8.45,4.75,15.75,11.67,19.5v5.33h21v-5.33c6.92-3.75,11.67-11.05,11.67-19.5C72.17,26.25,62.25,16.33,50,16.33Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M42 67h16" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M38 72h24" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 5 V 16" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M30 15 l 7 7" stroke="black" strokeWidth="3" strokeLinecap="round"/>
        <path d="M70 15 l -7 7" stroke="black" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

const DoodleSparkleIcon = ({ className }) => (
     <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 5L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 17L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 7L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 17L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const DoodleSmileyIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 12 Q 40 4 45 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M30 10 Q 35 2 40 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M40 10 Q 45 2 50 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="30" cy="35" r="3" fill="currentColor"/>
        <circle cx="50" cy="35" r="3" fill="currentColor"/>
        <path d="M25 50 Q 40 65 55 50" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
);


// Main App Component
const App = () => {
    const [step, setStep] = useState('library');
    const [businessInfo, setBusinessInfo] = useState({ business: '', selling: '', audience: '' });
    const [personas, setPersonas] = useState([]);
    const [activePersonaId, setActivePersonaId] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        try {
            const savedPersonas = localStorage.getItem('vibeCatcherPersonas');
            if (savedPersonas) {
                setPersonas(JSON.parse(savedPersonas));
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('vibeCatcherPersonas', JSON.stringify(personas));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [personas]);

    const handleInputChange = (e) => {
        setErrorMessage(null);
        const { name, value } = e.target;
        setBusinessInfo(prev => ({ ...prev, [name]: value }));
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    const activePersona = personas.find(p => p.id === activePersonaId);
    useEffect(() => {
        if (step === 'roleplay') {
            scrollToBottom();
        }
    }, [activePersona?.chatHistory]);

    const generatePersona = async () => {
        if (!businessInfo.business || !businessInfo.selling) {
            setErrorMessage("Please fill out the first two fields to get started.");
            return;
        }
        setErrorMessage(null);
        setIsLoading(true);
        setStep('generating');

        const prompt = `
            You are an expert digital marketing researcher. Based on the following business information, create a detailed user persona.
            - Business: "${businessInfo.business}"
            - Selling: "${businessInfo.selling}"
            - Known Audience Info: "${businessInfo.audience}"
            **IMPORTANT**: Your response MUST be a single, valid JSON object that conforms to the schema. Do NOT include any special characters like newlines or unescaped quotes inside the JSON values.
        `;
        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING" },
                    demographics: { type: "OBJECT", properties: { location: { type: "STRING" }, income: { type: "STRING" }, maritalStatus: { type: "STRING" }, gender: { type: "STRING" }, age: { type: "NUMBER" } } },
                    definingTraits: { type: "ARRAY", items: { type: "STRING" } },
                    goals: { type: "ARRAY", items: { type: "STRING" } },
                    frustrations: { type: "ARRAY", items: { type: "STRING" } },
                    informationalNeeds: { type: "ARRAY", items: { type: "STRING" } },
                    preferredPlatforms: { type: "ARRAY", items: { type: "STRING" } },
                    marketingMessages: { type: "ARRAY", items: { type: "STRING" } }
                }
            }
        };
        
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig };
            const apiKey = ""; // You must manage your Gemini API key securely
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            
            const result = await response.json();
            const rawText = result.candidates?.?.content?.parts?.?.text;

            if (rawText) {
                try {
                    const personaData = JSON.parse(rawText);
                    const newPersona = {
                        id: Date.now(),
                        ...personaData,
                        businessInfo: businessInfo,
                        chatHistory: []
                    };
                    setPersonas(prev => [...prev, newPersona]);
                    setBusinessInfo({ business: '', selling: '', audience: '' });
                    setStep('library');
                } catch (jsonError) {
                    console.error("Failed to parse JSON from Gemini:", rawText, jsonError);
                    throw new Error("The AI model returned a malformed response. Please try again.");
                }
            } else {
                throw new Error("Invalid response structure from the AI model.");
            }
        } catch (error) {
            console.error("Error generating persona:", error);
            setErrorMessage(error.message);
            setStep('questions');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRoleplaySubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;
        const currentPersona = personas.find(p => p.id === activePersonaId);
        const newHistory = [...(currentPersona.chatHistory || []), { role: 'user', text: userInput }];
        const updatedPersonas = personas.map(p => p.id === activePersonaId ? {...p, chatHistory: newHistory} : p);
        setPersonas(updatedPersonas);
        setUserInput('');
        setIsLoading(true);
        const personaDetails = JSON.stringify(currentPersona, null, 2);
        const chatHistoryString = newHistory.map(m => `${m.role}: ${m.text}`).join('\n');
        const prompt = `You ARE the persona: ${personaDetails}. You are in honest mode and MUST be brutally honest and unfiltered. You are talking to someone from "${currentPersona.businessInfo.business}". Your conversation history is: ${chatHistoryString}. The user's new question is: "${userInput}". Give your raw, direct response. Do not break character.`;
        
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = ""; // You must manage your Gemini API key securely
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.candidates?.?.content?.parts?.?.text) {
                const botResponse = result.candidates.content.parts.text;
                const finalHistory = [...newHistory, { role: 'bot', text: botResponse }];
                const finalUpdatedPersonas = personas.map(p => p.id === activePersonaId ? {...p, chatHistory: finalHistory} : p);
                setPersonas(finalUpdatedPersonas);
            } else {
                 throw new Error("Invalid API response.");
            }
        } catch (error) {
            console.error("Error in roleplay chat:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const deletePersona = (id) => {
        setPersonas(personas.filter(p => p.id !== id));
    };

    const renderStep = () => {
        switch (step) {
            case 'generating':
                return <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-yellow-100"><DoodleSparkleIcon className="w-24 h-24 text-yellow-500 animate-pulse mb-6" /><h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Brewing up a persona...</h2><p className="text-gray-600">Our creative juices are flowing!</p></div>;
            case 'persona':
                return <PersonaDisplay persona={activePersona} setPersonas={setPersonas} personas={personas} onStartRoleplay={() => setStep('roleplay')} onBack={() => setStep('library')} />;
            case 'roleplay':
                return <RoleplayChat persona={activePersona} history={activePersona.chatHistory} userInput={userInput} setUserInput={setUserInput} handleSubmit={handleRoleplaySubmit} isLoading={isLoading} chatEndRef={chatEndRef} onBack={() => setStep('persona')} onHome={() => setStep('library')} />;
            case 'questions':
                const formFields = [ {name: 'business', label: "1. What's your business?", placeholder: "e.g., A funky sock subscription", type: 'input'}, {name: 'selling', label: "2. What are you selling?", placeholder: "e.g., The wildest, comfiest socks in the universe", type: 'input'}, {name: 'audience', label: "3. What do you already know? (Optional)", placeholder: "e.g., They like memes and hate boring feet", type: 'textarea'}, ];
                return (
                    <div className="p-6 sm:p-8 bg-blue-100 h-full overflow-y-auto">
                        <div className="text-center relative">
                             <button onClick={() => setStep('library')} className="absolute top-0 left-0 p-2 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black hover:bg-yellow-500 transition" title="Back to Library"><ArrowLeft size={20}/></button>
                             <div className="inline-flex justify-center items-center gap-3 p-4 bg-green-400 text-black rounded-lg border-4 border-black" style={{boxShadow: '8px 8px 0px #000'}}><DoodleSmileyIcon className="w-12 h-12 text-black" /><h1 className="text-4xl font-extrabold" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Vibe Catcher</h1></div>
                            <p className="text-gray-600 mt-4">Answer these 3 things to cook up a customer persona.</p>
                        </div>
                        {errorMessage && (<div className="my-4 p-4 bg-red-200 text-red-800 border-4 border-black rounded-lg" style={{boxShadow: '8px 8px 0px #000'}}><p className="font-bold text-lg">Oops, an error occurred!</p><p>{errorMessage}</p></div>)}
                        <div className="space-y-6 py-8">
                            {formFields.map(item => (<div key={item.name}><label htmlFor={item.name} className="block text-md font-bold text-gray-700 mb-2">{item.label}</label>{item.type === 'textarea' ? ( <textarea name={item.name} id={item.name} value={businessInfo[item.name]} onChange={handleInputChange} rows="3" className="w-full p-4 bg-white border-4 border-black rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-black transition text-lg" placeholder={item.placeholder} /> ) : ( <input type="text" name={item.name} id={item.name} value={businessInfo[item.name]} onChange={handleInputChange} className="w-full p-4 bg-white border-4 border-black rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-black transition text-lg" placeholder={item.placeholder} /> )}</div>))}
                        </div>
                        <div className="pb-4"><button onClick={generatePersona} disabled={isLoading} className="w-full flex items-center justify-center p-5 bg-green-400 text-black font-bold text-xl rounded-lg border-4 border-black hover:bg-green-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}}><DoodleSparkleIcon className="w-6 h-6 mr-3" />{isLoading ? 'Thinking...' : 'Make the Persona!'}</button></div>
                    </div>
                );
            case 'library':
            default:
                return <PersonaLibrary personas={personas} setStep={setStep} setActivePersonaId={setActivePersonaId} deletePersona={deletePersona} />;
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen font-sans flex items-center justify-center p-4" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
            <div className="w-full max-w-4xl rounded-2xl border-4 border-black shadow-2xl overflow-hidden flex flex-col bg-yellow-100" style={{minHeight: '80vh', maxHeight: '90vh', boxShadow: '12px 12px 0px rgba(0,0,0,0.8)'}}>
                {renderStep()}
            </div>
        </div>
    );
};

const PersonaLibrary = ({ personas, setStep, setActivePersonaId, deletePersona }) => {
    return (
        <div className="p-6 sm:p-8 bg-yellow-100 h-full grid grid-rows-[auto_1fr_auto]">
            <div className="text-center mb-8">
                <div className="inline-flex justify-center items-center gap-3 p-4 bg-green-400 text-black rounded-lg border-4 border-black" style={{boxShadow: '8px 8px 0px #000'}}><Users className="w-12 h-12 text-black" /><h1 className="text-4xl font-extrabold" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Persona Library</h1></div>
            </div>
            <div className="overflow-y-auto -mr-6 pr-6 min-h-0">
                 {personas.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{personas.map(p => (<div key={p.id} className="bg-white p-4 rounded-lg border-4 border-black flex flex-col gap-3" style={{boxShadow: '8px 8px 0px #000'}}><h3 className="font-bold text-2xl truncate">{p.name}</h3><p className="text-sm text-gray-600 flex-grow">For: {p.businessInfo.business}</p><div className="flex gap-2 mt-auto"><button onClick={() => { setActivePersonaId(p.id); setStep('persona'); }} className="flex-1 p-2 bg-blue-400 text-black font-bold rounded-lg border-2 border-black hover:bg-blue-500 transition">View</button><button onClick={() => deletePersona(p.id)} className="p-2 bg-red-400 text-black font-bold rounded-lg border-2 border-black hover:bg-red-500 transition"><Trash2 size={20}/></button></div></div>))}</div>) : (<div className="flex items-center justify-center h-full"><p className="text-gray-500 text-lg text-center">Your persona library is empty.<br/>Create one to get started!</p></div>)}
            </div>
            <div className="pt-4"><button onClick={() => setStep('questions')} className="w-full flex items-center justify-center p-5 bg-blue-400 text-black font-bold text-xl rounded-lg border-4 border-black hover:bg-blue-500 transition transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}}><PlusCircle className="w-6 h-6 mr-3" />Create New Persona</button></div>
        </div>
    );
};

const PersonaDisplay = ({ persona, setPersonas, personas, onStartRoleplay, onBack }) => {
    if (!persona) return null;
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichmentMessage, setEnrichmentMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableBrands, setEditableBrands] = useState(persona.favouriteBrands || []);

    const handleDownloadPersona = () => {
        let content = `Persona: ${persona.name}\n`;
        content += `For Business: ${persona.businessInfo.business}\n\n`;
        content += "========================================\n";
        
        Object.entries(persona).forEach(([key, value]) => {
            if (['id', 'businessInfo', 'chatHistory', 'name'].includes(key)) return;
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            content += `${title}:\n`;
            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([dKey, dValue]) => {
                    content += `- ${dKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${dValue}\n`;
                });
            } else {
                content += Array.isArray(value) ? value.map(item => `- ${item}`).join('\n') : value;
            }
            content += "\n\n";
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `persona-${persona.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const panels = [
        { title: "Demographics", data: persona.demographics, key: 'demographics' },
        { title: "Goals", data: persona.goals, key: 'goals' },
        { title: "Frustrations", data: persona.frustrations, key: 'frustrations' },
        { title: "Preferred Platforms", data: persona.preferredPlatforms, key: 'preferredPlatforms' },
    ];
    
    const panelColors = ["bg-green-200", "bg-yellow-200", "bg-blue-200", "bg-red-200"];
    const panelIcons = [<DoodlePeopleIcon className="w-20 h-20" />, <DoodleTargetIcon className="w-20 h-20" />, <DoodleLightbulbIcon className="w-20 h-20" />, <DoodleChartIcon className="w-20 h-20" />];

    return (
        <>
            <div className="h-full overflow-y-auto p-4 sm:p-6 bg-yellow-100">
                <div className="text-center mb-6">
                    <h2 className="text-5xl font-extrabold text-gray-800">{persona.name}</h2>
                    <p className="text-lg text-gray-600">For: {persona.businessInfo.business}</p>
                     <button onClick={onBack} className="mt-2 text-sm text-gray-500 hover:text-black font-bold">← Back to Library</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {panels.map((panel, index) => (
                        <div key={panel.key} className={`${panelColors[index % panelColors.length]} p-6 rounded-xl border-4 border-black`}>
                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-bold text-black mb-4">{panel.title}</h3>
                                <div className="opacity-50">{panelIcons[index % panelIcons.length]}</div>
                            </div>
                            {panel.key === "demographics" ? (
                                <ul className="space-y-2 text-black">
                                    {Object.entries(panel.data || {}).map(([key, value]) => (
                                        <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}</li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="space-y-2 list-disc list-inside text-black">
                                    {(panel.data || []).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-6 bg-blue-200 rounded-xl border-4 border-black">
                    <h3 className="text-2xl font-bold text-black mb-4">Marketing Messages</h3>
                    <div className="space-y-3">
                        {(persona.marketingMessages || []).map((msg, index) => (
                            <p key={index} className="p-3 bg-white/50 rounded-lg border-2 border-black">"{msg}"</p>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center flex flex-wrap justify-center items-center gap-4">
                    <button onClick={onStartRoleplay} className="px-8 py-4 bg-yellow-400 text-black font-bold text-xl rounded-lg border-4 border-black hover:bg-yellow-500 transition transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}}>
                        Roleplay with {persona.name}!
                    </button>
                    <button onClick={handleDownloadPersona} className="p-4 bg-blue-400 text-black font-bold rounded-lg border-4 border-black hover:bg-blue-500 transition transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}} title="Download Persona">
                        <Download className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </>
    );
};

const RoleplayChat = ({ persona, history, userInput, setUserInput, handleSubmit, isLoading, chatEndRef, onBack, onHome }) => {
    
    const handleDownloadChat = () => {
        let content = `Chat History with ${persona.name}\n`;
        content += "========================================\n\n";
        (history || []).forEach(msg => {
            const prefix = msg.role === 'user' ? 'You' : persona.name;
            content += `${prefix}:\n${msg.text}\n\n----------------------------------------\n\n`;
        });
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-with-${persona.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-yellow-100 overflow-hidden">
            <header className="p-4 border-b-4 border-black flex justify-between items-center bg-yellow-200 flex-shrink-0">
                <div><h2 className="text-xl font-bold text-black">Chatting with {persona.name}</h2><p className="text-sm text-green-700 font-semibold">Honest Mode: ON</p></div>
                <div className="flex items-center gap-4">
                     <button onClick={onBack} className="p-2 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black hover:bg-yellow-500 transition" title="Back to Persona"><ArrowLeft className="w-5 h-5" /></button>
                     <button onClick={onHome} className="p-2 bg-green-400 text-black font-bold rounded-lg border-2 border-black hover:bg-green-500 transition" title="Back to Library"><Users className="w-5 h-5" /></button>
                    <button onClick={handleDownloadChat} className="p-2 bg-blue-400 text-black font-bold rounded-lg border-2 border-black hover:bg-blue-500 transition" title="Download Chat"><Download className="w-5 h-5" /></button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto min-h-0 p-6 space-y-6">
                {(history || []).map((msg, index) => (<div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>{msg.role === 'bot' && (<div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-black flex items-center justify-center text-black font-bold flex-shrink-0 text-xl">{persona.name.charAt(0)}</div>)}<div className={`max-w-md p-4 rounded-xl border-2 border-black ${msg.role === 'user' ? 'bg-green-300' : 'bg-blue-200'}`}><p className="text-md text-black">{msg.text}</p></div>{msg.role === 'user' && (<div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center text-black flex-shrink-0"><User className="w-6 h-6" /></div>)}</div>))}
                {isLoading && (<div className="flex items-end gap-3 justify-start"><div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-black flex items-center justify-center text-black font-bold flex-shrink-0"><Bot className="w-6 h-6 animate-pulse" /></div><div className="max-w-md p-4 rounded-xl border-2 border-black bg-blue-200"><div className="flex items-center space-x-2"><span className="w-3 h-3 bg-black rounded-full animate-bounce"></span><span className="w-3 h-3 bg-black rounded-full animate-bounce delay-75"></span><span className="w-3 h-3 bg-black rounded-full animate-bounce delay-150"></span></div></div></div>)}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t-4 border-black bg-yellow-100 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={`Ask ${persona.name} anything...`} className="w-full p-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-black transition text-lg" disabled={isLoading} />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-blue-400 text-black rounded-lg border-2 border-black hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"><Send className="w-6 h-6" /></button>
                </form>
            </div>
        </div>
    );
};

export default App;
