import { useState } from "react";

const SearchBar = ({ title, placeholder, buttonLabel, onSearch, onAdd }) => {
    const [term, setTerm] = useState("");
    const handleSearchClick = () => {
        onSearch(term);
    };
    return (
        <div className="content-header font-bold bg-gradient-to-br from-blue-900 to-cyan-900 text-white rounded">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6 d-flex align-items-center">
                        <h1 className="m-0">{title}</h1>

                    </div>
                    <div className="col-sm-6 d-flex justify-content-end align-items-center">
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="form-control mr-2"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchClick();
                                }
                            }}
                        // onChange={(e) => {
                        //     onSearch(e.target.value);
                        // }}
                        />
                        <button
                            onClick={handleSearchClick}
                            className="font-bold btn btn-secondary"
                        >
                            Buscar
                        </button>
                        {onAdd && buttonLabel && (
                            <button
                                onClick={onAdd}
                                className="font-bold btn btn-secondary ml-2"
                            >
                                {buttonLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
