#!/usr/bin/env python

"""main.py - This file contains handlers that are called by taskqueue and/or
cronjobs."""
import logging

import webapp2
from google.appengine.api import mail, app_identity
from api import WordBaitAPI

from models import User, Game


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


app = webapp2.WSGIApplication([
    ('/crons/send_reminder', SendReminderEmail),
    ('/tasks/_cache_average_rounds', UpdateAverageMovesRemaining),
], debug=True)
