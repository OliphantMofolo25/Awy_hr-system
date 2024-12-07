const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/AWY_MANAGEMENT', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Serve .jsx files with the correct MIME type
app.get('*.jsx', (req, res) => {
    res.type('application/javascript'); // Set the MIME type
    res.sendFile(path.join(__dirname, req.path)); // Send the file
});
// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});

const User = mongoose.model('User ', UserSchema);

// Staff Schema
const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    qualifications: { type: String, required: true },
    points: { type: Number, required: true },
    staffNumber: { type: String, required: true }, // New field
    identityNumber: { type: String, required: true }, // New field
    salary: { type: Number, required: true } // New field
});

const Staff = mongoose.model('Staff', StaffSchema);

// Vehicle Schema
const VehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    mileage: { type: String, required: true },
    driver: { type: String, required: true },
    status: { type: String, required: true }
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

// User Registration Route
app.post('/api/users/register', async (req, res) => {
    const { username, password, email } = req.body;
    const newUser  = new User({ username, password, email });
    try {
        const savedUser  = await newUser .save();
        res.status(201).json(savedUser );
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// User Login Route
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Logged in successfully', user });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Staff Routes
app.post('/api/staff', async (req, res) => {
    const { name, position, qualifications, points, staffNumber, identityNumber, salary } = req.body;
    const newStaff = new Staff({ name, position, qualifications, points, staffNumber, identityNumber, salary });
    try {
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// New GET route to fetch all staff members
app.get('/api/staff', async (req, res) => {
    try {
        const staffMembers = await Staff.find(); // Fetch all staff members from the database
        res.status(200).json(staffMembers); // Return the staff members as JSON
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Vehicle Routes
app.post('/api/vehicles', async (req, res) => {
    const { vin, model, mileage, driver, status } = req.body;
    const newVehicle = new Vehicle({ vin, model, mileage, driver, status });
    try {
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// New GET route to fetch all vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find(); // Fetch all vehicles from the database
        res.status(200).json(vehicles);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// New DELETE route to delete a vehicle by VIN
app.delete('/api/vehicles/:vin', async (req, res) => {
    const { vin } = req.params;
    try {
        const deletedVehicle = await Vehicle.findOneAndDelete({ vin });
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});