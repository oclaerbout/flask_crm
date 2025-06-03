from app import app
from flask import render_template, flash, redirect, url_for, request, session, jsonify
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
import json
from os import environ as env
from app import oauth
import requests
from .forms import AanvraagForm
from .aanvraag import Email
from .machines import Machine
import json
from datetime import date, timedelta
from app.db import get_connection, release_connection



@app.route('/calendar')
def calendar():
    events = [
        {"title": "Boot Camp", "start": "2025-06-01", "color": "green"},
        {"title": "Conference", "start": "2025-06-10", "color": "blue"},
        {"title": "ICT Expo 2025 - Product Release", "start": "2025-06-16", "color": "orange"},
        {"title": "Event With URL", "start": "2025-06-23", "url": "http://google.com", "color": "green"}
    ]
    return render_template('calendar.html', events=events)
