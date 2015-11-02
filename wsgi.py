from flask import Flask, request, redirect, render_template
import os, jinja2
import psycopg2
import urlparse

app = Flask(__name__)
app.config['DEBUG'] = True
app.jinja_loader = jinja2.FileSystemLoader(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates'))
# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.

postgresDBURL='postgres://jfwlnoqvhypork:wiXIa8SXKakPG4zPCq8X8N7tA6@ec2-107-21-221-59.compute-1.amazonaws.com:5432/d4dlm1bf4irvif'

urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ[postgresDBURL])

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

@app.route('/')
def hello():
    return render_template('index.html')

@app.errorhandler(404)
def page_not_found(e):
    return redirect("/#/access/404")

if __name__ == '__main__':
    app.run()
