import requests
import json

category = 'happiness'
api_url = 'https://api.api-ninjas.com/v1/quotes?category={}'.format(category)
response = requests.get(api_url, headers={'X-Api-Key': 'WObJpDyID75V+qscVkHA+g==bDWyBPUIn1Zo0W7UN'})

# Check the response status
if response.status_code == requests.codes.ok:
    # Parse the response JSON to get the quote
    quote = response.json()[0]['quote']  # Assuming the API returns a list of quotes
    print(f"Quote: {quote}")
else:
    quote = "Your potential is endless. Keep pushing forward!"  # Default quote in case of error

output_file = 'quote.json'
quote_data = {'quote': quote}

with open(output_file, 'w') as file:
    json.dump(quote_data, file)

print(f"Quote exported to {output_file}")