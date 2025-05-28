import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUser } from '../../features/auth/authSlice'
import LeftSidebar from './LeftSidebar'
import { Link } from 'react-router-dom'
import SearchResult from '../../components/SearchResult'

const Explore = () => {
    const dispatch = useDispatch()
    const [value, setValue] = useState('')
    const { searchResults, isError, message } = useSelector(state => state.auth)

    useEffect(() => {
        if (isError) {
            console.error(message)
        }

        if (value.trim().length > 0) {
            dispatch(searchUser({ name: value }))
        }
    }, [value, dispatch, isError, message])

    const onChangeHandler = (e) => {
        setValue(e.target.value)
    }

    const clearSearch = () => {
        setValue('')
    }

    const filteredResults = searchResults?.filter((result) =>
        result.NAME.toLowerCase().includes(value.toLowerCase())
    ) || []

    return (
        <div className="min-h-screen bg-black flex">
            <LeftSidebar />

            {/* Main Content - Using flex and positioning instead of margin */}
            <div className="flex-1 main-content" style={{ paddingLeft: '320px' }}>
                <div className="min-h-screen w-full max-w-4xl">
                    {/* Search Header */}
                    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/20">
                        <div className="h-16 flex items-center">
                            <div style={{ width: '24px' }}></div>
                            <div className="flex-1 max-w-lg">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                        <div style={{ width: '12px' }}></div>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Search people..."
                                        className="w-full h-10 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{
                                            paddingLeft: '2.5rem',
                                            paddingRight: value ? '2.5rem' : '1rem'
                                        }}
                                        value={value}
                                        onChange={onChangeHandler}
                                    />
                                    {value && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 flex items-center"
                                        >
                                            <div style={{ width: '12px' }}></div>
                                            <svg className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <div style={{ width: '12px' }}></div>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div style={{ width: '24px' }}></div>
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="w-full">
                        {value ? (
                            <div>
                                {filteredResults.length > 0 ? (
                                    <div className="divide-y divide-gray-800/40">
                                        {filteredResults.map((result, index) => (
                                            <Link
                                                to={`/profile/${result.NAME.toLowerCase()}`}
                                                key={index}
                                                className="block hover:bg-gray-800/20 transition-colors duration-200"
                                            >
                                                <SearchResult result={result} />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-4" style={{ height: '384px' }}>
                                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-white">No results found</h3>
                                            <p className="text-gray-500 text-sm">Try searching for something else</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4" style={{ height: '384px' }}>
                                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white">Search for people</h2>
                                    <p className="text-gray-500">Find and connect with people on the platform</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Responsive Design - Mobile and Tablet View */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    .main-content {
                        padding-left: 260px !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .main-content {
                        padding-left: 0 !important;
                        padding-top: 60px !important;
                    }
                }
                
                @media (max-width: 640px) {
                    .main-content {
                        padding-left: 0 !important;
                        padding-top: 60px !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default Explore