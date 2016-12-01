#!/usr/bin/env python

"""main.py - This file contains handlers that are called by taskqueue and/or
cronjobs."""
import logging

from google.appengine.ext import vendor

vendor.add('lib')
import httplib2

import os
import json

from googleapiclient import discovery
from oauth2client import client
from oauth2client.contrib import appengine
from google.appengine.api import memcache

import webapp2
from webapp2_extras import auth
from webapp2_extras import sessions
from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError
from google.appengine.api import mail, app_identity
from api import WordBaitAPI

from models import User, Game
webapp2_config = {}
webapp2_config = {
  'webapp2_extras.auth': {
    'user_model': 'models.User',
    'user_attributes': ['name']
  },
  'webapp2_extras.sessions': {
    'secret_key': 'Im_an_alien'
  }
}

def user_required(handler):
    """
         Decorator for checking if there's a user associated with the current session.
         Will also fail if there's no session present.
     """

    def check_login(self, *args, **kwargs):
        auth = self.auth
        if not auth.get_user_by_session():
            # If handler has no login_url specified invoke a 403 error
            try:
                self.redirect(self.auth_config['login_url'], abort=True)
            except (AttributeError, KeyError), e:
                self.abort(403)
        else:
            return handler(self, *args, **kwargs)

    return check_login


class BaseHandler(webapp2.RequestHandler):
    """
         BaseHandler for all requests

         Holds the auth and session properties so they are reachable for all requests
     """

    def dispatch(self):
        """
              Save the sessions for preservation across requests
          """
        try:
            response = super(BaseHandler, self).dispatch()
            self.response.write(response)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def auth(self):
        return auth.get_auth()

    @webapp2.cached_property
    def session_store(self):
        return sessions.get_store(request=self.request)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

    @webapp2.cached_property
    def auth_config(self):
        """
              Dict to hold urls for login/logout
          """
        return {
            'login_url': self.uri_for('login'),
            'logout_url': self.uri_for('logout')
        }


class LoginHandler(BaseHandler):
    def get(self):
        self.redirect('/')
    def post(self):
        """
              username: Get the username from POST dict
              password: Get the password from POST dict
          """
        jsonobject = json.loads(self.request.body)
        username = jsonobject['email']
        password = jsonobject['password']
        # Try to login user with password
        # Raises InvalidAuthIdError if user is not found
        # Raises InvalidPasswordError if provided password doesn't match with specified user
        try:
            user = self.auth.get_user_by_password(username, password)
            print user
            ret = {
                "token": user['token'],
                "user" : {
                    "name": user['name']
                    # "email": user['email']
                }
            }
            self.response.headers['Content-Type'] = 'application/json'
            self.response.set_status(200)
            return json.dumps(ret)
        except (InvalidAuthIdError, InvalidPasswordError), e:
            # Returns error message to self.response.write in the BaseHandler.dispatcher
            # Currently no message is attached to the exceptions
            print "EXCEPTION"
            self.response.write("{'msg': 'invalid e-mail or password'}")
            self.response.set_status(401)
            return e

class CreateUserHandler(BaseHandler):
    def get(self):
        self.redirect('/')
    def post(self):
        """
              username: Get the username from POST dict
              password: Get the password from POST dict
          """
        jsonobject = json.loads(self.request.body)

        username = jsonobject['email']
        password = jsonobject['password']
        name = jsonobject['name']

        # Passing password_raw=password so password will be hashed
        # Returns a tuple, where first value is BOOL. If True ok, If False no new user is created
        success, info = self.auth.store.user_model.create_user(username, password_raw=password, name=name, email=username)
        if success:
            # User is created, Redirection is occurring on UI side
            try:
                #Grabbing the user session
                user = self.auth.store.user_to_dict(info)
                self.auth.set_session(user, remember=True)
                ret = {
                    "token": user['token'],
                    "user": {
                        "name": user['name']
                        # "email": user['email']
                    }
                }
                self.response.headers['Content-Type'] = 'application/json'
                self.response.set_status(200)
                return json.dumps(ret)
            except (AttributeError, KeyError), e:
                self.abort(403)
        else:
            return info # Error message

class LogoutHandler(BaseHandler):
    """
         Destroy user session and redirect to login
     """

    def get(self):
        self.auth.unset_session()
        # User is logged out, let's try redirecting to login page
        try:
            self.redirect(self.auth_config['login_url'])
        except (AttributeError, KeyError), e:
            return "User is logged out"


class SecureRequestHandler(BaseHandler):
    """
         Only accessible to users that are logged in
     """

    @user_required
    def get(self, **kwargs):
        user = self.auth.get_user_by_session()
        try:
            return "Secure zone for %s <a href='%s'>Logout</a>" % (str(user), self.auth_config['logout_url'])
        except (AttributeError, KeyError), e:
            return "Secure zone"


class SendReminderEmail(webapp2.RequestHandler):
    def get(self):
        """Send a reminder email to each User with an email about games.
        Called every hour using a cron job"""
        app_id = app_identity.get_application_id()
        active_games = Game.query(Game.game_over == False).fetch()
        for game in active_games:
            subject = 'This is a reminder!'
            body = 'Hello {}, You stil have an active game going, and it\'s your turn!'.format(game.turn.get().name)
            mail.send_mail('noreply@{}.appspotmail.com'.format(app_id),
                           game.turn.get().email,
                           subject,
                           body)


class UpdateAverageMovesRemaining(webapp2.RequestHandler):
    def post(self):
        """Update game listing announcement in memcache."""
        WordBaitAPI._cache_average_rounds()
        self.response.set_status(204)

class MainEntry(BaseHandler):
    def get(self):
        test_value = self.session.get('currentuser')
        if test_value:
            self.response.write('Session has this value: %r.' % test_value)
        else:
            self.redirect_to('login')
            self.response.write('Session is empty.')

app = webapp2.WSGIApplication([
    ('/', MainEntry),
    webapp2.Route(r'/login', handler=LoginHandler, name='login'),
    webapp2.Route(r'/logout', handler=LogoutHandler, name='logout'),
    webapp2.Route(r'/secure', handler=SecureRequestHandler, name='secure'),
    webapp2.Route(r'/signup', handler=CreateUserHandler, name='create-user'),
    ('/crons/send_reminder', SendReminderEmail),
    ('/tasks/_cache_average_rounds', UpdateAverageMovesRemaining),
], debug=True, config=webapp2_config)