"use client"
// VideoPlayer.jsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Card } from 'primereact/card';
import Player2 from '@/components/version/player';
import { SplitButton } from 'primereact/splitbutton';
import { MenuItem } from 'primereact/menuitem';
import { MultiSelect } from 'primereact/multiselect';

const VideoPlayer = ({
    videoSrc = "/sample-video.mp4",
    title = "Video Title",
    description = "Video description goes here. You can provide details about the video content.",
    tags = ["Tag 1", "Tag 2", "Tag 3"]
}) => {
    // Video version settings
    const [videoVersion, setVideoVersion] = useState('1.0.0');
    
    const videoVersionOptions = [
        { label: 'Version 1.0.0', value: '1.0.0' },
        { label: 'Version 1.1.0', value: '1.1.0' },
        { label: 'Version 1.2.0', value: '1.2.0' },
        { label: 'Version 2.0.0', value: '2.0.0' }
    ];
    
    // Display classes for object detection
    const objectClasses = [
        { name: 'Building', key: 'building' },
        { name: 'Car', key: 'car' },
        { name: 'Human', key: 'human' },
        { name: 'Road', key: 'road' },
        { name: 'Tree', key: 'tree' },
        { name: 'Bicycle', key: 'bicycle' },
        { name: 'Traffic Light', key: 'traffic_light' },
        { name: 'Sign', key: 'sign' }
    ];
    
    const [selectedClasses, setSelectedClasses] = useState(['building', 'car', 'human', 'road']);
    const [showObjectLabels, setShowObjectLabels] = useState(true);

    const items: MenuItem[] = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            // command: () => {
            //     //router.push('/fileupload');
            // }
        }
    ];

    const resetToDefaults = () => {
        setVideoVersion('1.0.0');
        setSelectedClasses(['building', 'car', 'human', 'road']);
        setShowObjectLabels(true);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Player Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-md overflow-hidden shadow-lg bg-black" >
                        <Player2 />
                    </div>

                    {/* Description Card */}
                    <Card className="shadow-md">
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-xl font-bold">{title}</h2>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <span className="mr-2">
                                        <i className="pi pi-calendar mr-1"></i>
                                        {new Date().toLocaleDateString()}
                                    </span>
                                    <span>
                                        <i className="pi pi-eye mr-1"></i>
                                        {Math.floor(Math.random() * 10000).toLocaleString()} views
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-1">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-gray-700">{description}</p>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div className="flex gap-2">
                                    <Button icon="pi pi-thumbs-up" className="p-button-text p-button-rounded" />
                                    <Button icon="pi pi-thumbs-down" className="p-button-text p-button-rounded" />
                                    <Button icon="pi pi-share-alt" className="p-button-text p-button-rounded" />
                                </div>
                                <SplitButton label="Export" icon="pi pi-download" className="p-button-outlined" model={items} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Settings Panel Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Video Settings</h3>

                        <div className="space-y-6">
                            {/* Video Version Section */}
                            <div>
                                <h4 className="font-medium mb-2">Video Version</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm">Version:</label>
                                        <Dropdown
                                            value={videoVersion}
                                            options={videoVersionOptions}
                                            onChange={(e) => setVideoVersion(e.value)}
                                            className="w-40"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Object Detection Section */}
                            <div>
                                <h4 className="font-medium mb-2">Object Detection</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm block mb-2">Display Classes:</label>
                                        <MultiSelect
                                            value={selectedClasses}
                                            options={objectClasses}
                                            onChange={(e) => setSelectedClasses(e.value)}
                                            optionLabel="name"
                                            optionValue="key"
                                            display="chip"
                                            placeholder="Select Objects"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm">Show Labels:</label>
                                        <ToggleButton
                                            checked={showObjectLabels}
                                            onChange={(e) => setShowObjectLabels(e.value)}
                                            onLabel="On"
                                            offLabel="Off"
                                            className="w-20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div className="pt-2">
                                <Button
                                    label="Apply"
                                    icon="pi pi-check"
                                    className="w-full"
                                />
                            </div>
                            
                            {/* Reset Button */}
                            <div>
                                <Button
                                    label="Reset to Default"
                                    icon="pi pi-refresh"
                                    className="p-button-outlined w-full"
                                    onClick={resetToDefaults}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;