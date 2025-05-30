import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import mysql from 'mysql2';
import multer from 'multer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

dotenv.config();

const database = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
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
      console.log('Received password:', password);

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

export function articleview(req, res) {
  const id = req.params.id;
  database.query(
    "SELECT * FROM article WHERE id = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed get data user" });
      }
      if (row.length === 0) {
        return res.status(400).json({ status: "Error", msg: "Article not found" });
      }
      return res.status(200).json({ status: "Success", msg: "Success get article", row });
    }
  );
}

export function articleviewsearch(req, res) {
  const title = req.params.title;
  database.query(
    "SELECT * FROM article WHERE title = ?",
    [title],
    (err, row) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed get data article" });
      }
      if (row.length === 0) {
        return res.status(400).json({ status: "Error", msg: "Article not found" });
      }
      return res.status(200).json({ status: "Success", msg: "Success get article", row });
    }
  );
}

export function getRandomSpellingPhrases(req, res) {
  const level = req.params.level;
  database.query(
    `SELECT id, text, level FROM spelling WHERE level = ? AND is_open = 1 ORDER BY RAND() LIMIT 5`,
    [level],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed to fetch phrases" });
      }
      if (rows.length === 0) {
        return res.status(400).json({ status: "Error", msg: "No phrases found for this level" });
      }
      return res.status(200).json({ status: "Success", msg: "Success fetching phrases", rows });
    }
  );
}

export function spellingListBylevel(req, res) {
  const level = req.params.level;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM spelling q LEFT JOIN historyUserSpelling h ON h.id_quiz = q.id WHERE q.level = ?",
    [level],
    (err, row) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed get data quiz" });
      }
      if (row.length === 0) {
        return res.status(400).json({ status: "Error", msg: "Quiz not found" });
      }
      return res.status(200).json({ status: "Success", msg: "Success get Quiz List", row });
    }
  );
}

export function PronunciationListBylevel(req, res) {
  const level = req.params.level;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM pronunciation q LEFT JOIN historyUserPnonunciation h ON h.id_quiz = q.id WHERE q.level = ?",
    [level],
    (err, row) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed get data quiz" });
      }
      if (row.length === 0) {
        return res.status(400).json({ status: "Error", msg: "Quiz not found" });
      }
      return res.status(200).json({ status: "Success", msg: "Success get Quiz List", row });
    }
  );
}

export function SpellingListById(req, res) {
  const id = req.params.id;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM spelling q LEFT JOIN historyUserSpelling h ON h.id_quiz = q.id WHERE q.id = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed get data quiz" });
      }
      if (row.length === 0) {
        return res.status(400).json({ status: "Error", msg: "Quiz not found" });
      }
      return res.status(200).json({ status: "Success", msg: "Success get Quiz Spelling List", row });
    }
  );
}

export function PronunciationListById(req, res) {
  const id = req.params.id;
  database.query(
    "SELECT q.id, q.text, q.is_open, IFNULL(h.is_answered, false) AS is_answered FROM pronunciation q LEFT JOIN historyUserPnonunciation h ON h.id_quiz = q.id WHERE q.id = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ status: "Error", msg: "Failed get data quiz" });
      }
      if (row.length === 0) {
        return res.status(400).json({ status: "Error", msg: "Quiz not found" });
      }
      return res.status(200).json({ status: "Success", msg: "Success get Quiz Pronunciation List", row });
    }
  );
}

export function postSpellingById(req, res) {
  const id_quiz = req.params.id;

  database.query(
    `SELECT text, level FROM spelling WHERE id = ?`,
    [id_quiz],
    (err, result) => {
      if (err) {
        return res.status(500).json({ status: 'Error', msg: 'Failed to get quiz text' });
      }
      if (result.length === 0) {
        return res.status(404).json({ status: 'Error', msg: 'Quiz not found' });
      }

      const teks_quiz = result[0].text;
      const language = req.body.language || result[0].level;

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
            teks_quiz,
            language,
            '--spelling-check' // Flag to indicate spelling-specific check
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

              database.query(
                "INSERT INTO historyuserspelling (id_user, id_quiz, is_answered, checker) VALUES (?,?,true,?)",
                [1, id_quiz, resultMessage],
                (insertErr) => {
                  cleanupFiles(originalAudioPath, convertedAudioPath);

                  if (insertErr) {
                    return res.status(500).json({ status: 'Error', msg: 'Failed to save result' });
                  }

                  return res.status(200).json({
                    status: resultMessage,
                    msg: 'Successful spelling check',
                    text: teks_quiz,
                    recognized_text: result.recognized_text,
                    is_answered: true,
                    check: resultMessage,
                    is_open: true,
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
    });
}

function convertAudio(inputPath) {
  return new Promise((resolve, reject) => {
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
      outputPath,
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

function cleanupFiles(...filePaths) {
  filePaths.forEach((filePath) => {
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
    `SELECT text, level FROM pronunciation WHERE id = ?`,
    [id_quiz],
    (err, result) => {
      if (err) {
        return res.status(500).json({ status: 'Error', msg: 'Failed to get quiz text' });
      }
      if (result.length === 0) {
        return res.status(404).json({ status: 'Error', msg: 'Quiz not found' });
      }

      const teks_quiz = result[0].text;
      const language = req.body.language || result[0].level;

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
            teks_quiz,
            language,
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

              database.query(
                "INSERT INTO historyUserPnonunciation (id_user, id_quiz, is_answered, checker) VALUES (?,?,true,?)",
                [1, id_quiz, resultMessage],
                (insertErr) => {
                  cleanupFiles(originalAudioPath, convertedAudioPath);

                  if (insertErr) {
                    return res.status(500).json({ status: 'Error', msg: 'Failed to save result' });
                  }

                  return res.status(200).json({
                    status: resultMessage,
                    msg: 'Successful pronunciation check',
                    text: teks_quiz,
                    recognized_text: result.recognized_text,
                    is_answered: true,
                    check: resultMessage,
                    is_open: true,
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

export function getPronunciationHistory(req, res) {
  const userId = req.params.userId;
  database.query(
    `SELECT h.id, h.id_quiz, h.checker, h.created_at, p.text, p.level
     FROM historyuserpnonunciation h
     JOIN pronunciation p ON h.id_quiz = p.id
     WHERE h.id_user = ?
     ORDER BY h.created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching pronunciation history:', err);
        return res.status(500).json({ status: 'Error', msg: 'Failed to fetch pronunciation history' });
      }
      return res.status(200).json({ status: 'Success', msg: 'Success fetching pronunciation history', rows });
    }
  );
}

export function getPronunciationStats(req, res) {
  const userId = req.params.userId;
  
  const resultQuery = `
    SELECT 
      COUNT(*) AS total_attempts,
      SUM(CASE WHEN checker = 'Perfect' THEN 1 ELSE 0 END) AS perfect_count,
      SUM(CASE WHEN checker = 'Not Bad' THEN 1 ELSE 0 END) AS not_bad_count
    FROM historyuserpnonunciation
    WHERE id_user = ?
  `;
  
  const languageQuery = `
    SELECT p.level AS language, COUNT(*) AS attempt_count
    FROM historyuserpnonunciation h
    JOIN pronunciation p ON h.id_quiz = p.id
    WHERE h.id_user = ?
    GROUP BY p.level
    ORDER BY attempt_count DESC
  `;
  
  database.query(resultQuery, [userId], (err, resultRows) => {
    if (err) {
      console.error('Error fetching result stats:', err);
      return res.status(500).json({ status: 'Error', msg: 'Failed to fetch result stats' });
    }
    
    const results = resultRows[0];
    const total = results.total_attempts || 0;
    const stats = {
      total_attempts: total,
      perfect_count: results.perfect_count || 0,
      perfect_percentage: total > 0 ? ((results.perfect_count || 0) / total * 100).toFixed(1) : 0,
      not_bad_count: results.not_bad_count || 0,
      not_bad_percentage: total > 0 ? ((results.not_bad_count || 0) / total * 100).toFixed(1) : 0,
    };
    
    database.query(languageQuery, [userId], (err, languageRows) => {
      if (err) {
        console.error('Error fetching language stats:', err);
        return res.status(500).json({ status: 'Error', msg: 'Failed to fetch language stats' });
      }
      
      return res.status(200).json({
        status: 'Success',
        msg: 'Success fetching pronunciation stats',
        stats: {
          results: stats,
          languages: languageRows,
        },
      });
    });
  });
}