import speech_recognition as sr
import sys
import json
import difflib
import os

def map_language_to_code(language):
    """Map language name to Google Speech Recognition language code."""
    language_map = {
        'English': 'en-US',
        'Arabic': 'ar-SA',
        'French': 'fr-FR'
    }
    return language_map.get(language, 'en-US')  # Default to en-US if unknown

def check_pronunciation(audio_path, expected_text, language):
    """
    Check pronunciation accuracy from a WAV audio file.
    
    Args:
        audio_path (str): Path to the WAV audio file
        expected_text (str): Expected pronunciation text
        language (str): Language of the quiz (English, Arabic, French)
    """
    try:
        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Configure recognition parameters
        recognizer.energy_threshold = 300
        recognizer.dynamic_energy_threshold = True
        recognizer.pause_threshold = 0.8
        
        # Map language to recognition code
        language_code = map_language_to_code(language)
        
        # Process the WAV audio file
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
            
            try:
                # Attempt recognition with the specified language
                recognized_text = recognizer.recognize_google(audio, language=language_code)
                
                # Normalize texts for comparison
                recognized_text = recognized_text.lower().strip()
                expected_text = expected_text.lower().strip()
                
                # Calculate similarity
                similarity = difflib.SequenceMatcher(None, recognized_text, expected_text).ratio() * 100
                
                # Determine status
                status = "Perfect" if similarity >= 75 else "Not Bad"
                
                result = {
                    "status": status,
                    "score": round(similarity, 2),
                    "recognized_text": recognized_text,
                    "expected_text": expected_text,
                    "error": None
                }
                
                print(json.dumps(result))
                
            except sr.UnknownValueError:
                print(json.dumps({
                    "error": "Speech could not be understood",
                    "status": "Not Bad",
                    "score": 0,
                    "recognized_text": "",
                    "expected_text": expected_text
                }))
                
            except sr.RequestError as e:
                print(json.dumps({
                    "error": f"Recognition service error: {str(e)}",
                    "status": "Not Bad",
                    "score": 0,
                    "recognized_text": "",
                    "expected_text": expected_text
                }))
                
    except Exception as e:
        print(json.dumps({
            "error": f"Processing error: {str(e)}",
            "status": "Not Bad",
            "score": 0,
            "recognized_text": "",
            "expected_text": expected_text
        }))

def check_spelling(audio_path, expected_text, language):
    """
    Check spelling accuracy from a WAV audio file by comparing word-by-word.
    
    Args:
        audio_path (str): Path to the WAV audio file
        expected_text (str): Expected text to spell
        language (str): Language of the quiz (English, Arabic, French)
    """
    try:
        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Configure recognition parameters
        recognizer.energy_threshold = 300
        recognizer.dynamic_energy_threshold = True
        recognizer.pause_threshold = 0.8
        
        # Map language to recognition code
        language_code = map_language_to_code(language)
        
        # Process the WAV audio file
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
            
            try:
                # Attempt recognition with the specified language
                recognized_text = recognizer.recognize_google(audio, language=language_code)
                
                # Normalize texts for comparison
                recognized_text = recognized_text.lower().strip()
                expected_text = expected_text.lower().strip()
                
                # Split into words for spelling comparison
                expected_words = expected_text.split()
                recognized_words = recognized_text.split()
                
                # Compare word-by-word for spelling accuracy
                score = 0
                max_score = len(expected_words)
                for i in range(min(len(expected_words), len(recognized_words))):
                    if expected_words[i] == recognized_words[i]:
                        score += 1
                
                # Calculate accuracy
                accuracy = (score / max_score) * 100 if max_score > 0 else 0
                
                # Determine status
                status = "Perfect" if accuracy >= 90 else "Not Bad"
                
                result = {
                    "status": status,
                    "score": round(accuracy, 2),
                    "recognized_text": recognized_text,
                    "expected_text": expected_text,
                    "error": None
                }
                
                print(json.dumps(result))
                
            except sr.UnknownValueError:
                print(json.dumps({
                    "error": "Speech could not be understood",
                    "status": "Not Bad",
                    "score": 0,
                    "recognized_text": "",
                    "expected_text": expected_text
                }))
                
            except sr.RequestError as e:
                print(json.dumps({
                    "error": f"Recognition service error: {str(e)}",
                    "status": "Not Bad",
                    "score": 0,
                    "recognized_text": "",
                    "expected_text": expected_text
                }))
                
    except Exception as e:
        print(json.dumps({
            "error": f"Processing error: {str(e)}",
            "status": "Not Bad",
            "score": 0,
            "recognized_text": "",
            "expected_text": expected_text
        }))

if __name__ == "__main__":
    if len(sys.argv) < 4:  # Expect at least 3 arguments: script, audio_path, expected_text, language
        print(json.dumps({
            "error": "Usage: python speech_recognition_script.py <audio_path> <expected_text> <language> [--spelling-check]",
            "status": "Not Bad",
            "score": 0,
            "recognized_text": "",
            "expected_text": ""
        }))
        sys.exit(1)
        
    audio_path = sys.argv[1]
    expected_text = sys.argv[2]
    language = sys.argv[3]
    is_spelling_check = '--spelling-check' in sys.argv
    
    if is_spelling_check:
        check_spelling(audio_path, expected_text, language)
    else:
        check_pronunciation(audio_path, expected_text, language)