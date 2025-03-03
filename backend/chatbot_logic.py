import google.generativeai as genai
import time
import re

# Đặt API key cho Gemini
API_KEY = "AIzaSyBWHNuLH-RMoCSxa1TMnZ9pFaVl43z8CCQ"
genai.configure(api_key=API_KEY)

def get_response(user_message: str) -> str:
    # Model mới khuyến khích: "gemini-1.5-flash-001" hoặc "gemini-1.5-pro-001"
    model = genai.GenerativeModel("gemini-1.5-flash-001")

    prompt = f"""
    Bạn là chatbot tư vấn tuyển sinh của trường Đại học Khoa học Tự nhiên.
    Trả lời ngắn gọn, dễ hiểu các câu hỏi của sinh viên về:
    - Ngành đào tạo
    - Điểm chuẩn các năm
    - Học phí
    - Cơ hội việc làm sau khi ra trường
    - Các thông tin về cơ sở vật chất, học bổng, ký túc xá nếu cần.

    Người dùng hỏi: "{user_message}"

    Trả lời:
    """

    retries = 0
    max_retries = 5
    retry_delay = 3  # chờ 3 giây nếu gặp lỗi 429
    timeout = 10  # timeout tối đa 10 giây mỗi request

    while retries < max_retries:
        start_time = time.time()
        try:
            response = model.generate_content(prompt)
            if time.time() - start_time > timeout:
                print("⚠️ Cảnh báo: Gọi API mất quá nhiều thời gian.")
                return "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau."

            response_text = response.text.strip()

            # Loại bỏ ký hiệu markdown nếu có (đề phòng model trả về dạng code block)
            response_text = re.sub(r'```[\w]*', '', response_text).strip()

            return response_text

        except Exception as e:
            print(f"❌ Lỗi khi gọi Gemini API (lần {retries+1}/{max_retries}): {str(e)}")

            if "429" in str(e):  # Quá tải request
                time.sleep(retry_delay)
                retries += 1
            else:
                break  # Lỗi khác thì không retry

    return "Xin lỗi, hiện tại chatbot đang gặp sự cố. Vui lòng thử lại sau!"

