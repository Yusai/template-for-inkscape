#http://gotmetoo.blogspot.jp/2013/07/python-simple-http-server-with-svg.html
#!/usr/bin/python 
import SimpleHTTPServer
import SocketServer
import mimetypes

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

Handler.extensions_map['.svg']='image/svg+xml'
httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()