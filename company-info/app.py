from flask import Flask, request, jsonify
from flask_cors import CORS
import wikipediaapi
from bs4 import BeautifulSoup
import requests
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "API is running. Use the /company-info endpoint to fetch company information."

def fetch_google_search_result(query):
    search_url = f"https://www.google.com/search?q={query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(search_url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        for div in soup.find_all('div', class_='hlcw0c'):
            cite = div.find('cite')
            if cite and cite.text:
                return cite.text
    return None

def fetch_wikipedia_page(page_title):
    wiki_url = f"https://en.wikipedia.org/wiki/{page_title}"
    response = requests.get(wiki_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        first_paragraph = None
        for p in soup.find_all('p'):
            if p.text.strip():
                first_paragraph = p
                break

        first_paragraph_text = first_paragraph.text if first_paragraph else "No paragraph found."
        
        infobox = soup.find('table', {'class': 'infobox vcard'})
        if infobox:
            info = infobox.get_text(separator="\n").strip()
            logo_url = f"https:{infobox.find('img')['src']}" if infobox.find('img') else "No logo found"
            url = fetch_google_search_result(page_title)
        else:
            info = "Infobox not found."
            logo_url = "No logo found."
            url = fetch_google_search_result(page_title)

        if not url:
            url = "No official website found"
        
        result = {
            "company_name": page_title,
            "summary": first_paragraph_text,
            "info": info,
            "logo_url": logo_url,
            "url": url
        }

        with open(f"{page_title}.json", "w", encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
        
        return result
    else:
        return {"error": f"Failed to fetch the page. Status code: {response.status_code}"}

@app.route('/company-info', methods=['POST'])
def get_company_info():
    data = request.get_json()
    company_name = data.get('company_name')
    if not company_name:
        return jsonify({"error": "Company name is required"}), 400

    print(f"Fetching info for company: {company_name}")
    company_info = fetch_wikipedia_page(company_name)
    return jsonify(company_info)

if __name__ == '__main__':
    app.run(debug=True)
