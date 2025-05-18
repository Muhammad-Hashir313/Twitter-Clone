import React from 'react';

const SearchResult = ({ result }) => {
    return (
        <div className="flex gap-4 items-center h-16 w-100 px-4 border-b border-gray-800/40 text-white bg-transparent hover:bg-gray-800/20 transition-colors duration-200 cursor-pointer">
            <div className="flex-shrink-0">
                {result.profileImage ? (
                    <img
                        src={result.profileImage}
                        alt={`${result.NAME}'s profile`}
                        className="w-11 h-11 rounded-full object-cover border border-gray-700 hover:border-blue-400"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-gray-700/70 flex items-center justify-center">
                        <span className="text-gray-300 text-lg">{result.NAME.charAt(0).toUpperCase()}</span>
                    </div>
                )}
            </div>
            <div className="flex-grow min-w-0 py-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-white hover:text-blue-400">{result.NAME}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-xs">@{result.NAME}</span>
                        {result.followers && (
                            <span className="text-gray-500 text-xs">· {result.followers} followers</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;