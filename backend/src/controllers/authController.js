import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ message: "Successfully logged in", token});
        } else {
            return res.status(401).json({ message: "Incorrect password, try again"});
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error encountered" });
    }
}

export async function register (req, res) {
    try{  
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (user){
            return res.status(300).json({ message: "User already exists" });
        }
        const newUser = new User({username, password});
        const save = await newUser.save();
        res.status(200).json({message: "User successfully registered"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error encountered"});

    }
}

export async function verifyToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Token is valid" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export async function logout(req, res){
    try{
        const token = localStorage.getItem("token");
        if (token){
            localStorage.removeItem("token");
            res.status(200).json({message: "Successfully logged out"});
        }
        return;
    } catch (error){
        res.status(500).json({message: "Error encountered"});
        console.log("Unable to log out: ", error);
    }
}