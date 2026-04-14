import { useState } from "react";

const SearchBar = ({ title, placeholder, buttonLabel, onSearch, onAdd }) => {
    const [term, setTerm] = useState("");

    const handleSearchClick = () => {
        onSearch(term);
    };

    return (
        <div className="content-header font-bold klinix-gradient rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="m-0 text-xl font-bold">{title}</h1>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:min-w-[250px]"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchClick();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleSearchClick}
                            className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white transition hover:bg-slate-800"
                        >
                            Buscar
                        </button>
                        {onAdd && buttonLabel && (
                            <button
                                type="button"
                                onClick={onAdd}
                                className="rounded-xl bg-white/15 px-4 py-2 font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20"
                            >
                                {buttonLabel}
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
