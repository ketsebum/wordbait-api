##Game Description:
WORD BAIT
----------------
- opponents enter words and try to guess each other's word
- only the next letter is submitted for each word
- new words built depending on previous letter in sequence submitted by opponent

								HOW TO PLAY
							--------------------
- Starting player enters a word
- First letter of word is displayed for other player
- Other player chooses to "Guess Word" or "Enter New Word" using the Letter(s) displayed
- If player chooses to "Guess Word", he must enter the word with correct spelling
  - if wrong, loses round
  - if right, wins round
- If player chooses to "Enter New Word", he must come up with a new word beginning with the letter or letters displayed, and enter that new word
- Starting player now gets the same options
- First player to guess correct word wins

									Example1
								------------
Player1: Enters "Sample"
Displayed: S
Player2: Enters "Song"
Displayed: S-O
Player1: Enters "Sound"
Displayed: S-O-U
Player2: Guesses "SOUND" and wins 
									Example2
								-------------
Player1: Enters "Time"
Displayed: T
Player2: Enters "Torque"
Displayed: T-O
Player1: Enters "Toggled"
Displayed: T-O-G
Player2: Guesses "TOGGLE" and loses

									FEATURES
				--------------------------------------------
- Players must enter word and submit in order for next letter to be displayed
- Must be final guess to end the game
- Turn based
- Random matchmaking
- Scoring currently based on pure win / loss

##Files Included:
 - api.py: Contains endpoints and game playing logic.
 - app.yaml: App configuration.
 - cron.yaml: Cronjob configuration.
 - main.py: Handler for taskqueue handler.
 - models.py: Entity and message definitions including helper methods.
 - utils.py: Helper function for retrieving ndb.Models by urlsafe Key string.

##Endpoints Included:
 - **create_user**
    - Path: 'user'
    - Method: POST
    - Parameters: user_name, email (optional)
    - Returns: Message confirming creation of the User.
    - Description: Creates a new User. user_name provided must be unique. Will 
    raise a ConflictException if a User with that user_name already exists.
    
 - **new_game**
    - Path: 'game'
    - Method: POST
    - Parameters: user_name, word
    - Returns: GameForm with initial game state.
    - Description: Creates a new Game. user_name provided must correspond to an
    existing user - will raise a NotFoundException if not. Word must be longer than
    4 characters long/
     
 - **get_game**
    - Path: 'game/{urlsafe_game_key}'
    - Method: GET
    - Parameters: urlsafe_game_key
    - Returns: GameForm with current game state.
    - Description: Returns the current state of a game.
    
 - **make_move**
    - Path: 'game/{urlsafe_game_key}'
    - Method: PUT
    - Parameters: urlsafe_game_key, word, final_guess, user
    - Returns: GameForm with new game state.
    - Description: Accepts a 'guess' and returns the updated state of the game.
    If this causes a game to end, a corresponding Score entity will be created.
    
 - **get_scores**
    - Path: 'scores'
    - Method: GET
    - Parameters: None
    - Returns: ScoreForms.
    - Description: Returns all Scores in the database (unordered).
    
 - **get_user_scores**
    - Path: 'scores/user/{user_name}'
    - Method: GET
    - Parameters: user_name
    - Returns: ScoreForms. 
    - Description: Returns all Scores recorded by the provided player (unordered).
    Will raise a NotFoundException if the User does not exist.

- **get_user_rankings**
    - Path: 'rank'
    - Method: GET
    - Parameters: None
    - Returns: LeaderboardForms
    - Description: Gets the current leaderboard

- **cancel_game**
    - Path: 'cancel/{urlsafe_game_key}'
    - Method: GET
    - Parameters: urlsafe_game_key
    - Returns: StringMessage
    - Description: Cancel's a specified game, as long as it hasn't finished.

- **get_game_history**
    - Path: 'history/{urlsafe_game_key}'
    - Method: GET
    - Parameters: urlsafe_game_key
    - Returns: GameHistoryForms
    - Description: Gets the history of all the moves a single game.

##Models Included:
 - **User**
    - Stores unique user_name and (optional) email address.
    
 - **Game**
    - Stores unique game states. Associated with User model via KeyProperty.
    
 - **Leaderboard**
    - Records completed games win / loss. Associated with Users model via KeyProperty.
 
 - **GameHistory**
    - Records each move that happens in a game associated to a game.
    
##Forms Included:
 - **GameForm**
    - Representation of a Game's state (urlsafe_key, attempts_remaining,
    game_over flag, message, user_name).
 - **NewGameForm**
    - Used to create a new game (user_name, min, max, attempts)
 - **MakeMoveForm**
    - Inbound make move form (guess).
 - **ScoreForm**
    - Representation of a completed game's Score (user_name, date, won flag,
    guesses).
 - **ScoreForms**
    - Multiple ScoreForm container.
 - **StringMessage**
    - General purpose String container.
 - **LeaderboardForms**
    - Representation of a Game's current leaderboard.
 - **LeaderboardForms**
    - Multiple LeaderboardForm container.
 - **GameHistoryForms**
    - Representation of a Game's history.
 - **GameHistoryForms**
    - Multiple GameHistoryForm container.
