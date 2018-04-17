# importing the requests library
import requests
 
# api-endpoint
URL = "https://ancient-beach-92968.herokuapp.com/magic"
 
# location given here
location = "delhi technological university"
 
# defining a params dict for the parameters to be sent to the API
PARAMS = {}
 
# sending get request and saving the response as response object
r = requests.get(url = URL, params = PARAMS)
 
# extracting data in json format
data = r.json()
 
 
# extracting latitude, longitude and formatted address 
# of the first matching location
print(data) 
# printing the