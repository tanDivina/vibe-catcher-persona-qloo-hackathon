import React, { useState, useEffect } from 'react';
import { Download, Zap, X } from 'lucide-react';
import { DoodlePeopleIcon, DoodleChartIcon, DoodleTargetIcon, DoodleLightbulbIcon } from './Icons';

export const PersonaDisplay = ({ persona, setPersonas, personas, onStartRoleplay, onBack }) => {
    if (!persona) return null;

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
        link.download = `${persona.name.replace(/\s+/g, '_')}_persona.txt`;
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
    );
};
