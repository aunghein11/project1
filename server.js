const fs = require('fs');
const http = require('http');
//const users = [];
let count = 0;
const date = new Date();
const users = [
    {
        name: "Aung Aung",
        email: "aungaung@gmail.com",
        password: "123aung4",
        createdAt: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
        updatedAt: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    },
    {
        name: "Kyaw Kyaw",
        email: "kyawkyaw@gmail.com",
        password: "34kyaw12",
        createdAt: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
        updatedAt: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,

    }
];

const server = http.createServer((req, res) => {
    const isRootUrl = req.url === '/';
    if (isRootUrl) {
        fs.readFile('index.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url === '/script.js') {
        fs.readFile('script.js', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
        });
    } else if (req.url === '/style.css') {
        fs.readFile('style.css', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    } else if (req.url === '/users') {
        const method = req.method;
        if (method === "GET") {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(users));
            res.end();
        } else if (method === "POST") {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            })
            req.on("end", () => {
                console.log(data);
                const newUser = JSON.parse(data);
                users.push(newUser);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(users));
                res.end();
            })

        } else if (method === "PUT") {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                const newPutData = JSON.parse(data);
                const foundUser = users.find((user) => user.email === newPutData.email);
                const newName = newPutData.name;
                if (foundUser) {
                    foundUser.name = newName;
                    foundUser.updatedAt = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(users));
                    res.end();
                } else {
                    res.end();
                }
            })
        } else if (method === "DELETE") {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                const deleteData = JSON.parse(data);
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === deleteData.email) {
                        users.splice(users.findIndex(user => user.email === deleteData.email), 1);
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.write(JSON.stringify(users));
                        res.end();
                    } else {
                        console.log("Problem")
                        console.log(i)
                        res.end();

                    }

                }
            })

        } else {
            res.end();
        }

    } else if (req.url === '/fileUpload') {
        const fileName = `file${count += 1}`;
        const fileType = req.headers["content-type"].split("/")[1];
        const writeStream = fs.createWriteStream(fileName + `.${fileType}`);
        req.pipe(writeStream);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify("Uploade Success: " + fileName + `.${fileType}`));
        res.end();

        /*
        const fileType = req.headers["content-type"].split("/")[1];
        const writeStream = fs.createWriteStream(`file${count += 1}.${fileType}`);
        req.pipe(writeStream);
        res.write(JSON.stringify("Upload Success"))
        res.end()
        const writestream = fs.createWriteStream("test.txt");
        req.pipe(writestream);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Upload Success" }));
        res.end();
        */
    } else {
        res.writeHead(500);
        res.write(`<h1>Unknown Route</h1>`)
        res.end();
    }
});

server.listen(3000, () => {
    console.log("Server Started: Listening on port 3000");
});