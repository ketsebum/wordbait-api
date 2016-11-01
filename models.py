"""models.py - This file contains the class definitions for the Datastore
entities used by the Game. Because these classes are also regular Python
classes they can include methods (such as 'to_form' and 'new_game')."""

# This import isn't working because of Python rules listed:
# https://cloud.google.com/appengine/kb/?csw=1#libraries
# Install a library that can do proper word validation
# from google.appengine.ext import vendor
# vendor.add('libs')
# import enchant

import random

from random import randint
from datetime import date
from protorpc import messages
from google.appengine.ext import ndb

class User(ndb.Model):
    """User profile"""
    name = ndb.StringProperty(required=True)
    email =ndb.StringProperty()


class Game(ndb.Model):
    """Game object"""
    target = ndb.StringProperty(required=True)
    current_round = ndb.IntegerProperty(required=True, default=1)
    game_over = ndb.BooleanProperty(required=True, default=False)
    cancelled = ndb.BooleanProperty(required=True, default=False)
    turn = ndb.KeyProperty(required=True, kind='User')
    user_one = ndb.KeyProperty(required=True, kind='User')
    user_two = ndb.KeyProperty(required=True, kind='User')
    date = ndb.DateProperty(required=False)
    winner = ndb.KeyProperty(required=False, kind='User')
    loser = ndb.KeyProperty(required=False, kind='User')

    @classmethod
    def new_game(cls, user_one, word):
        """Creates and returns a new game"""
        if len(word) < 4:
            raise ValueError('Minimum word length must be greater than 3')

        # Use the dictionary to validate the words used
        # dictionary = enchant.Dict("en_US")
        # if dictionary.check(word) == False:
        #     raise ValueError('Need to use real words')

        users = User.query(User.key != user_one).fetch()

        # Random Matchmaking
        user_two = users[randint(0,len(users)-1)].key

        # User one has starting word, thus player 2 must respond
        turn = user_two

        # Random Order
        # if randint(1,2) == 1:
        #     turn = user_one
        # else:
        #     turn = user_two

        # Match Creation
        game = Game(user_one=user_one,
                    user_two=user_two,
                    turn=turn,
                    target=word,
                    current_round=1,
                    game_over=False)
        game.put()
        return game

    def to_form(self, message):
        """Returns a GameForm representation of the Game"""
        form = GameForm()
        form.urlsafe_key = self.key.urlsafe()
        form.user_one = self.user_one.get().name
        form.user_two = self.user_two.get().name
        form.turn = self.turn.get().name
        form.current_round = self.current_round
        form.game_over = self.game_over
        form.message = message
        form.bait = self.target[:self.current_round]
        return form
    
    def cancel(self):
        if self.game_over:
            return StringMessage(message="Game already finished, not able to cancel!")
        else:
            self.cancelled = True
            self.game_over = True
            self.put()
            return StringMessage(message="Cancelled Successfully!")


    def to_score_form(self):
        return ScoreForm(winner_name=self.winner.get().name, loser_name=self.loser.get().name,
                         date=str(self.date), rounds=self.current_round)

    def end_game(self, player, final_word):
        """Ends the game - Winner is the user that won - loser is the opposite,
        player"""

        record = GameHistory(game=self.key, target=self.target, move=final_word, user=self.turn, final_guess=True, round=self.current_round)
        record.put()

        # Ending the game
        self.game_over = True
        self.date = date.today()
        returnString = ""

        # Getting each players leaderboard entry
        user_one_board = Leaderboard.query(Leaderboard.user == self.user_one).get()
        user_two_board = Leaderboard.query(Leaderboard.user == self.user_two).get()

        # Figure out who won, and with what word and update the records
        if self.target == final_word:
            if self.user_one == player:
                self.winner = self.user_one
                user_one_board.adjust_record(1)
                self.loser = self.user_two
                user_two_board.adjust_record(-1)
            else:
                self.winner = self.user_two
                user_two_board.adjust_record(1)
                self.loser = self.user_one
                user_one_board.adjust_record(-1)
            returnString = "You win!"
        else:
            if self.user_one == player:
                self.winner = self.user_two
                user_two_board.adjust_record(1)
                self.loser = self.user_one
                user_one_board.adjust_record(-1)
            else:
                self.winner = self.user_one
                user_one_board.adjust_record(1)
                self.loser = self.user_two
                user_two_board.adjust_record(-1)
            returnString = "You lose!"
        self.put()
        return self.to_form(returnString)

    def make_move(self, word):
        """Makes a move"""
        # Advancing the round, updating the word, and updating the user
        # but verify if valid word
        if self.target[:self.current_round] != word[:self.current_round]:
            raise ValueError('Must match original characters from bait to make new word!')
        record = GameHistory(game=self.key, target=self.target, move=word, user=self.turn, final_guess=False, round=self.current_round)
        record.put()
        self.current_round += 1
        self.target = word
        if self.turn == self.user_one:
            self.turn = self.user_two
        else:
            self.turn = self.user_one
        self.put()
        return self.to_form("Nice one!")

    def history(self):
        """Grab the history for this game"""
        history = GameHistory.query(GameHistory.game == self.key).fetch()
        return GameHistoryForms(items=[ref.to_form() for ref in history])

class Leaderboard(ndb.Model):
    """Leaderboard object"""
    user = ndb.KeyProperty(required=True, kind='User')
    wins = ndb.IntegerProperty(required=True)
    losses = ndb.IntegerProperty(required=True)

    def adjust_record(self, adjustment):
        """Adjusts a users record"""
        if adjustment > 0:
            self.wins = self.wins + 1
        else:
            self.losses = self.losses + 1
        self.put()

    def current_rankings(self):
        ranking = Leaderboard.query().order(-Leaderboard.wins)
        return LeaderboardForms(items=[rank.to_form() for rank in ranking])
    
    def to_form(self):
        return LeaderboardForm(user = self.user.get().name, wins = self.wins, losses = self.losses)

class GameHistory(ndb.Model):
    """GameHistory object"""
    game = ndb.KeyProperty(required=True, kind='Game')
    target = ndb.StringProperty(required=True)
    move = ndb.StringProperty(required=True)
    user = ndb.KeyProperty(required=True, kind='User')
    final_guess = ndb.BooleanProperty(required=True)
    round = ndb.IntegerProperty(required=True)

    def to_form(self):
        return GameHistoryForm(user=self.user.get().name, target=self.target, final_guess=self.final_guess, move=self.move, round=self.round)

class LeaderboardForm(messages.Message):
    """LeaderboardForm for outbound game Leaderboard information"""
    user = messages.StringField(1, required=True)
    wins = messages.IntegerField(2, required=True)
    losses = messages.IntegerField(3, required=True)

class LeaderboardForms(messages.Message):
    """Return multiple LeaderboardForms"""
    items = messages.MessageField(LeaderboardForm, 1, repeated=True)

class GameHistoryForm(messages.Message):
    """GameForm for outbound game state information"""
    user = messages.StringField(1, required=True)
    target = messages.StringField(2, required=True)
    final_guess = messages.BooleanField(3, required=True)
    move = messages.StringField(4, required=True)
    round = messages.IntegerField(5, required=True)

class GameHistoryForms(messages.Message):
    """Return multiple GameHistoryForms"""
    items = messages.MessageField(GameHistoryForm, 1, repeated=True)

class GameForm(messages.Message):
    """GameForm for outbound game state information"""
    urlsafe_key = messages.StringField(1, required=True)
    current_round = messages.IntegerField(2, required=True)
    game_over = messages.BooleanField(3, required=True)
    message = messages.StringField(4, required=True)
    bait = messages.StringField(5, required=True)
    user_one = messages.StringField(6, required=True)
    user_two = messages.StringField(7, required=True)
    turn = messages.StringField(8, required=True)

class GameForms(messages.Message):
    """Return multiple ScoreForms"""
    items = messages.MessageField(GameForm, 1, repeated=True)


class NewGameForm(messages.Message):
    """Used to create a new game"""
    user_name = messages.StringField(1, required=True)
    word = messages.StringField(2, required=True)


class MakeMoveForm(messages.Message):
    """Used to make a move in an existing game"""
    word = messages.StringField(1, required=True)
    user_name = messages.StringField(2, required=True)
    final_guess = messages.BooleanField(3, required=True)


class ScoreForm(messages.Message):
    """ScoreForm for outbound Score information"""
    winner_name = messages.StringField(1, required=True)
    loser_name = messages.StringField(2, required=True)
    date = messages.StringField(3, required=True)
    rounds = messages.IntegerField(4, required=True)


class ScoreForms(messages.Message):
    """Return multiple ScoreForms"""
    items = messages.MessageField(ScoreForm, 1, repeated=True)


class StringMessage(messages.Message):
    """StringMessage-- outbound (single) string message"""
    message = messages.StringField(1, required=True)
