Things to do:

- Try to fix the issue with Kled and mega ganr base health, the passive is not taken into consideration when calculating his total health.
- For some reason the agent answer the question "What are the 5 champions with the highest base health at level 18? " wrong, he gets 4 champions right but also add qiyana in the list instead of olaf
- make something similar to scan_stats but for abilities
- (Need more test before making sure that this tool is needed) make a tool to get a champion's ability ratio instead of relying on the agent to answer the question by use get_champion_ability
- do rag for champions' lore
- decide if rag would be a good solution to find for an ability's specific effeect like if the ability has a specific CC effect or not (the rag would be used only if the user is asking about abilities in a whole, not for a specific champion's ability)
- make a tool to calculate the total damage of a champion's ability at a specific level, taking into account all scaling factors and ratios OR edit the existing tool OR test if more powerful models can do that
- edit the description of the get_champion_summary tool to know that faction = region
- make a tool similar to scan_stats but for champion's summary, to get the champion's lore, faction, and other information
- maybe do rag also for champion's titles?
- edit scan_attributes so it work like scan_stats
- check why the last test failed