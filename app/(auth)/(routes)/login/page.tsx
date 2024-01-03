import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-indigo-100">
            <div className="bg-white p-8 rounded shadow">
                <h2 className="text-2xl mb-4">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <button className="bg-blue-500 text-white rounded px-4 py-2">
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
