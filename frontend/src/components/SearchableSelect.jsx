import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, icon: Icon, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {/* The Trigger Box */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full pl-10 pr-10 py-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none
                    ${disabled ? 'bg-slate-100 dark:bg-slate-800/50 opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700/50'}
                    ${isOpen ? 'ring-2 ring-indigo-500/50 border-indigo-500 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}
                `}
            >
                {Icon && <Icon className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />}
                
                <span className={`text-sm font-medium ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                    {value || placeholder}
                </span>

                <ChevronDown 
                    size={16} 
                    className={`absolute right-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </div>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Sticky Search Input */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto no-scrollbar scroll-smooth">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                                        ${value === option 
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}
                                    `}
                                >
                                    {option}
                                    {value === option && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Inline Style to hide scrollbar across browsers */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default SearchableSelect;