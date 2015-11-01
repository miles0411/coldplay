from flask import Flask, request, redirect, render_template
import os, jinja2

app = Flask(__name__)
app.config['DEBUG'] = True
app.jinja_loader = jinja2.FileSystemLoader(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates'))
virtenv = os.path.join(os.environ.get('OPENSHIFT_PYTHON_DIR','.'), 'virtenv')
# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.

@app.route('/')
def hello():
    return render_template('index.html')


@app.errorhandler(404)
def page_not_found(e):
    return redirect("/#/access/404")

if __name__ == '__main__':
    app.run()
