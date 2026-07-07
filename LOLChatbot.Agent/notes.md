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

- make a loading when user sends a message
- make 3 to change between the theme of the app (optional)
- add error message when the agent is not able to answer a question
- use a stream instead of just string

Backend:

- mail verifictation

Agent:

- look at everything at the top of this file.
