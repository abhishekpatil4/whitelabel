'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Loader } from 'rsuite'
import 'rsuite/Loader/styles/index.css'


export default function AppRequestForm({ user, open, setOpen }) {
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: user ? user.displayName : '',
        email: user ? user.email : '',
        appName: '',
        websiteLink: ''
    })

    useEffect(() => {
        // Update form data if user prop changes
        setFormData(prevData => ({
            ...prevData,
            name: user ? user.displayName : '',
            email: user ? user.email : ''
        }))
    }, [user])

    const sendDemoRequest = async (userData) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/requestdemo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending demo request:', error);
            throw error;
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const result = await sendDemoRequest(formData);
            console.log('Demo request submitted successfully:', result);
        } catch (error) {
            console.error('Failed to submit demo request:', error);
        } finally {
            setSubmitting(false)
            setOpen(false)
            setFormData(prevData => ({
                ...prevData,
                appName: '',
                websiteLink: ''
            }))
        }
    }

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
                <DialogBackdrop
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <DialogPanel
                            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                App Request
                            </DialogTitle>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="appName" className="block text-sm font-medium text-gray-700">App Name</label>
                                        <input
                                            type="text"
                                            name="appName"
                                            id="appName"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.appName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700">Website Link (Optional)</label>
                                        <input
                                            type="text"
                                            name="websiteLink"
                                            id="websiteLink"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.websiteLink}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="focus:outline-none text-white w-full bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                                    >
                                        {submitting ? <Loader speed="slow" size="sm" /> : "Submit Request"}
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
