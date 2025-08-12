import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import sys

# Load biến môi trường từ file .env
load_dotenv()

# Lấy API key từ biến môi trường
api_key = os.getenv("GEMINI_API_KEY")

# Kiểm tra API key
if not api_key:
    print("❌ Lỗi: Chưa thiết lập GEMINI_API_KEY.")
    print("➡ Cách khắc phục:")
    print("1. Tạo file .env cùng thư mục với app.py, nội dung:")
    print("   GEMINI_API_KEY=YOUR_API_KEY_HERE")
    print("2. Hoặc set biến môi trường trong terminal:")
    print("   Windows PowerShell: $env:GEMINI_API_KEY=\"YOUR_API_KEY_HERE\"")
    print("   CMD: set GEMINI_API_KEY=YOUR_API_KEY_HERE")
    sys.exit(1)

# Cấu hình API Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-2.0-flash")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    try:
        response = model.generate_content(user_message)
        bot_reply = response.text
    except Exception as e:
        bot_reply = f"Lỗi khi gọi API Gemini: {str(e)}"
    return jsonify({"reply": bot_reply})

@app.route("/reset", methods=["POST"])
def reset():
    # Xử lý reset (nếu có), hiện trả về OK
    return jsonify({"status": "reset"})

if __name__ == "__main__":
    app.run(debug=True)
