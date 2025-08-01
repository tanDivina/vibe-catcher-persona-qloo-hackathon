import React from 'react';
import { Users, PlusCircle, Trash2 } from 'lucide-react';

export const PersonaLibrary = ({ personas, setStep, setActivePersonaId, deletePersona }) => {
    return (
        <div className="p-6 sm:p-8 bg-yellow-100 h-full grid grid-rows-[auto_1fr_auto]">
            <div className="text-center mb-8">
                <div className="inline-flex justify-center items-center gap-3 p-4 bg-green-400 text-black rounded-lg border-4 border-black" style={{boxShadow: '8px 8px 0px #000'}}>
                    <Users className="w-12 h-12 text-black" />
                    <h1 className="text-4xl font-extrabold" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Persona Library</h1>
                </div>
            </div>
            <div className="overflow-y-auto -mr-6 pr-6 min-h-0">
                 {personas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {personas.map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-lg border-4 border-black flex flex-col gap-3" style={{boxShadow: '8px 8px 0px #000'}}>
                                <h3 className="font-bold text-2xl truncate">{p.name}</h3>
                                <p className="text-sm text-gray-600 flex-grow">For: {p.businessInfo.business}</p>
                                <div className="flex gap-2 mt-auto">
                                    <button onClick={() => { setActivePersonaId(p.id); setStep('persona'); }} className="flex-1 p-2 bg-blue-400 text-black font-bold rounded-lg border-2 border-black hover:bg-blue-500 transition">View</button>
                                    <button onClick={() => deletePersona(p.id)} className="p-2 bg-red-400 text-black font-bold rounded-lg border-2 border-black hover:bg-red-500 transition"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg text-center">Your persona library is empty.<br/>Create one to get started!</p>
                    </div>
                )}
            </div>
            <div className="pt-4">
                <button onClick={() => setStep('questions')} className="w-full flex items-center justify-center p-5 bg-blue-400 text-black font-bold text-xl rounded-lg border-4 border-black hover:bg-blue-500 transition transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}}>
                    <PlusCircle className="w-6 h-6 mr-3" />
                    Create New Persona
                </button>
            </div>
        </div>
    );
};
