import React, { useState, useEffect } from 'react';
import { Download, Zap, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { DoodlePeopleIcon, DoodleChartIcon, DoodleTargetIcon, DoodleLightbulbIcon } from './Icons';

// This is a new, separate component for the Enrichment Modal
const EnrichmentModal = ({ brands, setBrands, onConfirm, onCancel }) => {
    const handleBrandChange = (index, value) => {
        const newBrands = [...brands];
        newBrands[index] = value;
        setBrands(newBrands);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-yellow-100 p-6 rounded-xl border-4 border-black w-full max-w-md" style={{boxShadow: '8px 8px 0px #000'}}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-black">Confirm Brands</h3>
                    <button onClick={onCancel} className="p-1 hover:bg-red-200 rounded-full"><X size={24}/></button>
                </div>
                <p className="text-gray-700 mb-4">To get the best Qloo insights, feel free to adjust this list to include well-known, real-world brands.</p>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {brands.map((brand, index) => (
                        <input
                            key={index}
                            type="text"
                            value={brand}
                            onChange={(e) => handleBrandChange(index, e.target.value)}
                            className="w-full p-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                        />
                    ))}
                </div>
                <div className="mt-6 flex gap-4">
                    <button onClick={onCancel} className="flex-1 p-3 bg-gray-300 text-black font-bold rounded-lg border-2 border-black hover:bg-gray-400 transition">Cancel</button>
                    <button onClick={() => onConfirm(brands)} className="flex-1 p-3 bg-purple-400 text-black font-bold rounded-lg border-2 border-black hover:bg-purple-500 transition">Confirm & Enrich</button>
                </div>
            </div>
        </div>
    );
};

export const PersonaDisplay = ({ persona, setPersonas, personas, onStartRoleplay, onBack }) => {
    // <-- THE FIX: All useState and useEffect calls have been moved to the top level.
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichmentMessage, setEnrichmentMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableBrands, setEditableBrands] = useState(persona ? persona.favouriteBrands || [] : []);

    // This useEffect hook is now also correctly called unconditionally.
    useEffect(() => {
        if (persona) {
            setEditableBrands(persona.favouriteBrands || []);
        }
    }, [persona]);
    
    // We now have an early return if there is no persona, AFTER all hooks have been called.
    if (!persona) return null;

    const handleEnrichPersona = async (brandsToEnrich) => {
        setIsModalOpen(false);
        setIsEnriching(true);
        setEnrichmentMessage(null);

        const callQlooProxy = async (targetPath, params) => {
            const proxyUrl = '/.netlify/functions/qloo-proxy';
            const response = await axios.post(proxyUrl, { targetPath, params });
            return response.data;
        };

        try {
            const safeBrands = (brandsToEnrich || []).filter(Boolean);
            if (safeBrands.length === 0) throw new Error("No valid brands to enrich.");

            const primaryBrandName = safeBrands[0];
            
            const searchResult = await callQlooProxy('/v2/search', {
                'query': primaryBrandName,
                'type': 'urn:entity:brand',
                'limit': 1
            });
            
            const primaryBrandId = searchResult.data?.[0]?.id;
            if (!primaryBrandId) throw new Error(`Could not find the brand "${primaryBrandName}".`);

            const typeMap = {
                'Brand Affinities': 'urn:entity:brand',
                'Dining Habits': 'urn:entity:place',
                'Podcast Preferences': 'urn:entity:podcast'
            };

            const insights = {};
            for (const [key, entityType] of Object.entries(typeMap)) {
                const insightsParams = {
                    'filter.type': entityType,
                    'signal.interests.entities': primaryBrandId,
                    'take': 5
                };
                const insightsResult = await callQlooProxy('/v2/insights', insightsParams);
                insights[key] = (insightsResult.entities || []).map(i => i.name);
            }

            const updatedPersonas = personas.map(p =>
                p.id === persona.id ? { ...p, qlooInsights: insights, favouriteBrands: brandsToEnrich } : p
            );
            setPersonas(updatedPersonas);
            setEnrichmentMessage({ type: 'success', text: 'Persona enriched with powerful marketing insights!' });
        } catch (err) {
            console.error("Error enriching persona:", err);
            const errorMessage = err.response?.data?.error || err.message;
            setEnrichmentMessage({ type: 'error', text: `Error: ${errorMessage}` });
        } finally {
            setIsEnriching(false);
        }
    };
    
    const handleDownloadPersona = () => {
        let content = `Persona: ${persona.name}\n`;
        content += `For Business: ${persona.businessInfo.business}\n\n`;
        content += `========================\n`;

        panels.forEach(panel => {
            content += `${panel.title.toUpperCase()}\n------------------------\n`;
            if (panel.key === 'demographics') {
                Object.entries(persona.demographics || {}).forEach(([key, value]) => {
                    content += `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}\n`;
                });
            } else {
                (persona[panel.key] || []).forEach(item => {
                    content += `- ${item}\n`;
                });
            }
            content += `\n`;
        });
        
        if(persona.qlooInsights) {
             content += `Qloo Cultural Insights\n------------------------\n`;
             Object.entries(persona.qlooInsights).forEach(([key, value]) => {
                content += `${key}:\n- ${(value || []).join('\n- ')}\n\n`;
            });
        }

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
        <>
            {isModalOpen && <EnrichmentModal brands={editableBrands} setBrands={setEditableBrands} onConfirm={handleEnrichPersona} onCancel={() => setIsModalOpen(false)} />}
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

                {enrichmentMessage && (
                     <div className={`mt-6 p-4 rounded-xl border-4 border-black ${enrichmentMessage.type === 'error' ? 'bg-red-300' : 'bg-green-300'}`}>
                        <p className="font-bold text-center text-black">{enrichmentMessage.text}</p>
                    </div>
                )}

                {persona.qlooInsights && (
                    <div className="mt-6 p-6 bg-purple-200 rounded-xl border-4 border-black">
                        <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-2"><Zap size={24}/> Qloo Cultural Insights</h3>
                        {Object.entries(persona.qlooInsights).map(([key, value]) => (
                            <div key={key} className="mb-3">
                                <h4 className="font-bold text-lg">{key}:</h4> 
                                <p className="text-black">{(value || []).join(', ')}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center flex flex-wrap justify-center items-center gap-4">
                    <button onClick={onStartRoleplay} className="px-8 py-4 bg-yellow-400 text-black font-bold text-xl rounded-lg border-4 border-black hover:bg-yellow-500 transition transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}}>
                        Roleplay with {persona.name}!
                    </button>
                    <button onClick={handleDownloadPersona} className="p-4 bg-blue-400 text-black font-bold rounded-lg border-4 border-black hover:bg-blue-500 transition transform hover:scale-105 active:scale-100" style={{boxShadow: '8px 8px 0px #000'}} title="Download Persona">
                        <Download className="w-6 h-6" />
                    </button>
                     <button onClick={() => setIsModalOpen(true)} disabled={isEnriching} className="p-4 bg-purple-400 text-black font-bold rounded-lg border-4 border-black hover:bg-purple-500 transition transform hover:scale-105 active:scale-100 disabled:bg-gray-400" style={{boxShadow: '8px 8px 0px #000'}} title="Enrich with Qloo Insights">
                        {isEnriching ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Zap className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </>
    );
};
