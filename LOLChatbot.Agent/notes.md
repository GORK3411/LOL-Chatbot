Things to do:

- stats:
  - Try to fix the issue with Kled and mega ganr base health, the passive is not taken into consideration when calculating his total health.
  - For some reason the agent answer the question "What are the 5 champions with the highest base health at level 18? " wrong, he gets 4 champions right but also add qiyana in the list instead of olaf
  - add random for the order of the champions in scan_stats
- abilities:
  - make something similar to scan_stats but for abilities (done)
  - (Need more test before making sure that this tool is needed) make a tool to get a champion's ability ratio instead of relying on the agent to answer the question by use get_champion_ability
  - see why the rag is not workgin well
  - make a tool to calculate the total damage of a champion's ability at a specific level, taking into account all scaling factors and ratios OR edit the existing tool OR test if more powerful models can do that
- other:
  - do rag for champions' lore
  - edit the description of the get_champion_summary tool to know that faction = region
  - make a tool similar to scan_stats but for champion's summary, to get the champion's lore, faction, and other information
  - maybe do rag also for champion's titles?
  - edit scan_attributes so it work like scan_stats
  - check why the last test failed

scan_abilities: return a a list of object which contains a champoin with one ability that follows the inputs.
inputs:

- ability_type (optional): string, the type of the ability (Q, W, E, R)
- limit: integer, the number of abilities to return
- offset: integer, the number of abilities to skip before starting to return results
- filter : dict for things to search? (maybe split it based on the field to search)
- needed_fields: list of strings, the fields to return for each ability (default is only name and champion)

---

UI:

- make 3 to change between the theme of the app (optional)
- add error message when the agent is not able to answer a question, also add in the chat schema a "is generating" attribute so that we know if the last message in a conversation should be a regular message or a loading message or an error message

- use a stream instead of just string

Backend:

- mail verifictation
- errors handling

Agent:

- look at everything at the top of this file.

---

finish everything in the backend and front end so I can focus on agent

The user's flow should be:
Login -> registration -> email verification -> login -> chat with the agent

Login:
when the user tries to login one of the following should happen:

- if the user is registered and verified, he is redirected to the chat page
- if the user is registered but not verified, the user get a button to resend the verification email and a message telling him to check his email IN THE LOGIN PAGE
- if the user is not registered, just say that the user does not exist
- if the user is registered and verified but the password is wrong, just say that the password is wrong

register:
when the user tries to register one of the following should happen:

- user have to put a valid email and a password, if the email is already registered, just say that the user is already registered
- if the email is not valid, just say that the email is not valid
- if the password is not valid, just say that the password is not valid
- if the email and password are valid, send a verification email to the user and redirect him to a page that says that he should check his email to verify his account, and also add a button to resend the verification email and a button to go back to the login page

chatpage:

- the user can see all chats and select one to continue the conversation or start a new one
- when the user chats with the agent one of the following should happen:
  - if the agent is able to answer the question, it should return the answer
  - if the agent is not able to answer the question, it should return an error message and a button to try again
  - if the agent is generating an answer, it should return a loading message
