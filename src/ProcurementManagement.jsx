import React, { useState, useEffect } from 'react';
import './ProcurementManagement.css';

const ProcurementManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ vin: '', model: '', mileage: '', driver: '', status: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/vehicles');
                if (!response.ok) {
                    const error = await response.json();
                    alert(`Failed to load vehicles: ${error.message}`);
                    return;
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                alert("Failed to load vehicles. Please try again.");
            }
        };

        fetchVehicles();
    }, []);

    const addVehicle = async () => {
        if (newVehicle.vin && newVehicle.model) {
            try {
                const response = await fetch('http://localhost:5000/api/vehicles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newVehicle),
                });

                if (response.ok) {
                    const savedVehicle = await response.json();
                    setVehicles((prevVehicles) => [...prevVehicles, savedVehicle]);
                    setNewVehicle({ vin: '', model: '', mileage: '', driver: '', status: '' });
                } else {
                    const error = await response.json();
                    alert(`Failed to add vehicle: ${error.message}`);
                }
            } catch (error) {
                console.error('Error adding vehicle:', error);
                alert("Failed to add vehicle. Please try again.");
            }
        } else {
            alert("VIN and Model are required!");
        }
    };

    const deleteVehicle = async (vin) => {
        try {
            const response = await fetch(`http://localhost:5000/api/vehicles/${vin}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setVehicles((prevVehicles) => prevVehicles.filter(vehicle => vehicle.vin !== vin));
            } else {
                const error = await response.json();
                alert(`Failed to delete vehicle: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert("Failed to delete vehicle. Please try again.");
        }
    };

    const editVehicle = (vehicle) => {
        setNewVehicle(vehicle);
    };

    const searchVehicles = () => {
        return vehicles.filter(vehicle => 
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
            vehicle.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="procurement-management">
            <h2>Procurement Management</h2>

            <div className="content-container">
                <div className="add-vehicle-section">
                    <h3>Add Vehicle</h3>
                    <input 
                        type="text" 
                        placeholder="VIN" 
                        value={newVehicle.vin} 
                        onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Model" 
                        value={newVehicle.model} 
                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Mileage" 
                        value={newVehicle.mileage} 
                        onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Driver" 
                        value={newVehicle.driver} 
                        onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })} 
                    />
                    <select 
                        value={newVehicle.status} 
                        onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}>
                        <option value="">Select Status</option>
                        <option value="available">Available</option>
                        <option value="in service">In Service</option>
                        <option value="sold">Sold</option>
                    </select>
                    <button onClick={addVehicle}>Add Vehicle</ button>
                </div>

                <div className="search-vehicles-section">
                    <h3>Search Vehicles</h3>
                    <input 
                        type="text" 
                        placeholder="Search by model or status" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <ul>
                        {searchVehicles().map((vehicle, index) => (
                            <li key={index}>
                                {vehicle.model} - {vehicle.status}
                                <button className="edit-button" onClick={() => editVehicle(vehicle)}>Edit</button>
                                <button className="delete-button" onClick={() => deleteVehicle(vehicle.vin)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProcurementManagement;