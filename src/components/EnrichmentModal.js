import React from 'react';
import { X } from 'lucide-react';

export const EnrichmentModal = ({ brands, setBrands, onConfirm, onCancel }) => {
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
                <p className="text-gray-700 mb-4">We think your persona would like these brands. To get the best Qloo insights, feel free to adjust this list to include well-known, real-world brands.</p>
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
