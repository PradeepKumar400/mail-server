import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { emailAPI } from '../services/api';
import logo from '../assets/bluechat_logo.webp';

const CreateMailbox = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get state passed from Register page
    const { tempToken, password, username } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailName, setEmailName] = useState('');

    useEffect(() => {
        // Redirect if no token (user didn't come from registration)
        if (!tempToken) {
            navigate('/register');
        }
    }, [tempToken, navigate]);

    const handleCreateEmail = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailName) {
            setError('Email name is required');
            return;
        }

        setLoading(true);

        try {
            // Call API with tempToken
            const response = await emailAPI.createEmail({
                emailName: emailName,
                password: password
            }, tempToken);

            if (response.data.success) {
                // Success! Redirect to login
                alert(`Email created successfully: ${response.data.data.email}`);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                {/* Logo */}
                <div className="text-center">
                    <img src={logo} alt="BTC Mail" className="mx-auto h-16 w-auto" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create Your Email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Choose your email address for {username}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleCreateEmail}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose your email address
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                            <input
                                type="text"
                                name="emailName"
                                value={emailName}
                                onChange={(e) => setEmailName(e.target.value)}
                                required
                                pattern="[a-z0-9._-]+"
                                className="flex-1 px-3 py-2 focus:outline-none"
                                placeholder="yourname"
                            />
                            <span className="px-3 py-2 bg-gray-100 text-gray-600 font-medium">
                                @btctech.shop
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Lowercase letters, numbers, dots, hyphens only
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating Email...' : 'Create Email'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateMailbox;
