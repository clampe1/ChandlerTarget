import sys
import urllib.request 
import json
import requests
		
def LoadDatabase(URL):
	request = urllib.request.Request(URL)
	try: response  = urllib.request.urlopen(request)
	except urllib.error.URLError as e:
		   print(e.reason)
		   sys.exit()  	
	return response;



URL = "http://localhost:5000/products/"

print("Current items loaded in pricing database:\n54566983\n54191101\n54191097\n82866370\n54191104\n80930571")
while True: 
	sufURL = input("Enter Product Number or q to quit: ")
	if sufURL == "q" or sufURL == "Q":
		quit()

	FULLURL = URL + sufURL 
	res = LoadDatabase(FULLURL)
	print(res.read())

