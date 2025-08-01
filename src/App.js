import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Bot, Download, PlusCircle, Users, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { DoodleSparkleIcon, DoodleSmileyIcon } from './components/Icons';
import { PersonaLibrary } from './components/PersonaLibrary';
import { PersonaDisplay } from './components/PersonaDisplay';
import { RoleplayChat } from './components/RoleplayChat';

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
            if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
        } catch (error) { console.error("Failed to load state", error); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('vibeCatcherPersonas', JSON.stringify(personas));
        } catch (error) { console.error("Failed to save state", error); }
    }, [personas]);

    const activePersona = personas.find(p => p.id === activePersonaId);
    
    useEffect(() => {
        if (step === 'roleplay' && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activePersona?.chatHistory, step]);

    const generatePersona = async () => { /* ... same as before ... */ };
    const handleRoleplaySubmit = async (e) => { /* ... same as before ... */ };
    
    const deletePersona = (id) => {
        setPersonas(personas.filter(p => p.id !== id));
    };

    const renderStep = () => {
        switch (step) {
            case 'generating':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-yellow-100">
                        <DoodleSparkleIcon className="w-24 h-24 text-yellow-500 animate-pulse mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Brewing up a persona...</h2>
                        <p className="text-gray-600">Our creative juices are flowing!</p>
                    </div>
                );
            case 'persona':
                return <PersonaDisplay persona={activePersona} setPersonas={setPersonas} personas={personas} onStartRoleplay={() => setStep('roleplay')} onBack={() => setStep('library')} />;
            case 'roleplay':
                return <RoleplayChat persona={activePersona} history={activePersona.chatHistory} userInput={userInput} setUserInput={setUserInput} handleSubmit={handleRoleplaySubmit} isLoading={isLoading} chatEndRef={chatEndRef} onBack={() => setStep('persona')} onHome={() => setStep('library')} />;
            case 'questions':
                return <PersonaForm businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} generatePersona={generatePersona} isLoading={isLoading} errorMessage={errorMessage} setErrorMessage={setErrorMessage} setStep={setStep} />;
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

const PersonaForm = ({ businessInfo, setBusinessInfo, generatePersona, isLoading, errorMessage, setErrorMessage, setStep }) => {
    const handleInputChange = (e) => {
        setErrorMessage(null);
        const { name, value } = e.target;
        setBusinessInfo(prev => ({ ...prev, [name]: value }));
    };

    const formFields = [ {name: 'business', label: "1. What's your business?", placeholder: "e.g., A funky sock subscription", type: 'input'}, {name: 'selling', label: "2. What are you selling?", placeholder: "e.g., The wildest, comfiest socks in the universe", type: 'input'}, {name: 'audience', label: "3. What do you already know? (Optional)", placeholder: "e.g., They like memes and hate boring feet", type: 'textarea'}, ];
    
    return (
        <div className="p-6 sm:p-8 bg-blue-100 h-full overflow-y-auto">
            <div className="text-center relative">
                 <button onClick={() => setStep('library')} className="absolute top-0 left-0 p-2 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black hover:bg-yellow-500 transition" title="Back to Library"><ArrowLeft size={20}/></button>
                 <div className="inline-flex justify-center items-center gap-3 p-4 bg-green-400 text-black rounded-lg border-4 border-black" style={{boxShadow: '8px 8px 0px #000'}}>
                    <DoodleSmileyIcon className="w-12 h-12 text-black" />
                    <h1 className="text-4xl font-extrabold" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Vibe Catcher</h1>
                </div>
                <p className="text-gray-600 mt-4">Answer these 3 things to cook up a customer persona.</p>
            </div>
            {errorMessage && (
                <div className="my-4 p-4 bg-red-200 text-red-800 border-4 border-black rounded-lg" style={{boxShadow: '8px 8px 0px #000'}}>
                    <p className="font-bold text-lg">Oops, an error occurred!</p>
                    <p>{errorMessage}</p>
                </div>
            )}
            <div className="space-y-6 py-8">
                {formFields.map(item => (
                    <div key={item.name}>
                        <label htmlFor={item.name} className="block text-md font-bold text-gray-700 mb-2">{item.label}</label>
                        {item.type === 'textarea' ? ( <textarea name={item.name} id={item.name} value={businessInfo[item.name]} onChange={handleInputChange} rows="3" className="w-full p-4 bg-white border-4 border-black rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-black transition text-lg" placeholder={item.placeholder} /> ) : ( <input type="text" name={item.name} id={item.name} value={businessInfo[item.name]} onChange={handleInputChange} className="w-full p-4 bg-white border-4 border-black rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-black transition text-lg" placeholder={item.placeholder} /> )}
                    </div>
                ))}
            </div>
            <div className="pb-4">
                <button onClick={generatePersona} disabled={isLoading} className="w-full flex items-center justify-center p-5 bg-green-400 text-black font-bold text-xl rounded-lg border-4 border-black hover:bg-green-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}}>
                    <DoodleSparkleIcon className="w-6 h-6 mr-3" />
                    {isLoading ? 'Thinking...' : 'Make the Persona!'}
                </button>
            </div>
        </div>
    );
}

export default App;
