import mysql from 'mysql2'
import multer from 'multer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import dayjs from 'dayjs'

dotenv.config()

const database = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
})

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).fields([{ name: 'file' }, { name: 'image' }])

export function home(req, res) {
    const getToken = req.cookies.jswt
    if (!getToken) {
        return res.status(401).json({ status: 'Error', msg: 'Unauthorized' })
    }

    jwt.verify(getToken, process.env.SECRETKEY, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ status: 'Error', msg: 'Unauthorized' })
        } else {
            res.status(200).json({ status: 'Success', msg: 'hello admin', id: decoded.id })
        }
    })
}

export function countUser(req, res) {
    database.query(
        "SELECT COUNT(id) AS count FROM user",
        (err, result) => {
            if (err) {
                res.status(400).json({ status: "Error", msg: "Error count" })
            }
            res.status(200).json(result[0].count)
        }
    )
}

export function addadmin(req, res) {
    const { email, password } = req.body
    database.query(
        "SELECT * FROM admin WHERE email = ? ",
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).json({ status: "Error", msg: 'error check email' })
            }
            if (result.length !== 0) {
                return res.status(400).json({ status: "Error", msg: 'email already exist' })
            }
            const salt = bcrypt.genSaltSync(10)
            const hashPassword = bcrypt.hashSync(password, salt)
            database.query(
                "INSERT INTO admin (`email`,`password`) VALUES (?,?)",
                [email, hashPassword],
                (err, row) => {
                    if (err) {
                        return res.status(500).json({ status: "Error", msg: 'error get data' })
                    }
                    if (row.affectedRows !== 0) {
                        return res.status(200).json({ status: "Success", msg: 'Success add admin account' })
                    }
                    return res.status(400).json({ status: "Error", msg: "invalid login" })
                }
            )
        }
    )
}

export function loginAdmin(req, res) {
    const { email, password } = req.body
    database.query(
        "SELECT * FROM admin WHERE `email` = ?",
        [email],
        (err, row) => {
            if (err) {
                return res.status(500).json({ status: "Error", msg: "Database error" })
            }
            if (row.length === 0) {
                return res.status(400).json({ status: "Error", msg: "Invalid email or password" })
            }
            const user = row[0]
            const match = bcrypt.compareSync(password, user.password)
            if (match) {
                const secretKey = process.env.SECRETKEY
                const tokenId = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: 5 * 24 * 60 * 60 })
                res.cookie('jwt', tokenId, {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                })
                return res.status(200).cookie("jwt", tokenId).json({ status: "Success", msg: "login success" })
            } else {
                return res.status(400).json({ status: "Error", msg: "Invalid email or password" })
            }
        }
    )
}

export function logoutAdmin(req, res) {
    res.clearCookie('jwt')
    return res.status(200).json({ status: "Success", msg: 'oke logout' })
}

export function listAdmin(req, res) {
    database.query(
        "SELECT * FROM admin",
        (err, row) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error Get Admin List' })
            }
            res.status(200).json({ status: "Success", msg: "Success get list admin", row })
        }
    )
}

export function listUser(req, res) {
    database.query(
        "SELECT * FROM user",
        (err, row) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error Get User List' })
            }
            res.status(200).json({ status: "Success", msg: "Success get list user", row })
        }
    )
}

export function deleteUser(req, res) {
    const id = req.params.id
    database.query(
        "DELETE FROM user WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error delete data' })
            } else {
                res.status(200).json({ status: "Success", msg: 'Success Delete Data' })
            }
        }
    )
}

export function listSpelling(req, res) {
    database.query(
        "SELECT * FROM spelling",
        (err, row) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error get list teks audio' })
            } else {
                res.status(200).json({ status: "Success", msg: "get list teks audio", row })
            }
        }
    )
}

export function listPronunciation(req, res) {
    database.query(
        "SELECT * FROM pronunciation",
        (err, row) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error get list teks audio' })
            } else {
                res.status(200).json({ status: "Success", msg: "get list teks audio", row })
            }
        }
    )
}

export function addSpelling(req, res) {
    const { text, level } = req.body
    database.query(
        "SELECT * FROM spelling WHERE text = ? ",
        [text],
        (err, result) => {
            if (result.length !== 0) {
                return res.status(400).json({ status: "Error", msg: "Data Audio already in" })
            }
            database.query(
                "INSERT INTO spelling (`text`, `level`) VALUES (?,?)",
                [text, level],
                (err) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).json({ status: "Error", msg: "error" })
                    }
                    return res.status(200).json({ status: "Success", msg: "Success input teks audio" })
                }
            )
        }
    )
}

export function addPronunciation(req, res) {
    const { text, level } = req.body
    database.query(
        "SELECT * FROM pronunciation WHERE text = ? ",
        [text],
        (err, result) => {
            if (result.length !== 0) {
                return res.status(400).json({ status: "Error", msg: "Data Audio already in" })
            }
            database.query(
                "INSERT INTO pronunciation (`text`, `level`) VALUES (?,?)",
                [text, level],
                (err) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).json({ status: "Error", msg: "error" })
                    }
                    return res.status(200).json({ status: "Success", msg: "Success input teks audio" })
                }
            )
        }
    )
}

export function deleteSpelling(req, res) {
    const id = req.params.id
    database.query(
        "DELETE FROM spelling WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({ status: "error", msg: 'Error delete data audio' })
            } else {
                res.status(200).json({ status: "Success", msg: 'Success Delete Data' })
            }
        }
    )
}

export function deletePronunciation(req, res) {
    const id = req.params.id
    database.query(
        "DELETE FROM pronunciation WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({ status: "error", msg: 'Error delete data audio' })
            } else {
                res.status(200).json({ status: "Success", msg: 'Success Delete Data' })
            }
        }
    )
}

export function addArtikel(req, res) {
    upload(req, res, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ status: "Error", msg: 'Error upload article' })
        }
        if (!req.files || !req.files.file || !req.files.image) {
            return res.status(404).json({ status: "Error", msg: 'No file uploaded' })
        }
        const { title, writerBy } = req.body
        const date = dayjs().format('YYYY-MM-DD');

        // Logic for saving articles now needs to save files locally or using another method
        return res.status(200).json({ status: "Success", msg: "Article processing logic goes here..." });
    });
}

export function listartikel(req, res) {
    database.query(
        "SELECT * FROM article",
        (err, row) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error get list article' })
            } else {
                res.status(200).json({ status: "Success", msg: "get list article", row })
            }
        }
    )
}

export function deleteArticle(req, res) {
    const id = req.params.id
    database.query(
        "DELETE FROM article WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error delete article' })
            } else {
                res.status(200).json({ status: "Success", msg: 'Success Delete Data' })
            }
        }
    )
}

export function addUser(req, res) {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: "Error", msg: "Error add user" })
        }
        if (!req.file) {
            return res.status(404).json({ status: "Error", msg: "No file uploaded" })
        }

        const { name, email, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        database.query(
            "SELECT * FROM user WHERE email = ?",
            [email],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ status: "Error", msg: "Error checking email existence" })
                }
                if (result.length !== 0) {
                    return res.status(400).json({ status: "Error", msg: "Email already exists" })
                }

                database.query(
                    "INSERT INTO user (`name`, `email`, `password`, `imageUrl`) VALUES (?,?,?,?)",
                    [name, email, hashPassword, null], // No image URL since we're not using cloud storage now
                    (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ status: "Error", msg: "Error saving user" })
                        }
                        return res.status(200).json({ status: "Success", msg: "User added successfully" })
                    }
                );
            }
        );
    });
}

export function deleteAdmin(req, res) {
    const id = req.params.id
    database.query(
        "DELETE FROM admin WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({ status: "Error", msg: 'Error delete admin' })
            } else {
                res.status(200).json({ status: "Success", msg: 'Success Delete Data' })
            }
        }
    )
}