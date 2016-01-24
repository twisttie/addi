# simple_server.py
# ================ 
# runs a simple server for tests and builds

import SimpleHTTPServer
import SocketServer
import os

HOST = "localhost"

PORT = 8080

HANDLER = SimpleHTTPServer.SimpleHTTPRequestHandler

os.chdir("./")

httpd = SocketServer.TCPServer((HOST, PORT), HANDLER)

print ("Serving at: http://%s:%s" % (HOST, PORT))
httpd.serve_forever()