import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import mysql from 'mysql2'
import multer from 'multer'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs' // Make sure to import fs
import path from 'path' // Make sure to import path
import { spawn } from 'child_process' // Import spawn for executing Python scripts

dotenv.config()

const database = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './temp'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Define the file naming convention
  }
});
const upload = multer({ storage: storage }).single('file');

export function register(req, res) {
  const { name, email, password } = req.body;
  database.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      (err, result) => {
          if (err) {
              return res.status(500).json({ status: "Error", msg: "Error" });
          }
          if (result.length !== 0) {
              return res.status(400).json({ status: "Error", msg: "Email already exists" });
          }
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          database.query(
              "INSERT INTO user (`name`, `email`, `password`) VALUES (?, ?, ?)",
              [name, email, hashPassword],
              (err, row) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ status: "Error", msg: "Error" });
                  }
                  return res.status(200).json({ status: "Success", msg: "Registration successful" });
              }
          );
      }
  );
}

export function login(req, res) {
  const { email, password } = req.body;
  database.query(
      "SELECT * FROM user WHERE `email` = ? ",
      [email],
      (err, rows) => {
          if (err) {
              return res.status(500).json({ status: "Error", msg: "Database error" });
          }
          if (rows.length === 0) {
              return res.status(400).json({ status: "Error", msg: "Invalid email or password" });
          }
          const user = rows[0];
          const match = bcrypt.compareSync(password, user.password);
          if (match) {
              return res.status(200).json({ status: "Success", msg: "Login Success", name: user.name, email: user.email, image: user.imageUrl });
          } else {
              return res.status(400).json({ status: "Error", msg: "Invalid email or password" });
          }
      }
  );
}

export function insertName(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    database.query(
        "UPDATE user SET name = ? WHERE id = ?",
        [name, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ status: "Error", msg: 'Error save data' });
            }
            return res.status(200).json({ status: "Success", msg: 'success input name' });
        }
    );
}

export function uploadimage(req, res) {
    const id = req.params.id;
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ status: "Error", msg: 'Error upload image' });
        }
        if (!req.file) {
            return res.status(404).json({ status: "Error", msg: 'No file uploaded' });
        }

        // Logic for saving the uploaded image needs to be defined here...

        return res.status(200).json({ status: "Success", msg: "Image upload logic goes here..." });
    });
}

export function user(req, res) {
    const id = req.params.id;
    database.query(
        "SELECT * FROM user WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ status: "Error", msg: "Failed get data user" });
            }
            return res.status(200).json({ status: "Success", msg: "Success get list user", row });
        }
    );
}

// Additional functions like articleview, articleviewsearch, etc., remain unchanged
export function articleview(req,res) {
  const id = req.params.id;
  database.query(
      "SELECT * FROM article WHERE id = ?",
      [id],
      (err,row) => {
          if(err) {
            return res.status(500).json({status:"Error", msg: "Failed get data user"});
          }
          if(row.length === 0) {
            return res.status(400).json({status:"Error", msg: "Article not found"});
          }
          return res.status(200).json({status:"Success", msg:"Success get article", row});
      }
  );
}

export function articleviewsearch(req,res) {
  const title = req.params.title;
  database.query(
      "SELECT * FROM article WHERE title = ?",
      [title],
      (err,row) => {
          if(err) {
              return res.status(500).json({status:"Error", msg: "Failed get data article"});
          }
          if(row.length === 0) {
            return res.status(400).json({status:"Error", msg: "Article not found"});
          }
          return res.status(200).json({status:"Success", msg:"Success get article", row});
      }
  );
}

export function spellingListBylevel(req,res) {
  const level = req.params.level;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM spelling q LEFT JOIN historyUserSpelling h ON h.id_quiz = q.id WHERE q.level = ?",
    [level],
    (err,row) => {
        if(err) {
          return res.status(500).json({status:"Error", msg: "Failed get data quiz"});
        }
        if(row.length === 0) {
          return res.status(400).json({status:"Error", msg: "Quiz not found"});
        }
        return res.status(200).json({status:"Success", msg:"Success get Quiz List", row});
    }
  );
}

export function PronunciationListBylevel(req,res) {
  const level = req.params.level;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM pronunciation q LEFT JOIN historyUserPnonunciation h ON h.id_quiz = q.id WHERE q.level = ?",
    [level],
    (err,row) => {
        if(err) {
          return res.status(500).json({status:"Error", msg: "Failed get data quiz"});
        }
        if(row.length === 0) {
          return res.status(400).json({status:"Error", msg: "Quiz not found"});
        }
        return res.status(200).json({status:"Success", msg:"Success get Quiz List", row});
    }
  );
}

export function SpellingListById(req,res) {
  const id = req.params.id;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM spelling q LEFT JOIN historyUserSpelling h ON h.id_quiz = q.id WHERE q.id = ?",
    [id],
    (err,row) => {
        if(err) {
          return res.status(500).json({status:"Error", msg: "Failed get data quiz"});
        }
        if(row.length === 0) {
          return res.status(400).json({status:"Error", msg: "Quiz not found"});
        }
        return res.status(200).json({status:"Success", msg:"Success get Quiz Spelling List", row});
    }
  );
}

export function PronunciationListById(req,res) {
  const id = req.params.id;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM pronunciation q LEFT JOIN historyUserPnonunciation h ON h.id_quiz = q.id WHERE q.id = ?",
    [id],
    (err,row) => {
        if(err) {
          return res.status(500).json({status:"Error", msg: "Failed get data quiz"});
        }
        if(row.length === 0) {
          return res.status(400).json({status:"Error", msg: "Quiz not found"});
        }
        return res.status(200).json({status:"Success", msg:"Success get Quiz Pronunciation List", row});
    }
  );
}

export function postSpellingById(req, res) {
  const id_quiz = req.params.id;

  // First get the quiz text
  database.query(
      `SELECT text FROM spelling WHERE id = ?`,
      [id_quiz],
      (err, result) => {
          if (err) {
              return res.status(500).json({ status: "Error", msg: 'Failed get text quiz' });
          }
          if (result.length === 0) {
              return res.status(404).json({ status: "Error", msg: 'Quiz not found' });
          }

          const teks_quiz = result[0].text;

          // Handle file upload
          upload(req, res, (err) => {
              if (err) {
                  return res.status(500).json({ status:'Error', msg: 'File upload error' });
                  console.log('Uploaded file info:', req.file);

              }

              const filename = Date.now() + '-' + req.file.originalname;
              const inputData = {
                  file: `temp/${filename}`,
                  label: teks_quiz // Replace with actual file path if you save it
              };

              sendToML(inputData) // Assuming you have a separate function to handle ML requests.
                  .then((checkResult) => {
                      let resultMessage = '';
                      if (checkResult) {
                          resultMessage = 'Perfect';
                      } else {
                          resultMessage = 'Not Bad';
                      }

                      database.query(
                          "INSERT INTO historyUserSpelling (id_user, id_quiz, is_answered, checker) VALUES (?,?,true,?)",
                          [1, id_quiz, resultMessage], // Replace with actual user ID
                          (err, rows) => {
                              if (err) {
                                  return res.status(500).json({ status: 'Error', msg: 'Failed insert history' });
                              }
                              return res.status(200).json({
                                  status: 'Success',
                                  msg: 'Success get result',
                                  text: teks_quiz,
                                  is_answered: true,
                                  check: resultMessage,
                                  is_open: true
                              });
                          }
                      )
                  })
                  .catch((error) => {
                      return res.status(500).json({ status: 'Error', msg: 'Internal Server Error' });
                  });
          });
      }
  );
}


// Helper function to convert audio using FFmpeg
function convertAudio(inputPath) {
    return new Promise((resolve, reject) => {
        // Ensure input file exists
        if (!fs.existsSync(inputPath)) {
            reject(new Error(`Input file not found: ${inputPath}`));
            return;
        }

        const outputPath = inputPath.replace('.wav', '_converted.wav');
        console.log('Converting audio:', inputPath);
        console.log('FFmpeg path:', "C:\\ffmpeg\\bin\\ffmpeg.exe");
        
        const ffmpeg = spawn("C:\\ffmpeg\\bin\\ffmpeg.exe", [
            '-i', inputPath,
            '-acodec', 'pcm_s16le',
            '-ar', '44100',
            outputPath
        ]);

        let ffmpegLogs = '';

        ffmpeg.stderr.on('data', (data) => {
            ffmpegLogs += data.toString();
            console.log(`FFmpeg Log: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0 && fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new Error(`FFmpeg process failed with code ${code}. Logs: ${ffmpegLogs}`));
            }
        });

        ffmpeg.on('error', (err) => {
            reject(new Error(`FFmpeg spawn failed: ${err.message}`));
        });
    });
}

// Helper function to cleanup temporary files
function cleanupFiles(...filePaths) {
    filePaths.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting file ${filePath}:`, err);
            });
        }
    });
}

export function postPronunciationById(req, res) {
    const id_quiz = req.params.id;

    database.query(
        `SELECT text FROM pronunciation WHERE id = ?`,
        [id_quiz],
        (err, result) => {
            if (err) {
                return res.status(500).json({ status: 'Error', msg: 'Failed to get quiz text' });
            }
            if (result.length === 0) {
                return res.status(404).json({ status: 'Error', msg: 'Quiz not found' });
            }

            const teks_quiz = result[0].text;

            upload(req, res, async (err) => {
                if (err) {
                    console.error("Multer error:", err);
                    return res.status(500).json({ status: 'Error', msg: 'File upload error' });
                }

                if (!req.file) {
                    return res.status(400).json({ status: 'Error', msg: 'No audio file provided' });
                }

                const originalAudioPath = req.file.path;
                let convertedAudioPath = null;

                try {
                    console.log('Original audio path:', originalAudioPath);
                    convertedAudioPath = await convertAudio(originalAudioPath);
                    console.log('Converted audio path:', convertedAudioPath);

                    const pythonProcess = spawn('python', [
                        path.join(__dirname, 'speech_recognition_script.py'),
                        convertedAudioPath,
                        teks_quiz
                    ]);

                    let pythonOutput = '';
                    let pythonError = '';

                    pythonProcess.stdout.on('data', (data) => {
                        pythonOutput += data.toString();
                    });

                    pythonProcess.stderr.on('data', (data) => {
                        pythonError += data.toString();
                        console.error(`Python Error: ${data.toString()}`);
                    });

                    pythonProcess.on('close', (code) => {
                        console.log('Python process finished with code:', code);
                        console.log('Python output:', pythonOutput);
                        
                        try {
                            const result = JSON.parse(pythonOutput);
                            const resultMessage = result.status === "Perfect" ? result.status : "Not Bad";

                            // Insert or update other results if needed
                            database.query(
                                "INSERT INTO historyUserPnonunciation (id_user, id_quiz, is_answered, checker) VALUES (?,?,true,?)",
                                [1, id_quiz, resultMessage],
                                (insertErr) => {
                                    cleanupFiles(originalAudioPath, convertedAudioPath);

                                    if (insertErr) {
                                        return res.status(500).json({ status: 'Error', msg: 'Failed to save result' });
                                    }
                                    
                                    // Send back the recognized text in the response
                                    return res.status(200).json({
                                        status: resultMessage,
                                        msg: 'Successful pronunciation check',
                                        text: teks_quiz,  // This is the expected text
                                        recognized_text: result.recognized_text, // Add recognized_text here
                                        is_answered: true,
                                        check: resultMessage,
                                        is_open: true
                                    });
                                }
                            );
                        } catch (error) {
                            cleanupFiles(originalAudioPath, convertedAudioPath);
                            console.error('Error processing Python output:', error);
                            return res.status(500).json({ status: 'Error', msg: 'Failed to process speech recognition result' });
                        }
                    });

                } catch (error) {
                    cleanupFiles(originalAudioPath, convertedAudioPath);
                    console.error("Processing error:", error);
                    return res.status(500).json({ status: 'Error', msg: 'Audio conversion failed' });
                }
            });
        }
    );
}