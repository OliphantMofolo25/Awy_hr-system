import React, { useState, useEffect } from 'react';
import './StaffManagement.css'; // Import the CSS file

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [trainingType, setTrainingType] = useState('');
    const [staffNumber, setStaffNumber] = useState('');
    const [identityNumber, setIdentityNumber] = useState('');
    const [salary, setSalary] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

  
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/staff');
                if (response.ok) {
                    const data = await response.json();
                    setStaff(data);
                } else {
                    const error = await response.json();
                    alert(`Failed to load staff: ${error.message}`);
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
                alert("Failed to load staff. Please try again.");
            }
        };

        fetchStaff();
    }, []);

    const handleAddOrUpdate = async () => {
        const points = trainingType === 'academic' ? 5 : trainingType === 'professional' ? 7 : 0;

        if (!name || !position || !qualifications || !trainingType || !staffNumber || !identityNumber || !salary) {
            alert("Please fill in all fields.");
            return;
        }

        const newStaffMember = { name, position, qualifications, points, staffNumber, identityNumber, salary };

        if (editIndex !== null) {
            const updatedStaff = staff.map((s, index) => 
                index === editIndex ? { ...s, ...newStaffMember } : s
            );
            setStaff(updatedStaff);
            setEditIndex(null);
        } else {
            if (staff.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                alert("Staff member with this name already exists.");
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/staff', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newStaffMember),
                });
                
                if (response.ok) {
                    const savedStaff = await response.json();
                    setStaff([...staff, savedStaff]);
                } else {
                    const error = await response.json();
                    alert(`Failed to add staff: ${error.message}`);
                }
            } catch (error) {
                console.error('Error adding staff:', error);
                alert("Failed to add staff. Please try again.");
            }
        }

    
        setName('');
        setPosition('');
        setQualifications('');
        setTrainingType('');
        setStaffNumber('');
        setIdentityNumber('');
        setSalary('');
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setName(staff[index].name);
        setPosition(staff[index].position);
        setQualifications(staff[index].qualifications);
        setTrainingType(staff[index].points === 5 ? 'academic' : staff[index].points === 7 ? 'professional' : '');
        setStaffNumber(staff[index].staffNumber);
        setIdentityNumber(staff[index].identityNumber);
        setSalary(staff[index].salary);
    };

    const handleDelete = async (index) => {
        const staffMemberToDelete = staff[index];
        const updatedStaff = staff.filter((_, i) => i !== index);
        setStaff(updatedStaff);

        try {
            const response = await fetch(`http://localhost:5000/api/staff/${staffMemberToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Failed to delete staff : ${error.message}`);
                setStaff(staff);
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert("Failed to delete staff. Please try again.");
            setStaff(staff);
        }
    };

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h1>Staff Information Management</h1>
            <div className="management-layout">
                <div className="staff-info">
                    <input
                        type="text"
                        placeholder="Search Staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Qualifications"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Staff Number"
                        value={staffNumber}
                        onChange={(e) => setStaffNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Identity Number"
                        value={identityNumber}
                        onChange={(e) => setIdentityNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    <select value={trainingType} onChange={(e) => setTrainingType(e.target.value)}>
                        <option value="">Select Training Type</option>
                        <option value="academic">Academic Training</option>
                        <option value="professional">Professional Training</option>
                    </select>
                    <button onClick={handleAddOrUpdate}>
                        {editIndex !== null ? 'Update Staff' : 'Add Staff'}
                    </button>
                </div>
                <div className="staff-list">
                    <h2>Staff List</h2>
                    <ul>
                        {filteredStaff.map((s, index) => (
                            <li key={index}>
                                {s.name} - {s.position} - {s.qualifications} - Staff Number: {s.staffNumber} - Identity Number: {s.identityNumber} - Salary: {s.salary} - Points: {s.points}
                                <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;