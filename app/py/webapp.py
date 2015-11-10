#!/usr/bin/env python
import bottle as bt

#This file should be located in /YourApp/py/
#Therefore, the file location should be /YourApp/py/webapp.py
#Do not forget to chmod 755 this file before running on your linux server

#'/' indicates http://IPhere
@bt.route('/', method = "GET")
def index():
    
    #index.html file should be in /YourApp/
    #Such that the function below points from the file location that webapp.py is in, to the directory above it
    
    f = open('../index.html')
    return f.read()

bt.debug(True)

#Set your host(Web Server IP) here, port 80 will only require you to type in the Web Server IP to access the web page

if __name__ == '__main__':
    bt.run(host='104.131.246.240', port=80, debug=True)