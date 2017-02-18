#!/usr/bin/env python

"""old-main.py - This file contains handlers that are called by taskqueue and/or
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
from oauth2client import client, crypt

import webapp2
from webapp2_extras import auth
from webapp2_extras import sessions
from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError
from google.appengine.api import mail, app_identity
from api import WordBaitAPI

from models import User, Game, Leaderboard
webapp2_config = {}
webapp2_config = {
  'webapp2_extras.auth': {
    'user_model': 'models.User',
    'user_attributes': ['name', 'verified']
  },
  'webapp2_extras.sessions': {
    'secret_key': 'Im_an_alien'
  }
}
CLIENT_ID = '1066114691418-nm0p4krul7jenj0vck20glcrh23nm1lm.apps.googleusercontent.com'

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
        """Shortcut to access the auth instance as a property."""
        return auth.get_auth()

    @webapp2.cached_property
    def session_store(self):
        return sessions.get_store(request=self.request)

    @webapp2.cached_property
    def session(self):
        """Shortcut to access the current session."""
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

    @webapp2.cached_property
    def user_model(self):
        """Returns the implementation of the user model.
        It is consistent with config['webapp2_extras.auth']['user_model'], if set.
        """
        return self.auth.store.user_model

    @webapp2.cached_property
    def user_info(self):
        """Shortcut to access a subset of the user attributes that are stored
        in the session.
        The list of attributes to store in the session is specified in
          config['webapp2_extras.auth']['user_attributes'].
        :returns
          A dictionary with most user information
        """
        return self.auth.get_user_by_session()

    @webapp2.cached_property
    def auth_config(self):
        """
              Dict to hold urls for login/logout
          """
        return {
            'login_url': self.uri_for('login'),
            'logout_url': self.uri_for('logout')
        }

    def send_verification_email(self, user, verification_url):
        """Send a reminder email to each User with an email about games.
        Called every hour using a cron job"""
        app_id = app_identity.get_application_id()
        active_games = Game.query(Game.game_over == False).fetch()
        subject = 'Verification!'
        body = 'Hello {name}, Here is your verification email. Please visit <a href="{url}">{url}</a>'.format(name=user['name'], url=verification_url)
        mail.send_mail('noreply@{}.appspotmail.com'.format(app_id),
                       "snunleys@gmail.com",
                       # user['email'],
                       subject,
                       body)



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
            ret = {
                "token": user['token'],
                "user" : {
                    "name": user['name'],
                    "email": username,
                    "verified": user['verified'],
                    "id": user['user_id']
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

class AccountHandler(BaseHandler):
    def get(self):
        print self.request.authorization[1]
        if self.request.GET['id'] == 'undefined':
            self.response.set_status(403)
            print 'wtf'
            return json.dumps("{'msg': 'Missing ID or Token'}")
        if self.request.authorization[1] == 'null':
            self.response.set_status(403)
            print 'wtf'
            return json.dumps("{'msg': 'Missing ID or Token'}")
        if self.request.authorization[1] == 'undefined':
            self.response.set_status(403)
            print 'wtf'
            return json.dumps("{'msg': 'Missing ID or Token'}")
        user = User.get_by_auth_token(int(self.request.GET['id']), self.request.authorization[1])

        ret = {
            "token": self.request.authorization[1],
            "user": {
                "name": user[0].name,
                "email": user[0].email,
                "verified": user[0].verified,
                "id": self.request.GET['id']
            }
        }
        self.response.headers['Content-Type'] = 'application/json'
        self.response.set_status(200)
        return json.dumps(ret)

class CreateUserHandler(BaseHandler):
    def get(self):
        self.redirect('/')
    def post(self):
        """
              username: Get the username from POST dict
              password: Get the password from POST dict
          """

        jsonobject = json.loads(self.request.body)
        google = jsonobject['google']
        if google:
            token = jsonobject['gtoken']
            try:
                idinfo = client.verify_id_token(token, CLIENT_ID)

                # Or, if multiple clients access the backend server:
                # idinfo = client.verify_id_token(token, None)
                # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
                #    raise crypt.AppIdentityError("Unrecognized client.")

                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    raise crypt.AppIdentityError("Wrong issuer.")

                    # If auth request is from a G Suite domain:
                    # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
                    #    raise crypt.AppIdentityError("Wrong hosted domain.")
            except crypt.AppIdentityError:
                print 'fail'
                # Invalid token
            userid = idinfo['sub']
            print idinfo
            userobject = jsonobject['user']
            username = userobject['email']
            name = userobject['name']
            unique_properties = ['email']
            success, info = self.user_model.create_user(username, unique_properties, name=name,
                                                        email=username, verified=False)
        else:
            username = jsonobject['email']
            password = jsonobject['password']
            name = jsonobject['name']
            unique_properties = ['email']
            success, info = self.user_model.create_user(username, unique_properties, password_raw=password, name=name,
                                                    email=username, verified=False)

        # Passing password_raw=password so password will be hashed
        # Returns a tuple, where first value is BOOL. If True ok, If False no new user is created
        if success:
            # User is created, Redirection is occurring on UI side
            try:
                #Grabbing the user session
                user = self.auth.store.user_to_dict(info)
                self.auth.set_session(user, remember=True)

                user_id = info.get_id()
                token = self.user_model.create_signup_token(user_id)
                verification_url = self.uri_for('verification', type='v', user_id=user_id,
                                                signup_token=token, _full=True)

                self.send_verification_email(user, verification_url)
                ret = {
                    "token": user['token'],
                    "user": {
                        "name": user['name'],
                        "email": username,
                        "verified": user['verified'],
                        "id": user_id
                    }
                }
                self.response.headers['Content-Type'] = 'application/json'
                self.response.set_status(200)
                return json.dumps(ret)
            except (AttributeError, KeyError), e:
                self.abort(403)
        else:
            if google:
                user = self.user_model.get_by_auth_id(username)
                dictUser = self.auth.store.user_to_dict(user)
                self.auth.set_session(dictUser, remember=True)
                ret = {
                    # "token": user['token'],
                    "user": {
                        "name": dictUser['name'],
                        "email": username,
                        "verified": dictUser['verified'],
                        "id": dictUser['user_id']
                    }
                }
                self.response.headers['Content-Type'] = 'application/json'
                self.response.set_status(200)
                return json.dumps(ret)
            else:
                return info # Error message


class VerificationHandler(BaseHandler):
    def get(self, *args, **kwargs):
        user = None
        user_id = kwargs['user_id']
        signup_token = kwargs['signup_token']
        verification_type = kwargs['type']

        # it should be something more concise like
        # self.auth.get_user_by_token(user_id, signup_token)
        # unfortunately the auth interface does not (yet) allow to manipulate
        # signup tokens concisely
        user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token,
                                                     'signup')

        if not user:
            logging.info('Could not find any user with id "%s" signup token "%s"',
                         user_id, signup_token)
            self.abort(404)

        # store user data in the session
        self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)

        if verification_type == 'v':
            # remove signup token, we don't want users to come back with an old link
            self.user_model.delete_signup_token(user.get_id(), signup_token)

            if not user.verified:
                user.verified = True
                user.put()
                leaderboard = Leaderboard(user=user.key, wins=0, losses=0)
                leaderboard.put()

            self.redirect('/')
            # self.display_message('User email address has been verified.')
            return
        elif verification_type == 'p':
            # supply user to the page
            params = {
                'user': user,
                'token': signup_token
            }
            self.redirect('/')
            # self.render_template('resetpassword.html', params)
        else:
            logging.info('verification type not supported')
            self.abort(404)

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
    webapp2.Route(r'/account', handler=AccountHandler, name='account'),
    webapp2.Route(r'/logout', handler=LogoutHandler, name='logout'),
    webapp2.Route(r'/<type:v|p>/<user_id:\d+>-<signup_token:.+>', handler=VerificationHandler, name='verification'),
    webapp2.Route(r'/secure', handler=SecureRequestHandler, name='secure'),
    webapp2.Route(r'/signup', handler=CreateUserHandler, name='create-user'),
    ('/crons/send_reminder', SendReminderEmail),
    ('/tasks/_cache_average_rounds', UpdateAverageMovesRemaining),
], debug=True, config=webapp2_config)