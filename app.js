import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

const users = [];

app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const findUser = users.find((user) => user.email === email);
        if (findUser) {
            return res.status(400).send("Email is already registered!");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email, password: hashedPassword });

        console.log(users);
        res.status(201).send("Registered successfully");

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const findUser = users.find((user) => user.email === email);
        if (!findUser) {
            return res.status(400).send("User not found!");
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (passwordMatch) {
            res.status(200).send("Logged in successfully!");
        } else {
            res.status(400).send("Wrong email or password!");
        }

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);
