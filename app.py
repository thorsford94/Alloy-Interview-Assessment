from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import requests
import json

app = Flask(__name__)
CORS(app)

workflow_token = ''
workflow_secret = ''

def main(data):
    url = "https://sandbox.alloy.co/v1/evaluations"
    credentials = f"{workflow_token}:{workflow_secret}"
    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {encoded_credentials}"
    }

    response = requests.post(url, headers=headers, json=data)


    json_response = response.json()
    outcome = json_response.get('summary', {}).get('outcome')
    return outcome


@app.route('/submit', methods=['POST'])
def submit_form():
    data = request.json
    request_data = {
        "name_first": data.get('FirstName'),
        "name_last": data.get('LastName'),
        "email_address": data.get('email'),
        "address_line_1": data.get('AddressLine1'),
        "address_line_2": data.get('AddressLine2', ''),
        "address_city": data.get('City'),
        "address_state": data.get('State'),
        "address_postal_code": data.get('PostalCode'),
        "address_country_code": data.get('Country'),
        "birth_date": data.get('DateOfBirth'),
        "document_ssn": data.get('SSN'),
    }

    response_data = main(request_data)
    if response_data == 'Manual Review':
        response_data = "Thanks for submitting your application, we'll be in touch shortly"
    elif response_data == 'Denied':
        response_data = "Sorry, your application was not successful"
    elif response_data == 'Approved':
        response_data = response_data

    return jsonify({"summary": {"outcome": response_data}}), 200

if __name__ == '__main__':
    app.run(debug=True)




