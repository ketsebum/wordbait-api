# -*- coding: utf-8 -*-`
"""api.py - Create and configure the Game API exposing the resources.
This can also contain game logic. For more complex games it would be wise to
move game logic to another file. Ideally the API will be simple, concerned
primarily with communication to/from the API's users."""


import logging
import endpoints
from protorpc import remote, messages
from google.appengine.api import memcache
from google.appengine.api import taskqueue

from models import User, Game, GameHistory
from models import StringMessage, NewGameForm, GameForm, MakeMoveForm,\
    ScoreForms, GameForms, Leaderboard, LeaderboardForm, LeaderboardForms, GameHistoryForm, GameHistoryForms
from utils import get_by_urlsafe, get_user

NEW_GAME_REQUEST = endpoints.ResourceContainer(NewGameForm)
GET_GAME_REQUEST = endpoints.ResourceContainer(
        urlsafe_game_key=messages.StringField(1),)
MAKE_MOVE_REQUEST = endpoints.ResourceContainer(
    MakeMoveForm,
    urlsafe_game_key=messages.StringField(1),)
USER_REQUEST = endpoints.ResourceContainer(user_name=messages.StringField(1),
                                           email=messages.StringField(2))

MEMCACHE_MOVES_REMAINING = 'MOVES_REMAINING'

@endpoints.api(name='word_bait', version='v1')
class WordBaitAPI(remote.Service):
    """Game API"""
    @endpoints.method(request_message=USER_REQUEST,
                      response_message=StringMessage,
                      path='user',
                      name='create_user',
                      http_method='POST')
    def create_user(self, request):
        """Create a User. Requires a unique username"""
        if User.query(User.name == request.user_name).get():
            raise endpoints.ConflictException(
                    'A User with that name already exists!')
        user = User(name=request.user_name, email=request.email)
        user.put()
        leaderboard = Leaderboard(user=user.key, wins=0, losses=0)
        leaderboard.put()
        return StringMessage(message='User {} created!'.format(
                request.user_name))

    @endpoints.method(request_message=NEW_GAME_REQUEST,
                      response_message=GameForm,
                      path='game',
                      name='new_game',
                      http_method='POST')
    def new_game(self, request):
        """Creates new game"""
        user = get_user(request.user_name)

        try:
            game = Game.new_game(user.key, request.word)
        except ValueError:
            raise endpoints.BadRequestException('Minimum word length must be greater than 3!')

        # Use a task queue to update the average current_round remaining.
        # This operation is not needed to complete the creation of a new game
        # so it is performed out of sequence.
        taskqueue.add(url='/tasks/cache_average_current_rounds')
        return game.to_form('Good luck playing Word Bait!')

    @endpoints.method(request_message=GET_GAME_REQUEST,
                      response_message=GameForm,
                      path='game/{urlsafe_game_key}',
                      name='get_game',
                      http_method='GET')
    def get_game(self, request):
        """Return the current game state."""
        game = get_by_urlsafe(request.urlsafe_game_key, Game)
        if game:
            return game.to_form('Time to make a move!')
        else:
            raise endpoints.NotFoundException('Game not found!')

    @endpoints.method(request_message=MAKE_MOVE_REQUEST,
                      response_message=GameForm,
                      path='game/{urlsafe_game_key}',
                      name='make_move',
                      http_method='PUT')
    def make_move(self, request):
        """Makes a move. Returns a game state with message"""
        # Game being played & User playing
        game = get_by_urlsafe(request.urlsafe_game_key, Game)
        user = get_user(request.user_name)

        # Not valid attempts on the game
        if game.game_over:
            raise endpoints.ForbiddenException('Illegal action: Game is already over.')
        if game.turn != user.key:
            raise endpoints.ForbiddenException('Illegal action: Not your turn.')

        # Checking Win Condition
        if request.final_guess:
            return game.end_game(user.key, request.word)
        else:
            try:
                return game.make_move(request.word)
            except ValueError:
                raise endpoints.BadRequestException('Must match original characters from bait to make new word!')

    @endpoints.method(response_message=ScoreForms,
                      path='scores',
                      name='get_scores',
                      http_method='GET')
    def get_scores(self, request):
        """Return all scores"""
        return ScoreForms(items=[score.to_score_form() for score in Game.query(Game.game_over == True)])

    @endpoints.method(request_message=USER_REQUEST,
                      response_message=ScoreForms,
                      path='scores/user/{user_name}',
                      name='get_user_scores',
                      http_method='GET')
    def get_user_scores(self, request):
        """Returns all of an individual User's scores"""
        user = get_user(request.user_name)

        wins = Game.query(Game.winner == user.key).fetch()
        losses = Game.query(Game.loser == user.key).fetch()
        record = wins + losses
        return ScoreForms(items=[score.to_form() for score in record])

    @endpoints.method(response_message=StringMessage,
                      path='games/average_rounds',
                      name='get_average_rounds',
                      http_method='GET')
    def get_average_rounds(self, request):
        """Get the cached average moves remaining"""
        return StringMessage(message=memcache.get(MEMCACHE_MOVES_REMAINING) or '')

    @endpoints.method(response_message=GameForms,
                      path='games',
                      name='get_games',
                      http_method='GET')
    def get_games(self, request):
        """Return all games"""
        games = Game.query()
        return GameForms(items=[game.to_form('Games') for game in games])

    @endpoints.method(request_message=USER_REQUEST,
                      response_message=GameForms,
                      path='games/active/{user_name}',
                      name='get_user_games',
                      http_method='GET')
    def get_user_games(self, request):
        """Return all active games for specified user"""
        user = get_user(request.user_name)

        games_one = Game.query(Game.user_one == user.key, Game.game_over == False).fetch()
        games_two = Game.query(Game.user_two == user.key, Game.game_over == False).fetch()
        games = games_one + games_two
        return GameForms(items=[game.to_form('Games') for game in games])

    @endpoints.method(request_message=GET_GAME_REQUEST,
                      response_message=StringMessage,
                      path='cancel/{urlsafe_game_key}',
                      name='cancel_game',
                      http_method='GET')
    def cancel_game(self, request):
        """Cancel the game"""
        game = get_by_urlsafe(request.urlsafe_game_key, Game)
        return game.cancel()

    # Not needed because of two player game
    # @endpoints.method(response_message=StringMessage,
    #                   path='high/scores',
    #                   name='get_high_scores',
    #                   http_method='GET')
    # def get_high_scores(self, request):
    #     """Return all high scores"""

    @endpoints.method(response_message=LeaderboardForms,
                      path='rank',
                      name='get_user_rankings',
                      http_method='GET')
    def get_user_rankings(self, request):
        """Return all rank"""
        return Leaderboard.query().get().current_rankings()

    @endpoints.method(request_message=GET_GAME_REQUEST,
                      response_message=GameHistoryForms,
                      path='history/{urlsafe_game_key}',
                      name='get_game_history',
                      http_method='GET')
    def get_game_history(self, request):
        """Return all history"""
        game = get_by_urlsafe(request.urlsafe_game_key, Game)
        return game.history()

    @staticmethod
    def _cache_average_rounds():
        """Populates memcache with the average moves remaining of Games"""
        games = Game.query(Game.game_over == False).fetch()
        if games:
            count = len(games)
            total_current_round = sum([game.current_round
                                        for game in games])
            average = float(total_current_round)/count
            memcache.set(MEMCACHE_MOVES_REMAINING,
                         'The average moves remaining is {:.2f}'.format(average))

api = endpoints.api_server([WordBaitAPI])
