import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUser } from '../../features/auth/authSlice'
import LeftSidebar from './LeftSidebar'
import { Link } from 'react-router-dom'
import SearchResult from '../../components/SearchResult'
// import RightSidebar from '../right sidebar/RightSidebar'

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

    }, [value])

    const onChangeHandler = (e) => {
        e.preventDefault()

        setValue(e.target.value)
    }

    return (
        <div className="min-h-screen bg-black">
            <LeftSidebar />

            {/* Main Content */}
            <div className="ml-80 min-h-screen">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
                    <div className="flex items-center h-14 space-x-4">
                        <h1 className="text-xl font-bold text-white flex-shrink-0 ml-4">Explore</h1>
                    </div>
                </div>

                {/* Search Container */}
                <div className="max-w-2xl">
                    {/* Search Input Section */}
                    <div className="border-b border-gray-800 bg-black">
                        <div className="space-y-4 w-full h-20 flex items-center justify-center">
                            <div className="relative w-full max-w-lg">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="text"
                                    placeholder="Search people..."
                                    className="w-full h-12 pl-10 pr-4 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={value}
                                    onChange={onChangeHandler}
                                />
                                {value && (
                                    <button
                                        onClick={() => setValue('')}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-800 rounded-full transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5 text-gray-500 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="bg-black">
                        {value ? (
                            searchResults && searchResults.length > 0 ? (
                                <div className="divide-y divide-gray-800">
                                    {searchResults
                                        .filter((result) =>
                                            result.NAME.toLowerCase().includes(value.toLowerCase())
                                        )
                                        .map((result, index) => (
                                            <Link
                                                to={`/profile/${result.NAME.toLowerCase()}`}
                                                key={index}
                                                className="block hover:bg-gray-950/50 transition-colors duration-200 cursor-pointer"
                                            >
                                                <SearchResult result={result} />
                                            </Link>
                                        ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-4 text-center h-64">
                                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">No results found</h3>
                                        <p className="text-gray-500 text-sm">Try searching for a different name</p>
                                    </div>
                                </div>
                            )
                        ) : (
                            /* Welcome/Trending Section */
                            <div className="space-y-6">
                                {/* Search Suggestions */}
                                <div className="border-b border-gray-800 h-32 flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto">
                                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Search for people</h2>
                                            <p className="text-gray-500 text-sm">Find and connect with other users</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trending or Recent Searches Placeholder */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white ml-4">Trending</h3>
                                    </div>

                                    {/* Trending Items Placeholder */}
                                    <div className="divide-y divide-gray-800">
                                        {[
                                            { topic: "#TechNews", posts: "12.5K posts" },
                                            { topic: "#WebDev", posts: "8.3K posts" },
                                            { topic: "#React", posts: "15.2K posts" },
                                            { topic: "#JavaScript", posts: "25.7K posts" }
                                        ].map((item, index) => (
                                            <div key={index} className="hover:bg-gray-950/50 transition-colors duration-200 cursor-pointer">
                                                <div className="flex items-center justify-between h-16 space-x-3">
                                                    <div className="flex flex-col space-y-1 ml-4">
                                                        <span className="text-sm text-gray-500">Trending in Technology</span>
                                                        <span className="font-bold text-white">{item.topic}</span>
                                                        <span className="text-sm text-gray-500">{item.posts}</span>
                                                    </div>
                                                    <div className="mr-4">
                                                        <button className="w-8 h-8 rounded-full hover:bg-gray-800 flex items-center justify-center transition-colors duration-200">
                                                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Explore