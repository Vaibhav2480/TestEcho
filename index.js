const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongodb"); // MongoDB model
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (like login.html, signup.html, and index.html)
app.use(express.static(path.join(__dirname)));

// Routes

// Serve signup page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user or email already exists (case-insensitive match for name and exact match for email)
        const existingUser = await LogInCollection.findOne({
            $or: [
                { name: { $regex: new RegExp(`^${name}$`, 'i') } },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(400).send("User or email already exists.");
        }

        // Save the new user
        const newUser = new LogInCollection({ name, email, password });
        await newUser.save();
        console.log("New user registered:", newUser);

        res.status(201).send("Signup successful!");
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).send("An error occurred during signup.");
    }
});

// Handle login form submission
app.post("/login", async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check for admin credentials first
        if (name === "admin" && password === "admin123") {
            console.log("Admin login successful.");
            res.cookie("userType", "admin"); // Use cookies to maintain user type
            return res.redirect("/admin.html");
        }

        // Check if user exists in the database
        const user = await LogInCollection.findOne({ name });
        console.log("User found in DB:", user);  // Debugging user found in DB

        if (!user) {
            return res.status(401).send("Invalid user.");  // Inform the user if the user is not found
        }

        // Validate password
        if (user.password === password) {
            console.log("Login successful for user:", user.name);
            return res.redirect("/index.html"); // Redirect to index.html
        } else {
            return res.status(401).send("Incorrect password.");  // Password mismatch
        }
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).send("An error occurred during login.");
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
